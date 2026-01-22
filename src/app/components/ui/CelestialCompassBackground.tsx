import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CelestialCompassBackgroundProps {
  config?: {
    nodeCount?: number;
    lineOpacity?: number;
    gridOpacity?: number;
    ringOpacity?: number;
    parallax?: number;
    dustMotes?: number;
    vignetteStrength?: number;
  };
}

export function CelestialCompassBackground({ config = {} }: CelestialCompassBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  // Configuration - TUNE INTENSITY HERE
  const {
    nodeCount = 20,
    lineOpacity = 0.03,
    gridOpacity = 0.02,
    ringOpacity = 0.03,
    parallax = 6,
    dustMotes = 15,
    vignetteStrength = 0.55
  } = config;

  // Mouse parallax state - REMOVED for stability
  // const mouseRef = useRef({ x: 0, y: 0 });
  // const targetMouseRef = useRef({ x: 0, y: 0 });

  // useEffect(() => {
  //   // Parallax removed based on user feedback
  // }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = mediaQuery.matches;
    const handleMediaChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;
    let animationFrameId: number;
    let time = 0;

    // --- Entities ---
    
    // Nodes for constellation (Structured)
    interface Node {
      x: number;
      y: number;
      baseRadius: number;
      phase: number;
      pulseSpeed: number;
      connections: number[]; // indices of connected nodes
      isAnchor?: boolean; // Highlighted nodes
    }
    const nodes: Node[] = [];

    // Dust motes
    interface Mote {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }
    const motes: Mote[] = [];

    // Rings (Compass)
    interface Ring {
      radius: number;
      width: number;
      type: 'solid' | 'dashed' | 'ticks' | 'gradient';
      dashSegments?: number;
      rotation: number;
      rotationSpeed: number;
      rotationOffset: number;
      color?: string;
    }
    const rings: Ring[] = [];

    // Initialization
    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr);

      // --- Structured Layout Generation ---
      
      // 1. Compass Center (Centered)
      const cx = width * 0.5; 
      const cy = height * 0.5;

      // 2. Nodes: Create a "Converging Web" pattern across screen
      nodes.length = 0;
      
      const columns = 8;
      const startX = width * 0.05;
      const endX = width * 0.95;
      
      for (let col = 0; col < columns; col++) {
        // Calculate X position
        const t = col / (columns - 1); // 0 to 1
        const x = startX + (endX - startX) * t;
        
        // Calculate Spread (height) at this column
        // Starts wide, gets narrower as it approaches compass
        // Use a trapezoid shape
        const spreadRatio = 1 - (t * 0.6); // 1.0 -> 0.4
        const spreadHeight = height * 0.7 * spreadRatio;
        
        // Number of nodes in this column
        // Middle columns have more, ends have fewer? Or consistent?
        // Let's do a diamond distribution of count: 3, 4, 5, 4, 3, 2
        // Or just consistent for the "grid" look in reference.
        const nodesInCol = 3 + Math.round(Math.random()); // 3 or 4 nodes per column
        
        const startY = (height - spreadHeight) / 2;
        const stepY = spreadHeight / (nodesInCol - 1 || 1);

        for (let row = 0; row < nodesInCol; row++) {
           // Add slight randomization to position so it's not perfect grid
           const jitterX = (Math.random() - 0.5) * 20;
           const jitterY = (Math.random() - 0.5) * 20;
           
           nodes.push({
             x: x + jitterX,
             y: startY + row * stepY + jitterY,
             baseRadius: Math.random() * 1.5 + 2.0, // Slightly larger nodes
             phase: Math.random() * Math.PI * 2,
             pulseSpeed: 0.002 + Math.random() * 0.006,
             connections: [],
             isAnchor: Math.random() > 0.8 // 20% chance to be a "major" node
           });
        }
      }

      // Generate Connections (Left to Right mainly)
      // Connect each node to 1-2 nodes in the NEXT column
      let colStartIndex = 0;
      for (let col = 0; col < columns - 1; col++) {
        // Count nodes in current and next column
        // We didn't store them by column, so we have to infer or reconstruct.
        // Actually simpler to just distance check "forward" neighbors.
        
        // For every node, find closest nodes that are to the RIGHT (x > node.x + 10)
        // and connect to them.
        nodes.forEach((node, i) => {
           // Find candidates (Omnidirectional now since we are centered)
           // Connect to closest nodes generally
           const candidates = nodes
             .map((n, idx) => ({ idx, n, dist: (n.x - node.x) ** 2 + (n.y - node.y) ** 2 }))
             .filter(c => c.dist > 2500 && c.dist < (width / columns * 1.5) ** 2) // Min 50px, Max adjacent col
             .sort((a, b) => a.dist - b.dist);
             
           // Connect to top 1-2 closest
           const numConnections = 1 + Math.floor(Math.random() * 2);
           for (let k = 0; k < Math.min(numConnections, candidates.length); k++) {
             if (!node.connections.includes(candidates[k].idx)) {
               node.connections.push(candidates[k].idx);
             }
           }
        });
      }

      // Initialize Motes (Stars)
      motes.length = 0;
      for (let i = 0; i < dustMotes * 2; i++) { // Increase count slightly for nebula feel
        motes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.02,
          vy: (Math.random() - 0.5) * 0.02,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.3 + 0.1
        });
      }

      // Initialize Rings (Centered on CX, CY)
      rings.length = 0;
      const baseSize = Math.min(width, height);
      
      // 1. Large Faint Outer Ring
      rings.push({ 
        radius: baseSize * 0.45, width: 1, type: 'solid', rotation: 0, rotationSpeed: 0.00005, rotationOffset: 0, color: 'faint'
      });
      
      // 2. Ticked Ring (Scale-like)
      rings.push({ 
        radius: baseSize * 0.38, width: 2, type: 'ticks', dashSegments: 120, rotation: 0, rotationSpeed: -0.00005, rotationOffset: 0 
      });

      // 3. Dashed Ring
      rings.push({ 
        radius: baseSize * 0.25, width: 1, type: 'dashed', dashSegments: 8, rotation: Math.PI / 4, rotationSpeed: 0.0001, rotationOffset: 0.5 
      });

      // 4. Inner "Gradient" or Accent Ring
      rings.push({ 
        radius: baseSize * 0.15, width: 3, type: 'gradient', rotation: 0, rotationSpeed: 0.0002, rotationOffset: 0 
      });
    };

    const draw = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // --- 0. Background Ambience (Nebula) ---
      // Warm glow bottom left, Cool glow top right
      // Only draw if not reduced motion (performance), or draw once? Canvas clears every frame.
      // We'll draw simple gradients.
      
      const cx = width * 0.85; 
      const cy = height * 0.5;
      
      // Right side (Compass) Cool Glow
      const gradCool = ctx.createRadialGradient(cx, cy, 0, cx, cy, height * 0.8);
      gradCool.addColorStop(0, isDarkMode ? 'rgba(30, 58, 138, 0.15)' : 'rgba(59, 130, 246, 0.05)'); // Blue
      gradCool.addColorStop(1, 'transparent');
      ctx.fillStyle = gradCool;
      ctx.fillRect(0, 0, width, height);

      // Left side Warm/Nebula Glow - Moved to bottom center for symmetry
      const gradWarm = ctx.createRadialGradient(width * 0.5, height * 0.9, 0, width * 0.5, height * 0.9, height * 0.6);
      gradWarm.addColorStop(0, isDarkMode ? 'rgba(124, 45, 18, 0.08)' : 'rgba(249, 115, 22, 0.03)'); // Orange/Amber
      gradWarm.addColorStop(1, 'transparent');
      ctx.fillStyle = gradWarm;
      ctx.fillRect(0, 0, width, height);


      // Base colors
      const strokeColor = isDarkMode ? '255, 255, 255' : '30, 41, 59';
      
      // --- 1. Projection Lines (Radial from Compass) ---
      // Faint lines extending from center
      ctx.strokeStyle = `rgba(${strokeColor}, ${gridOpacity * 0.5})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([]); // Solid
      
      const angles = [Math.PI, Math.PI * 0.85, Math.PI * 1.15, Math.PI * 0.5, Math.PI * 1.5]; // Left, and Up/Down
      angles.forEach(angle => {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          const r = Math.max(width, height);
          ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
          ctx.stroke();
      });


      // --- 2. Geometry (Star/Diamond in Center) ---
      ctx.save();
      ctx.translate(cx, cy);
      // Slowly rotate the geometry
      if (!prefersReducedMotion) ctx.rotate(time * 0.0001);
      
      ctx.strokeStyle = `rgba(${strokeColor}, ${ringOpacity})`;
      ctx.lineWidth = 1;
      
      // Draw a rhombus/diamond
      const diamondSize = Math.min(width, height) * 0.10;
      ctx.beginPath();
      ctx.moveTo(0, -diamondSize);
      ctx.lineTo(diamondSize * 0.6, 0);
      ctx.lineTo(0, diamondSize);
      ctx.lineTo(-diamondSize * 0.6, 0);
      ctx.closePath();
      ctx.stroke();

      // Draw an intersecting diamond (star shape)
      ctx.beginPath();
      ctx.moveTo(0, -diamondSize * 0.6);
      ctx.lineTo(diamondSize, 0);
      ctx.lineTo(0, diamondSize * 0.6);
      ctx.lineTo(-diamondSize, 0);
      ctx.closePath();
      ctx.stroke();
      
      ctx.restore();


      // --- 3. Compass Rings ---
      rings.forEach(ring => {
        if (!prefersReducedMotion) ring.rotation += ring.rotationSpeed;
        
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ring.rotation + ring.rotationOffset);
        
        ctx.strokeStyle = `rgba(${strokeColor}, ${ringOpacity})`;
        ctx.lineWidth = ring.width;
        
        if (ring.color === 'faint') {
             ctx.strokeStyle = `rgba(${strokeColor}, ${ringOpacity * 0.5})`;
        }

        if (ring.type === 'dashed') {
          const circumference = Math.PI * 2 * ring.radius;
          const segmentCount = ring.dashSegments || 10;
          const dashLen = circumference / segmentCount / 4; 
          ctx.setLineDash([dashLen, circumference / segmentCount - dashLen]);
          ctx.beginPath();
          ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        } else if (ring.type === 'ticks') {
           const count = ring.dashSegments || 60;
           for (let k = 0; k < count; k++) {
             const angle = (k / count) * Math.PI * 2;
             // Cardinal points (N, E, S, W) are longer
             const isCardinal = k % (count / 4) === 0;
             const isMajor = k % 5 === 0;
             const len = isCardinal ? 15 : (isMajor ? 8 : 4);
             
             const x1 = Math.cos(angle) * ring.radius;
             const y1 = Math.sin(angle) * ring.radius;
             const x2 = Math.cos(angle) * (ring.radius - len);
             const y2 = Math.sin(angle) * (ring.radius - len);
             
             ctx.beginPath();
             ctx.moveTo(x1, y1);
             ctx.lineTo(x2, y2);
             // Cardinal marks are brighter
             ctx.strokeStyle = isCardinal ? `rgba(${strokeColor}, ${ringOpacity * 2.5})` : `rgba(${strokeColor}, ${ringOpacity})`;
             ctx.stroke();
           }
        } else if (ring.type === 'gradient') {
           // Create a subtle gradient ring
           // We can't easily stroke a gradient along an arc in Canvas 2D without complex steps.
           // Instead, just draw a solid ring with slightly higher opacity.
           ctx.strokeStyle = `rgba(${strokeColor}, ${ringOpacity * 1.5})`;
           ctx.beginPath();
           ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
           ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        ctx.restore();
      });


      // --- 4. Structured Constellation ---
      // Draw lines (Dotted)
      ctx.lineWidth = 1;
      // Use dotted line for that "chart" feel
      ctx.setLineDash([2, 4]); // Short dots
      
      nodes.forEach((node) => {
        const nx = node.x;
        const ny = node.y;
        
        node.connections.forEach(targetIdx => {
           const target = nodes[targetIdx];
           const tx = target.x;
           const ty = target.y;
           
           ctx.beginPath();
           ctx.moveTo(nx, ny);
           ctx.lineTo(tx, ty);
           
           // Shimmer logic (preserved but subtle)
           const shimmerPhase = (time * 0.02) + (node.x * 0.01); 
           const shimmer = (!prefersReducedMotion && Math.sin(shimmerPhase) > 0.98) ? 0.08 : 0;
           
           ctx.strokeStyle = `rgba(${strokeColor}, ${lineOpacity + shimmer})`;
           ctx.stroke();
        });
      });
      ctx.setLineDash([]); // Reset

      // Draw nodes
      nodes.forEach(node => {
        // Pulse
        if (!prefersReducedMotion) node.phase += node.pulseSpeed;
        const pulse = Math.sin(node.phase) * 0.5 + 0.5; 
        
        // Anchor nodes (major) are brighter/larger
        const baseAlpha = node.isAnchor ? 0.3 : 0.15;
        const pulseStrength = node.isAnchor ? 0.3 : 0.2;
        const alpha = baseAlpha + pulse * pulseStrength;
        
        const nx = node.x;
        const ny = node.y;
        const r = node.baseRadius * (node.isAnchor ? 1.5 : 1.0);

        // Outer Glow
        const gradient = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 4);
        gradient.addColorStop(0, `rgba(${strokeColor}, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(${strokeColor}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nx, ny, r * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Solid Core
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${strokeColor}, ${alpha + 0.2})`; // Brighter core
        ctx.fill();
        
        // Tiny ring around anchor nodes
        if (node.isAnchor) {
            ctx.beginPath();
            ctx.arc(nx, ny, r * 2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${strokeColor}, ${alpha * 0.8})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
      });


      // --- 5. Dust Motes (Stars) ---
      motes.forEach(mote => {
         if (!prefersReducedMotion) {
           mote.x += mote.vx;
           mote.y += mote.vy;
           
           if (mote.x < 0) mote.x = width;
           if (mote.x > width) mote.x = 0;
           if (mote.y < 0) mote.y = height;
           if (mote.y > height) mote.y = 0;
         }
         
         ctx.beginPath();
         ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
         ctx.fillStyle = `rgba(${strokeColor}, ${mote.alpha})`;
         ctx.fill();
      });
      
      if (!prefersReducedMotion) time++;
      animationFrameId = requestAnimationFrame(draw);
    };

    init();
    draw();

    const handleResize = () => init();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMediaChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode, nodeCount, lineOpacity, gridOpacity, ringOpacity, parallax, dustMotes]);

  return (
    <div 
        ref={containerRef} 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
    >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        {/* Grain Overlay */}
        <div 
            className="absolute inset-0 pointer-events-none opacity-[0.05]" 
            style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                mixBlendMode: 'overlay'
            }} 
        />
        
        {/* Vignette Overlay */}
        <div 
            className="absolute inset-0" 
            style={{ 
                background: isDarkMode 
                    ? 'radial-gradient(circle at center, transparent 30%, rgba(2, 6, 23, 0.4) 90%)' 
                    : 'radial-gradient(circle at center, transparent 30%, rgba(255, 255, 255, 0.5) 90%)'
            }} 
        />
        
        {/* Background Base Color (If transparency is an issue) */}
        <div className={`absolute inset-0 -z-10 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`} />
    </div>
  );
}
