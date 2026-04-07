import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutGrid, Settings, Pencil, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function CommandLattice() {
  const { 
    isLatticeExpanded, 
    setLatticeExpanded, 
    isEditMode, 
    setEditMode,
    currentApp,
    setCurrentApp
  } = useAppStore();
  
  const [inputValue, setInputValue] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    // Simulate generation for now
    setCurrentApp('generated_app');
    setLatticeExpanded(false);
  };

  return (
    <div className={`fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-700 ${
      !currentApp ? 'top-[65%] w-full max-w-xl' : 'bottom-12'
    }`}>
      <motion.div
        layout
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-black/80 p-1.5 shadow-2xl backdrop-blur-2xl"
      >
        <AnimatePresence mode="popLayout">
          {!currentApp || isLatticeExpanded ? (
            <motion.form
              key="expanded-input"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleGenerate}
              className="flex w-full items-center gap-3 pl-4 pr-2"
            >
              <Search size={18} className="text-white/40" />
              <input
                autoFocus
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentApp ? "Iterate on this UI..." : "Describe the UI you want to build..."}
                className="flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/20"
              />
              <button
                type="submit"
                className="rounded-full bg-white/10 p-2 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
              >
                {currentApp ? <ArrowRight size={18} /> : <Sparkles size={18} />}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="collapsed-cluster"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="flex items-center gap-1"
            >
              <button
                onClick={() => setLatticeExpanded(true)}
                className="rounded-full p-3 text-white/40 transition-all hover:bg-white/10 hover:text-white"
                title="Search"
              >
                <Search size={20} />
              </button>
              
              <div className="h-4 w-px bg-white/10 mx-1"></div>

              <button
                className="rounded-full p-3 text-white/40 transition-all hover:bg-white/10 hover:text-white"
                title="Gallery"
              >
                <LayoutGrid size={20} />
              </button>

              <button
                onClick={() => setEditMode(!isEditMode)}
                className={`rounded-full p-3 transition-all ${
                  isEditMode 
                    ? 'bg-blue-600/20 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                    : 'text-white/40 hover:bg-white/10 hover:text-white'
                }`}
                title="ACT (Edit Mode)"
              >
                <Pencil size={20} />
              </button>

              <button
                className="rounded-full p-3 text-white/40 transition-all hover:bg-white/10 hover:text-white"
                title="Settings"
              >
                <Settings size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Suggestion hints in Hero Mode */}
      {!currentApp && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex w-full justify-center gap-3 px-4 overflow-x-auto no-scrollbar"
        >
          {['"Create a SaaS dashboard..."', '"Build a Kanban board..."'].map((hint) => (
            <button
              key={hint}
              className="whitespace-nowrap rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-[10px] font-medium text-white/30 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-white/10 hover:text-white/60"
            >
              {hint}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
