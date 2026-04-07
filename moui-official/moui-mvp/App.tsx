import React, { useState, useEffect } from 'react';
import { generateCode } from './services/geminiService';
import { INITIAL_CODE } from './constants';
import DynamicComponent from './components/DynamicComponent';
import CommandBar from './components/CommandBar';
import CodeViewer from './components/CodeViewer';
import MoLoader from './components/MoLoader';
import Gallery from './components/Gallery';
import { AnimatePresence, motion } from 'framer-motion';
import { HistoryItem, ComponentRegistry } from './types';
import { Sparkles } from 'lucide-react';

const STORAGE_KEY = 'moui_history';

export default function App() {
  const [currentCode, setCurrentCode] = useState<string>(INITIAL_CODE);
  const [currentRegistry, setCurrentRegistry] = useState<any>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(10);
  const [currentEta, setCurrentEta] = useState(10);
  const [durationHistory, setDurationHistory] = useState<number[]>([]);
  const [commandInput, setCommandInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
        if (parsed.length > 0) {
          const last = parsed[parsed.length - 1];
          setCurrentCode(last.code);
          setCurrentRegistry(last.registry);
        }
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    setProgress(5);
    setCurrentEta(Math.max(1, Math.ceil(estimatedDuration)));

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(1, elapsed / (estimatedDuration * 1000));
      // Refined easing: smoother curve using cubic ease-in-out approximation
      const easedRatio = ratio < 0.5 ? 4 * ratio * ratio * ratio : 1 - Math.pow(-2 * ratio + 2, 3) / 2;
      const target = 8 + 76 * easedRatio;

      setProgress((prev) => {
        const nextValue = Math.max(prev, target + Math.random() * 1.5);
        return Math.min(95, nextValue);
      });

      const remainingMs = estimatedDuration * 1000 - elapsed;
      setCurrentEta(Math.max(1, Math.ceil(remainingMs / 1000)));
    }, 250);

    return () => window.clearInterval(interval);
  }, [isGenerating, estimatedDuration]);


  const isHeroMode = history.length === 0 && !isGenerating;

  const handleCommand = async (prompt: string) => {
    setIsGenerating(true);
    setShowGallery(false);
    setErrorMessage(null);
    setProgress(5);
    setCurrentEta(Math.max(1, Math.ceil(estimatedDuration)));

    const startTime = Date.now();

    try {
      // Send current registry for context if it exists
      const context = currentRegistry ? JSON.stringify(currentRegistry) : currentCode;
      const result = await generateCode(prompt, context);
      
      const newRegistry = result;
      const newCode = JSON.stringify(newRegistry);

      const newItem: HistoryItem = {
        code: newCode,
        registry: newRegistry,
        timestamp: Date.now(),
        prompt: prompt
      };

      setCurrentCode(newCode);
      setCurrentRegistry(newRegistry);
      setHistory(prev => [...prev, newItem]);

      const duration = Math.max(1, (Date.now() - startTime) / 1000);
      setDurationHistory((prev) => {
        const nextDurations = [duration, ...prev].slice(0, 6);
        const average = nextDurations.reduce((total, item) => total + item, 0) / nextDurations.length;
        setEstimatedDuration(Math.min(Math.max(6, average), 18));
        return nextDurations;
      });
    } catch (error: any) {
      const message = error?.message || 'Unknown error occurred during generation.';
      console.error("Failed to generate code", message, error);
      setErrorMessage(message);
    } finally {
      setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 220));
      setIsGenerating(false);
    }
  };

  const handleTemplateClick = (template: string) => {
    const prompts = {
      'Analytics Dashboard': 'Create an analytics dashboard with charts, KPIs, and real-time data visualization',
      'Auth Flow': 'Build a complete authentication flow with login, signup, and user management',
      'Commerce Launchpad': 'Design an e-commerce interface with product grid, cart, and checkout',
      'Chat Console': 'Create a chat application with message bubbles, input field, and user avatars'
    };
    setCommandInput(prompts[template as keyof typeof prompts] || '');
  };

  const handleDeleteFromGallery = (index: number) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
    if (newHistory.length === 0) {
      setCurrentCode(INITIAL_CODE);
      setCurrentRegistry(undefined);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleSelectFromGallery = (item: HistoryItem) => {
    setCurrentCode(item.code);
    setCurrentRegistry(item.registry);
    setShowGallery(false);
    setErrorMessage(null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">
      {/* Background pattern - subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      {/* Main Content Area */}
      <main className="relative w-full h-full z-0 overflow-auto">
        {errorMessage && (
          <div className="fixed top-6 left-1/2 z-50 w-[min(92vw,720px)] -translate-x-1/2 rounded-3xl border border-red-500/20 bg-red-950/95 px-5 py-3 text-sm text-red-100 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold tracking-[0.18em] uppercase text-red-300">Generation failed</p>
                <p className="mt-1 text-xs text-red-200">{errorMessage}</p>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-100 hover:bg-red-500/30"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40"
            >
              <MoLoader isGenerating={isGenerating} progress={progress} estimatedTime={currentEta} onTemplateClick={handleTemplateClick} />
            </motion.div>
          ) : isHeroMode ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full w-full px-6 text-center space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-bold text-purple-400 uppercase tracking-widest mx-auto"
                >
                  <Sparkles size={10} />
                  <span>MoUI Engine v2.0</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-tight"
                >
                  What should I <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400">build</span>?
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.5 }}
                  className="text-slate-400 text-sm md:text-base font-light tracking-wide max-w-md mx-auto"
                >
                  Describe your vision and watch it materialize in real-time.
                </motion.p>
              </div>

              <div className="w-full max-w-xl pt-4">
                <CommandBar 
                  onCommand={handleCommand} 
                  isGenerating={isGenerating} 
                  onToggleGallery={() => setShowGallery(!showGallery)}
                  showGallery={showGallery}
                  mode="hero"
                  currentRegistry={currentRegistry}
                  value={commandInput}
                  onChange={setCommandInput}
                />
              </div>
            </motion.div>
          ) : showGallery ? (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="h-full w-full pt-12 pb-32"
            >
              <div className="max-w-7xl mx-auto px-8 mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Saved Interfaces</h2>
                <p className="text-slate-500 text-sm">Your collection of materialized visions.</p>
              </div>
              <Gallery 
                history={history} 
                onSelect={handleSelectFromGallery} 
                onDelete={handleDeleteFromGallery} 
              />
            </motion.div>
          ) : (
            <motion.div
              key={currentCode.length} // Force re-mount animation on new code
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full w-full pt-4 pb-32"
            >
              <DynamicComponent 
                registry={currentRegistry} 
                code={currentCode} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Docked Command Bar - Only show when NOT in hero mode and NOT generating */}
      {!isHeroMode && !isGenerating && (
        <CommandBar 
          onCommand={handleCommand} 
          isGenerating={isGenerating} 
          onToggleGallery={() => setShowGallery(!showGallery)}
          showGallery={showGallery}
          value={commandInput}
          onChange={setCommandInput}
          mode="docked"
          currentRegistry={currentRegistry}
        />
      )}
      
      {/* Subtle Version Indicator - only show when docked */}
      {!isHeroMode && !isGenerating && (
        <div className="fixed bottom-4 left-4 z-40 text-[10px] text-slate-700 font-mono pointer-events-none opacity-50">
          MoUI Engine v2.0 // Build {history.length}
        </div>
      )}
    </div>
  );
}
