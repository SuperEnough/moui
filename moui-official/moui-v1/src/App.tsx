import React from 'react';
import { CommandLattice } from './components/CommandLattice';
import { Workspace } from './components/Workspace';
import StarterApp from './apps/StarterApp';

export default function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0A0A0A]">
      {/* Background layer */}
      <div className="absolute inset-0 z-[-1] bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Main Orchestration Layer */}
      <main className="relative flex h-full w-full flex-col px-8 pt-8 pb-32">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white/90">MoUI <span className="text-white/40 font-light">Official</span></h1>
            <p className="text-xs font-medium text-white/30 tracking-widest uppercase mt-1">Intelligent UI OS</p>
          </div>
          <div className="flex gap-4">
            {/* Status indicators */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5 text-[10px] font-bold text-green-400">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
               SYSTEM ACTIVE
            </div>
          </div>
        </header>

        {/* The Workspace Surface */}
        <Workspace>
           <StarterApp />
        </Workspace>
      </main>

      {/* The Metamorphic Command Lattice */}
      <CommandLattice />
    </div>
  );
}
