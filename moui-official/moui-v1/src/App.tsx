import React from 'react';
import { CommandLattice } from './components/CommandLattice';
import { Workspace } from './components/Workspace';
import { useAppStore } from './store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function App() {
  const { currentApp } = useAppStore();
  const isHeroMode = !currentApp;

  return (
    <div className={`h-screen w-screen overflow-hidden bg-[#050505] transition-colors duration-1000 ${isHeroMode ? 'bg-[#050505]' : 'bg-white'}`}>
      {/* Background layer */}
      <div className={`absolute inset-0 z-[-1] transition-opacity duration-1000 ${isHeroMode ? 'opacity-100 grid-pattern' : 'opacity-0'}`}></div>
      <div className={`absolute inset-0 z-[-1] transition-opacity duration-1000 ${isHeroMode ? 'opacity-20' : 'opacity-0'} bg-[radial-gradient(circle_at_50%_-20%,rgba(124,58,237,0.3),transparent_80%)]`}></div>
      
      <AnimatePresence mode="wait">
        {isHeroMode ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center"
          >
            {/* Branding in Hero Mode */}
            <div className="absolute top-8 left-8">
              <h1 className="text-sm font-bold tracking-tight text-white">
                MoUI <span className="text-white/40 font-light chromatic-text" data-text="Official">Official</span>
              </h1>
            </div>

            <div className="space-y-6 -translate-y-12">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest mx-auto"
              >
                <Sparkles size={10} />
                <span>MoUI Engine v2.0</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-tight"
              >
                What should I <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white/80 to-indigo-600">build</span>?
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 0.2 }}
                className="text-white text-sm md:text-base font-light tracking-wide max-w-md mx-auto"
              >
                Describe your vision and watch it materialize in real-time.
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <motion.main 
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-full w-full"
          >
            <Workspace>
              {/* The self-generating app logic will render here, taking the full screen */}
            </Workspace>
          </motion.main>
        )}
      </AnimatePresence>

      <CommandLattice />
    </div>
  );
}
