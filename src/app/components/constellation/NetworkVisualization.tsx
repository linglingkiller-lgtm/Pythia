import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { NetworkNode, NetworkEdge } from '@/app/data/constellationData';
import { LayoutType } from '@/app/pages/ConstellationPage';

interface NetworkVisualizationProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  layout: LayoutType;
  onNodeClick: (node: NetworkNode) => void;
  selectedNode: NetworkNode | null;
  highlightedPath: string[];
}

export function NetworkVisualization({
  nodes,
  edges,
  layout,
  onNodeClick,
  selectedNode,
  highlightedPath
}: NetworkVisualizationProps) {
  const graphRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Transform data for force-graph
  const graphData = {
    nodes: nodes.map(node => ({
      id: node.id,
      name: node.label,
      val: node.influenceScore,
      type: node.type,
      metadata: node.metadata,
      color: getNodeColor(node.type, node.metadata.party),
    })),
    links: edges.map(edge => ({
      source: edge.source,
      target: edge.target,
      type: edge.type,
      weight: edge.weight,
      sentiment: edge.sentiment,
      color: getEdgeColor(edge.sentiment, edge.type),
      width: edge.weight / 2,
    }))
  };

  function getNodeColor(type: string, party?: string): string {
    if (type === 'legislator') {
      if (party === 'Democrat') return '#3b82f6'; // blue
      if (party === 'Republican') return '#ef4444'; // red
      return '#8b5cf6'; // purple for independent
    }
    
    const colors: Record<string, string> = {
      bill: '#a855f7', // purple
      client: '#10b981', // green
      committee: '#f59e0b', // amber
      issue: '#06b6d4', // cyan
      stakeholder: '#ec4899', // pink
      staff: '#6366f1', // indigo
    };
    return colors[type] || '#8b5cf6';
  }

  function getEdgeColor(sentiment: string, type: string): string {
    if (type === 'oppose') return 'rgba(239, 68, 68, 0.4)'; // red
    if (sentiment === 'positive') return 'rgba(16, 185, 129, 0.4)'; // green
    if (sentiment === 'negative') return 'rgba(239, 68, 68, 0.4)'; // red
    return 'rgba(139, 92, 246, 0.3)'; // purple
  }

  const handleNodeClick = (node: any) => {
    const originalNode = nodes.find(n => n.id === node.id);
    if (originalNode) {
      onNodeClick(originalNode);
    }
  };

  const nodeCanvasObject = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;

    // Determine if node is selected or highlighted
    const isSelected = selectedNode?.id === node.id;
    const isInPath = highlightedPath.includes(node.id);
    
    // Node size
    const nodeSize = Math.sqrt(node.val) * 2;
    
    // Draw glow for selected/highlighted nodes
    if (isSelected || isInPath) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize + 4, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? 'rgba(147, 51, 234, 0.3)' : 'rgba(251, 191, 36, 0.3)';
      ctx.fill();
    }

    // Draw node
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.fill();

    // Draw border
    ctx.strokeStyle = isSelected ? '#a855f7' : isInPath ? '#fbbf24' : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = isSelected || isInPath ? 2 / globalScale : 1 / globalScale;
    ctx.stroke();

    // Draw label
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(label, node.x, node.y + nodeSize + fontSize + 2);
  };

  const linkDirectionalParticles = (link: any) => {
    return highlightedPath.length > 1 &&
      highlightedPath.includes(link.source.id || link.source) &&
      highlightedPath.includes(link.target.id || link.target)
      ? 4
      : 0;
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-950/50">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          nodeLabel="name"
          nodeVal="val"
          nodeCanvasObject={nodeCanvasObject}
          nodeCanvasObjectMode={() => 'replace'}
          onNodeClick={handleNodeClick}
          linkColor="color"
          linkWidth="width"
          linkDirectionalParticles={linkDirectionalParticles}
          linkDirectionalParticleSpeed={0.004}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleColor={() => '#fbbf24'}
          backgroundColor="rgba(0, 0, 0, 0)"
          cooldownTicks={100}
          onEngineStop={() => graphRef.current?.zoomToFit(400)}
        />
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 text-sm">
        <div className="font-semibold text-white mb-2">Node Types</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#a855f7]" />
            <span className="text-slate-300">Bills</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
            <span className="text-slate-300">Legislators (D)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <span className="text-slate-300">Legislators (R)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981]" />
            <span className="text-slate-300">Clients</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <span className="text-slate-300">Committees</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#06b6d4]" />
            <span className="text-slate-300">Issues</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ec4899]" />
            <span className="text-slate-300">Stakeholders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#6366f1]" />
            <span className="text-slate-300">Staff</span>
          </div>
        </div>
      </div>
    </div>
  );
}
