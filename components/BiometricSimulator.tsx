import React from 'react';
import { Activity, Heart, Brain } from 'lucide-react';

interface BiometricSimulatorProps {
  cls: number;
  setCls: (val: number) => void;
}

const BiometricSimulator: React.FC<BiometricSimulatorProps> = ({ cls, setCls }) => {
  return (
    <div className="bg-gray-900 border-t border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Activity size={14} className="text-emerald-500" />
          Biometric Simulation
        </h3>
        <span className="text-xs text-gray-600">CONNECTED</span>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-300 flex items-center gap-2">
              <Brain size={14} /> Neural Latency (Stress)
            </span>
            <span className="text-sm font-mono text-emerald-400">{cls}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={cls}
            onChange={(e) => setCls(Number(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between mt-1 text-[10px] text-gray-600 font-mono">
            <span>ZEN</span>
            <span>FLOW</span>
            <span>BURNOUT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricSimulator;