
import React from 'react';

interface TransformerIconProps {
  l1Temp?: number;
  l3Temp?: number;
  isTrip?: boolean;
  isAlarm?: boolean;
}

const TransformerIcon: React.FC<TransformerIconProps> = ({ 
  l1Temp, 
  l3Temp, 
  isTrip, 
  isAlarm 
}) => {
  const getCoilColor = (temp?: number) => {
    if (temp === undefined) return '#333333';
    if (temp > 130 || isTrip) return '#ef4444'; // Red
    if (temp > 100 || isAlarm) return '#eab308'; // Yellow
    return '#22c55e'; // Green
  };

  return (
    <div className="relative w-full max-w-[800px] aspect-[4/3] flex items-center justify-center p-2">
      <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        {/* Main Base Structure */}
        <rect x="30" y="240" width="340" height="25" rx="4" fill="#1f2937" />
        <rect x="50" y="265" width="300" height="12" rx="2" fill="#111827" />
        
        {/* Core Frame */}
        <path d="M 60 240 L 60 40 L 340 40 L 340 240" fill="none" stroke="#374151" strokeWidth="10" strokeLinejoin="round" />
        
        {/* Windings / Coils L1, L2, L3 */}
        {/* Phase L1 */}
        <g>
          <rect x="75" y="60" width="75" height="170" rx="10" fill={getCoilColor(l1Temp)} fillOpacity="0.15" stroke={getCoilColor(l1Temp)} strokeWidth="3" />
          {[...Array(8)].map((_, i) => (
            <line key={`l1-${i}`} x1="75" y1={80 + i * 20} x2="150" y2={80 + i * 20} stroke={getCoilColor(l1Temp)} strokeWidth="1.5" strokeOpacity="0.4" />
          ))}
          <text x="112.5" y="255" fill="#9ca3af" fontSize="14" textAnchor="middle" fontWeight="bold">L1</text>
        </g>

        {/* Phase L2 (Static Placeholder) */}
        <g>
          <rect x="162.5" y="60" width="75" height="170" rx="10" fill="#374151" fillOpacity="0.1" stroke="#374151" strokeWidth="3" />
          {[...Array(8)].map((_, i) => (
            <line key={`l2-${i}`} x1="162.5" y1={80 + i * 20} x2="237.5" y2={80 + i * 20} stroke="#374151" strokeWidth="1.5" strokeOpacity="0.3" />
          ))}
          <text x="200" y="255" fill="#4b5563" fontSize="14" textAnchor="middle">L2</text>
        </g>

        {/* Phase L3 */}
        <g>
          <rect x="250" y="60" width="75" height="170" rx="10" fill={getCoilColor(l3Temp)} fillOpacity="0.15" stroke={getCoilColor(l3Temp)} strokeWidth="3" />
          {[...Array(8)].map((_, i) => (
            <line key={`l3-${i}`} x1="250" y1={80 + i * 20} x2="325" y2={80 + i * 20} stroke={getCoilColor(l3Temp)} strokeWidth="1.5" strokeOpacity="0.4" />
          ))}
          <text x="287.5" y="255" fill="#9ca3af" fontSize="14" textAnchor="middle" fontWeight="bold">L3</text>
        </g>

        {/* Labels Overlay - Larger and clearer */}
        <g className="filter drop-shadow-md">
          <rect x="85" y="130" width="55" height="30" rx="4" fill="rgba(0,0,0,0.6)" />
          <text x="112.5" y="151" fill="white" fontSize="18" textAnchor="middle" fontWeight="900" className="tabular-nums">
            {l1Temp !== undefined ? `${Math.round(l1Temp)}°` : '---'}
          </text>

          <rect x="260" y="130" width="55" height="30" rx="4" fill="rgba(0,0,0,0.6)" />
          <text x="287.5" y="151" fill="white" fontSize="18" textAnchor="middle" fontWeight="900" className="tabular-nums">
            {l3Temp !== undefined ? `${Math.round(l3Temp)}°` : '---'}
          </text>
        </g>
      </svg>
    </div>
  );
};

export default TransformerIcon;
