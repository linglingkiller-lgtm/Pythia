import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface AvatarCropModalProps {
  imageUrl: string;
  onComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

export const AvatarCropModal: React.FC<AvatarCropModalProps> = ({
  imageUrl,
  onComplete,
  onCancel,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      drawCanvas();
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Redraw canvas when zoom, rotation, or position changes
  useEffect(() => {
    drawCanvas();
  }, [zoom, rotation, position]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();

    // Move to center
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply zoom and position
    const scaledWidth = img.width * zoom;
    const scaledHeight = img.height * zoom;

    ctx.drawImage(
      img,
      position.x - scaledWidth / 2,
      position.y - scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );

    // Restore context state
    ctx.restore();

    // Draw crop circle overlay
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Cut out circle
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw circle border
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 150, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    // Create final cropped canvas
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = 300;
    finalCanvas.height = 300;
    const ctx = finalCanvas.getContext('2d');
    if (!ctx) return;

    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 300, 300);

    // Save context state
    ctx.save();

    // Move to center
    ctx.translate(150, 150);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply zoom and position
    const scaledWidth = img.width * zoom;
    const scaledHeight = img.height * zoom;

    // Create circular clip
    ctx.beginPath();
    ctx.arc(0, 0, 150, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(
      img,
      position.x - scaledWidth / 2,
      position.y - scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );

    // Restore context state
    ctx.restore();

    // Convert to data URL
    const croppedImageUrl = finalCanvas.toDataURL('image/png');
    onComplete(croppedImageUrl);
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .crop-modal-overlay {
          animation: fadeIn 200ms ease-out;
        }

        .crop-modal-card {
          animation: slideUp 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

      <div
        className="crop-modal-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1000002,
        }}
      >
        <div
          className="crop-modal-card"
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
            width: '100%',
            maxWidth: '600px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{ 
            padding: '1.5rem 2rem', 
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
              Crop Profile Picture
            </h3>
            <button
              onClick={onCancel}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                color: '#6b7280',
                borderRadius: '0.375rem',
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Canvas Container */}
          <div
            ref={containerRef}
            style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              backgroundColor: '#f9fafb',
            }}
          >
            {/* Crop Canvas */}
            <div
              style={{
                position: 'relative',
                width: '400px',
                height: '400px',
                cursor: isDragging ? 'grabbing' : 'grab',
                backgroundColor: '#e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
              {/* Zoom Slider */}
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                    Zoom
                  </label>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>
                    {Math.round(zoom * 100)}%
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={handleZoomOut}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: 'white',
                      border: '1.5px solid #d1d5db',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Zoom out"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    style={{
                      flex: 1,
                      height: '6px',
                      borderRadius: '3px',
                      outline: 'none',
                      WebkitAppearance: 'none',
                      appearance: 'none',
                      backgroundColor: '#e5e7eb',
                    }}
                  />
                  <button
                    onClick={handleZoomIn}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: 'white',
                      border: '1.5px solid #d1d5db',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Zoom in"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>
              </div>

              {/* Rotate Button */}
              <button
                onClick={handleRotate}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'white',
                  border: '1.5px solid #d1d5db',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                <RotateCw size={16} />
                Rotate 90°
              </button>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            padding: '1.25rem 2rem', 
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
          }}>
            <button
              onClick={onCancel}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: 'white',
                border: '1.5px solid #d1d5db',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: '#374151',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              style={{
                padding: '0.625rem 1.5rem',
                backgroundColor: '#7f1d1d',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: 'white',
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
};