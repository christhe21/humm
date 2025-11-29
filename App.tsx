import React, { useState, useEffect, useRef } from 'react';
import { Brain, Shield, Wind, Zap, BarChart3, Settings, User } from 'lucide-react';
import CognitiveMeter from './components/CognitiveMeter';
import StreamFeed from './components/StreamFeed';
import BiometricSimulator from './components/BiometricSimulator';
import { generateMockItem } from './services/mockDataService';
import { analyzeStreamItem } from './services/geminiService';
import { StreamItem, CognitiveState, StreamAction } from './types';

const MAX_ITEMS = 50;

function App() {
  const [streamItems, setStreamItems] = useState<StreamItem[]>([]);
  const [cls, setCls] = useState<number>(35); // Initial cognitive load
  const [isSustainabilityMode, setSustainabilityMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use a ref to access current state inside interval
  const stateRef = useRef({ cls, isSustainabilityMode });
  
  useEffect(() => {
    stateRef.current = { cls, isSustainabilityMode };
  }, [cls, isSustainabilityMode]);

  // Simulate incoming data stream
  useEffect(() => {
    const interval = setInterval(async () => {
      // Don't overwhelm the stream, random chance
      if (Math.random() > 0.4) {
        const rawItem = generateMockItem();
        
        // Optimistic add to UI (showing processing state implicitly by lack of fields)
        const newItem: StreamItem = { ...rawItem, processed: false };
        
        setStreamItems(prev => [newItem, ...prev].slice(0, MAX_ITEMS));
        
        // Trigger AI Analysis
        processItem(newItem);
      }
    }, 3500); // New item every 3.5s

    return () => clearInterval(interval);
  }, []);

  const processItem = async (item: StreamItem) => {
    setIsProcessing(true);
    const { cls, isSustainabilityMode } = stateRef.current;
    
    // Call Gemini (or fallback)
    const analysis = await analyzeStreamItem(item.originalContent, cls, isSustainabilityMode);
    
    setStreamItems(prev => prev.map(i => {
      if (i.id === item.id) {
        return {
          ...i,
          ...analysis,
          processed: true
        };
      }
      return i;
    }));
    setIsProcessing(false);
  };

  const clearQueue = () => {
    setStreamItems([]);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-gray-100 overflow-hidden font-sans selection:bg-emerald-500/30">
      
      {/* Sidebar Navigation */}
      <aside className="w-20 hidden md:flex flex-col items-center py-8 border-r border-gray-900 bg-[#080808]">
        <div className="mb-10 text-emerald-500 animate-pulse">
          <Brain size={32} />
        </div>
        
        <nav className="flex flex-col gap-8 w-full">
          <button className="h-12 w-full flex items-center justify-center text-emerald-400 border-l-2 border-emerald-400 bg-emerald-400/5">
            <Zap size={24} />
          </button>
          <button className="h-12 w-full flex items-center justify-center text-gray-600 hover:text-gray-300 transition-colors">
            <BarChart3 size={24} />
          </button>
          <button className="h-12 w-full flex items-center justify-center text-gray-600 hover:text-gray-300 transition-colors">
            <Shield size={24} />
          </button>
          <button className="h-12 w-full flex items-center justify-center text-gray-600 hover:text-gray-300 transition-colors">
            <Settings size={24} />
          </button>
        </nav>

        <div className="mt-auto">
           <button className="h-12 w-full flex items-center justify-center text-gray-600 hover:text-gray-300">
            <User size={24} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Left Panel: Dashboard & Controls */}
        <section className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto min-w-[320px] max-w-md border-r border-gray-900 bg-[#0a0a0a]">
          <header>
            <h1 className="text-3xl font-bold tracking-tighter text-white mb-1">HUMM</h1>
            <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">Personal Cognitive Load Manager</p>
          </header>

          <CognitiveMeter score={cls} />

          {/* Controls */}
          <div className="grid grid-cols-1 gap-4">
             <div className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${isSustainabilityMode ? 'bg-emerald-900/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-gray-900 border-gray-800 hover:border-gray-700'}`}
                  onClick={() => setSustainabilityMode(!isSustainabilityMode)}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                    <Wind size={18} className={isSustainabilityMode ? 'text-emerald-400' : 'text-gray-500'} />
                    Sustainability Mode
                  </div>
                  <div className={`w-3 h-3 rounded-full ${isSustainabilityMode ? 'bg-emerald-500 animate-pulse' : 'bg-gray-700'}`} />
                </div>
                <p className="text-xs text-gray-500">
                  {isSustainabilityMode 
                    ? "ACTIVE: Aggressive filtering engaged. Neural conservation protocols running." 
                    : "STANDBY: Normal information flow allowed."}
                </p>
             </div>

             <div className="p-4 rounded-xl border border-gray-800 bg-gray-900">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-200">Stats (Daily)</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Items Blocked</span>
                    <span className="text-red-400 font-mono">{streamItems.filter(i => i.action === StreamAction.BLOCK).length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Summarized</span>
                    <span className="text-blue-400 font-mono">{streamItems.filter(i => i.action === StreamAction.SUMMARIZE).length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Cognitive Savings</span>
                    <span className="text-emerald-400 font-mono">
                      {streamItems.reduce((acc, curr) => acc + (curr.action === StreamAction.BLOCK ? 1 : 0), 0) * 15} kJ
                    </span>
                  </div>
                </div>
             </div>
          </div>
          
          <div className="mt-auto">
             <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30">
               <h3 className="text-sm font-bold text-indigo-300 mb-1">Upgrade to Enterprise</h3>
               <p className="text-[10px] text-gray-400 mb-3">Get team load balancing and burnout prediction models.</p>
               <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors">
                 Subscribe ($79/mo)
               </button>
             </div>
          </div>
        </section>

        {/* Right Panel: The Stream */}
        <section className="flex-[2] flex flex-col h-full bg-[#050505] relative">
          
          {/* Stream Header */}
          <div className="h-16 border-b border-gray-900 flex items-center justify-between px-6 bg-[#050505]/80 backdrop-blur sticky top-0 z-20">
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-3">
              Neural Stream 
              {isProcessing && <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />}
            </h2>
            <div className="flex gap-2">
               <button 
                onClick={clearQueue}
                className="px-3 py-1.5 text-xs text-gray-500 hover:text-white border border-gray-800 hover:border-gray-600 rounded-lg transition-all">
                 Clear Buffer
               </button>
            </div>
          </div>

          {/* Feed */}
          <div className="flex-1 overflow-hidden relative">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/5 to-transparent pointer-events-none" />
             <StreamFeed items={streamItems} />
          </div>

          {/* Simulator Controls (Bottom Panel) */}
          <BiometricSimulator cls={cls} setCls={setCls} />

        </section>
      </main>
    </div>
  );
}

export default App;