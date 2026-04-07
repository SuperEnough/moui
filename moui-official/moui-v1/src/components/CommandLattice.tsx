import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, LayoutGrid, Settings, Edit3, X, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function CommandLattice() {
  const { 
    isLatticeExpanded, 
    setLatticeExpanded, 
    setCurrentApp, 
    isEditMode, 
    setEditMode,
    activeComponentId,
    setActiveComponentId
  } = useAppStore();
  const [query, setQuery] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Simulate generation and morphing
    setCurrentApp('simulated_app');
    setLatticeExpanded(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Handle Delta Patch logic here
    console.log(`Patching ${activeComponentId} with: ${query}`);
    setQuery('');
  };

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed z-50 flex items-center justify-center transition-all ${
          isLatticeExpanded
            ? 'inset-0 bg-black/40 backdrop-blur-sm'
            : 'bottom-8 left-1/2 -translate-x-1/2'
        }`}
      >
        <motion.div
          layout
          className={`flex overflow-hidden rounded-[2rem] border border-white/10 bg-black/60 shadow-2xl backdrop-blur-md ${
            isLatticeExpanded || isEditMode ? 'w-[600px] flex-col' : 'w-auto flex-row items-center p-2'
          }`}
        >
          {isLatticeExpanded ? (
            <form onSubmit={handleGenerate} className="flex flex-col w-full">
              <div className="flex items-center border-b border-white/10 p-4">
                <Search className="mr-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe the UI you want to build..."
                  className="flex-1 bg-transparent text-lg text-white placeholder-gray-500 outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="ml-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 disabled:opacity-50 transition-colors"
                >
                  <Sparkles className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 p-4 text-xs text-gray-400">
                <span className="rounded-md border border-white/10 px-2 py-1">"Create a SaaS dashboard..."</span>
                <span className="rounded-md border border-white/10 px-2 py-1">"Build a Kanban board..."</span>
              </div>
            </form>
          ) : isEditMode ? (
            <form onSubmit={handleEditSubmit} className="flex flex-col w-full">
              <div className="flex items-center border-b border-white/10 p-4">
                <button 
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setActiveComponentId(null);
                  }}
                  className="mr-3 rounded-full p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex-1">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    {activeComponentId ? `Target: ${activeComponentId}` : 'Select a component to edit'}
                  </span>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={activeComponentId ? "What should change?" : "Click a component in the workspace..."}
                    className="w-full bg-transparent text-lg text-white placeholder-gray-500 outline-none"
                    autoFocus
                    disabled={!activeComponentId}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!query.trim() || !activeComponentId}
                  className="ml-3 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                >
                  <Edit3 className="h-5 w-5" />
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLatticeExpanded(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                title="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <div className="w-px h-6 bg-white/10"></div>
              <button 
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                title="Gallery"
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setEditMode(true)}
                className="flex h-10 px-4 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 hover:text-white transition-all"
                title="Edit Mode (ACT)"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Edit Mode</span>
              </button>
              <button 
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
