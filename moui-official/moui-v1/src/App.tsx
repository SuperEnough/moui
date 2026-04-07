import React from 'react';

export default function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Background layer */}
      <div className="absolute inset-0 z-[-1] bg-black bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Main Orchestration Layer */}
      <main className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">MoUI Official</h1>
        <p className="text-slate-500 max-w-md">The system is ready for orchestration.</p>
      </main>
    </div>
  );
}
