import React from 'react';
import { StreamItem, StreamAction, Priority, SourceType } from '../types';
import { ShieldAlert, BrainCircuit, Activity, MessageSquare, Zap, EyeOff } from 'lucide-react';

interface StreamFeedProps {
  items: StreamItem[];
}

const StreamFeed: React.FC<StreamFeedProps> = ({ items }) => {
  
  const getIcon = (source: SourceType) => {
    switch(source) {
      case SourceType.NEUROLINK: return <BrainCircuit size={16} className="text-purple-400" />;
      case SourceType.AR_OVERLAY: return <Zap size={16} className="text-blue-400" />;
      case SourceType.ENVIRONMENTAL: return <Activity size={16} className="text-green-400" />;
      case SourceType.WORK_MESSAGE: return <MessageSquare size={16} className="text-orange-400" />;
      default: return <Activity size={16} />;
    }
  };

  const getActionStyles = (action?: StreamAction) => {
    switch (action) {
      case StreamAction.BLOCK: return 'opacity-40 grayscale border-red-900/30 bg-red-900/10';
      case StreamAction.QUEUE: return 'opacity-60 border-yellow-900/30 bg-yellow-900/10';
      case StreamAction.SUMMARIZE: return 'border-blue-500/30 bg-blue-900/20';
      case StreamAction.DELIVER: return 'border-green-500/30 bg-green-900/10';
      default: return 'border-gray-800';
    }
  };

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-2 pb-20">
      {items.length === 0 && (
        <div className="text-center text-gray-600 mt-20 font-mono text-sm">
          AWAITING NEURAL STREAMS...
        </div>
      )}
      
      {items.map((item) => (
        <div 
          key={item.id} 
          className={`
            relative p-4 rounded-xl border transition-all duration-500 ease-out animate-in fade-in slide-in-from-top-4
            ${getActionStyles(item.action)}
          `}
        >
          {/* Header Row */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-gray-800/50">
                {getIcon(item.source)}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">
                {item.source.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-2">
               {item.priority === Priority.CRITICAL && (
                 <span className="animate-pulse px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/50">
                   CRITICAL
                 </span>
               )}
               <span className="text-xs text-gray-600 font-mono">
                 {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
               </span>
            </div>
          </div>

          {/* Content Row */}
          <div className="pl-9">
            {item.action === StreamAction.BLOCK ? (
              <div className="flex items-center gap-2 text-gray-500 italic text-sm">
                <ShieldAlert size={14} />
                <span>Information blocked by HUMM firewall. Low value.</span>
              </div>
            ) : item.action === StreamAction.QUEUE ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <EyeOff size={14} />
                <span>Queued for later review.</span>
              </div>
            ) : (
              <div>
                {item.summary && (
                  <div className="text-sm font-medium text-gray-200 mb-1 leading-snug">
                    <span className="text-emerald-500 mr-2">HUMM AI:</span>
                    {item.summary}
                  </div>
                )}
                {/* Original content faded if summarized */}
                <div className={`text-xs ${item.summary ? 'text-gray-600 line-clamp-1' : 'text-gray-400'}`}>
                  {item.originalContent}
                </div>
              </div>
            )}
          </div>
          
          {/* Decoration */}
          {item.cognitiveCost && (
             <div className="absolute right-2 bottom-2 text-[9px] text-gray-700 font-mono">
               LOAD EST: {item.cognitiveCost}/10
             </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StreamFeed;