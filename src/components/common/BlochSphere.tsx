import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';

interface BlochSphereProps {
  x: number;
  y: number;
  z: number;
  theta?: number;
  phi?: number;
  stateLabel?: string;
  className?: string;
}

export const BlochSphere: React.FC<BlochSphereProps> = ({
  x,
  y,
  z,
  theta,
  phi,
  stateLabel = '|ψ⟩',
  className = '',
}) => {
  const [viewRotY, setViewRotY] = useState(30);
  const [viewRotX, setViewRotX] = useState(20);

  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = 85;

  const radX = (viewRotX * Math.PI) / 180;
  const radY = (viewRotY * Math.PI) / 180;

  const project = (px: number, py: number, pz: number) => {
    const x1 = px * Math.cos(radY) + pz * Math.sin(radY);
    const y1 = py;
    const z1 = -px * Math.sin(radY) + pz * Math.cos(radY);

    const x2 = x1;
    const y2 = y1 * Math.cos(radX) - z1 * Math.sin(radX);
    const z2 = y1 * Math.sin(radX) + z1 * Math.cos(radX);

    const sx = cx + x2 * r;
    const sy = cy - z2 * r;
    return { sx, sy, depth: y2 };
  };

  const vectorHead = project(y, x, z);
  const zPoleNorth = project(0, 0, 1.2);
  const zPoleSouth = project(0, 0, -1.2);
  const xPole = project(0, 1.2, 0);
  const yPole = project(1.2, 0, 0);

  const eqRadiusX = r;
  const eqRadiusY = r * Math.sin(radX);

  return (
    <div className={`flex flex-col items-center bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs ${className}`}>
      <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-2">
        <span className="font-bold text-slate-900">Bloch Sphere Projection</span>
        <button
          onClick={() => {
            setViewRotY((prev) => (prev + 30) % 360);
          }}
          className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 transition-colors p-1 rounded-lg hover:bg-blue-50 cursor-pointer font-medium"
          title="Rotate perspective"
        >
          <RotateCw className="w-3 h-3" />
          <span>Rotate</span>
        </button>
      </div>

      <div className="relative">
        <svg width={size} height={size} className="overflow-visible">
          {/* Outer circle silhouette */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="#F8FAFC"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Equator Ellipse */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={eqRadiusX}
            ry={Math.abs(eqRadiusY)}
            fill="rgba(37, 99, 235, 0.04)"
            stroke="rgba(37, 99, 235, 0.4)"
            strokeWidth="1.2"
          />

          {/* Longitudinal Meridian */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={r * Math.sin(radY)}
            ry={r}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Z Axis (North - South) */}
          <line
            x1={zPoleSouth.sx}
            y1={zPoleSouth.sy}
            x2={zPoleNorth.sx}
            y2={zPoleNorth.sy}
            stroke="#94A3B8"
            strokeWidth="1.2"
          />

          {/* X Axis */}
          <line
            x1={cx}
            y1={cy}
            x2={xPole.sx}
            y2={xPole.sy}
            stroke="#E11D48"
            strokeWidth="1.2"
          />

          {/* Y Axis */}
          <line
            x1={cx}
            y1={cy}
            x2={yPole.sx}
            y2={yPole.sy}
            stroke="#059669"
            strokeWidth="1.2"
          />

          {/* Axis Labels */}
          <text x={zPoleNorth.sx + 4} y={zPoleNorth.sy} fill="#0F172A" fontSize="11" fontWeight="bold" fontFamily="monospace">
            |0⟩ (+Z)
          </text>
          <text x={zPoleSouth.sx + 4} y={zPoleSouth.sy + 10} fill="#0F172A" fontSize="11" fontWeight="bold" fontFamily="monospace">
            |1⟩ (-Z)
          </text>
          <text x={xPole.sx + 4} y={xPole.sy} fill="#E11D48" fontSize="10" fontWeight="bold" fontFamily="monospace">
            +X
          </text>
          <text x={yPole.sx + 4} y={yPole.sy} fill="#059669" fontSize="10" fontWeight="bold" fontFamily="monospace">
            +Y
          </text>

          {/* Origin Dot */}
          <circle cx={cx} cy={cy} r="2.5" fill="#64748B" />

          {/* State Vector Line */}
          <defs>
            <linearGradient id="vectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#7C3AED" />
            </marker>
          </defs>

          <line
            x1={cx}
            y1={cy}
            x2={vectorHead.sx}
            y2={vectorHead.sy}
            stroke="url(#vectorGrad)"
            strokeWidth="2.5"
            markerEnd="url(#arrowhead)"
          />

          {/* Vector Head Glow */}
          <circle
            cx={vectorHead.sx}
            cy={vectorHead.sy}
            r="4.5"
            fill="#7C3AED"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />

          {/* State Label */}
          <text
            x={vectorHead.sx + 8}
            y={vectorHead.sy - 6}
            fill="#1E293B"
            fontSize="12"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {stateLabel}
          </text>
        </svg>
      </div>

      {/* Vector Coordinates Readout */}
      <div className="w-full mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg">
        <span>X: <strong className="text-slate-900">{x.toFixed(2)}</strong></span>
        <span>Y: <strong className="text-slate-900">{y.toFixed(2)}</strong></span>
        <span>Z: <strong className="text-slate-900">{z.toFixed(2)}</strong></span>
        {theta !== undefined && (
          <span className="text-blue-700 font-semibold">θ: {((theta * 180) / Math.PI).toFixed(0)}°</span>
        )}
      </div>
    </div>
  );
};
