import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface CognitiveMeterProps {
  score: number;
}

const CognitiveMeter: React.FC<CognitiveMeterProps> = ({ score }) => {
  const getColor = (s: number) => {
    if (s < 40) return '#10b981'; // Emerald 500
    if (s < 75) return '#f59e0b'; // Amber 500
    return '#ef4444'; // Red 500
  };

  const data = [{ name: 'CLS', value: score, fill: getColor(score) }];

  const getStatusText = (s: number) => {
    if (s < 40) return 'OPTIMAL';
    if (s < 75) return 'STRAINED';
    return 'CRITICAL';
  };

  return (
    <div className="relative w-full h-64 flex flex-col items-center justify-center bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <div className="absolute top-4 left-4 text-xs font-mono text-gray-500 tracking-widest">
        COGNITIVE LOAD SCORE
      </div>
      
      <div className="w-full h-48 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="70%" 
            outerRadius="90%" 
            barSize={15} 
            data={data} 
            startAngle={180} 
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: '#333' }}
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center -mt-4">
          <span className="text-6xl font-bold font-mono tracking-tighter" style={{ color: getColor(score), textShadow: `0 0 20px ${getColor(score)}44` }}>
            {score}
          </span>
          <span className="text-sm tracking-widest mt-2 font-semibold text-gray-400">
            {getStatusText(score)}
          </span>
        </div>
      </div>
      
      <div className="w-full px-6 flex justify-between text-xs text-gray-600 font-mono">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default CognitiveMeter;