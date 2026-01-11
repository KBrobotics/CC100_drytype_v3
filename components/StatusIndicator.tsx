
import React from 'react';

interface StatusIndicatorProps {
  label: string;
  isActive?: boolean;
  type?: 'alarm' | 'trip' | 'info' | 'cooling';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ label, isActive, type = 'info' }) => {
  const getColors = () => {
    if (isActive === undefined) return { led: 'bg-gray-800', border: 'border-gray-700', text: 'text-gray-500' };
    
    if (isActive) {
      switch (type) {
        case 'trip': return { led: 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]', border: 'border-red-400', text: 'text-red-400 font-bold' };
        case 'alarm': return { led: 'bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.8)]', border: 'border-yellow-400', text: 'text-yellow-400 font-bold' };
        case 'cooling': return { led: 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]', border: 'border-green-400', text: 'text-green-400 font-bold' };
        default: return { led: 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]', border: 'border-blue-400', text: 'text-blue-400' };
      }
    }
    
    return { led: 'bg-zinc-900', border: 'border-zinc-800', text: 'text-zinc-600' };
  };

  const colors = getColors();

  return (
    <div className="flex items-center gap-3 bg-zinc-900/50 p-2 rounded-md border border-zinc-800/50">
      <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${colors.led} ${colors.border}`} />
      <span className={`text-xs uppercase tracking-wider ${colors.text}`}>
        {label} {isActive === undefined && <span className="text-[10px] opacity-50 ml-1">(N/A)</span>}
      </span>
    </div>
  );
};

export default StatusIndicator;
