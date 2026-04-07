import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Layout, Download } from 'lucide-react';
import { exportToHTML } from '../utils/codeExecution';

interface CommandBarProps {
  onCommand: (command: string) => void;
  isGenerating: boolean;
  onToggleGallery: () => void;
  showGallery: boolean;
  mode: 'hero' | 'docked';
  currentRegistry?: any;
  value?: string;
  onChange?: (value: string) => void;
}

const CommandBar: React.FC<CommandBarProps> = ({ 
  onCommand, 
  isGenerating, 
  onToggleGallery, 
  showGallery,
  mode,
  currentRegistry,
  value,
  onChange
}) => {
  const [internalInput, setInternalInput] = useState('');
  const inputValue = value !== undefined ? value : internalInput;
  const setInputValue = onChange || setInternalInput;
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isGenerating) {
      onCommand(inputValue.trim());
      setInputValue('');
    }
  };

  const handleExport = () => {
    if (currentRegistry) {
      exportToHTML(currentRegistry);
    }
  };

  useEffect(() => {
    if (mode === 'hero' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  return (
    <div 
      className={`
        z-50 flex justify-center px-6 transition-all duration-700 ease-in-out pointer-events-none
        ${mode === 'hero' ? 'relative w-full' : 'fixed left-0 right-0 bottom-8 translate-y-0'}
      `}
    >
      <motion.div 
        layout
        className={`pointer-events-auto flex flex-col items-center w-full transition-all duration-500 ${mode === 'hero' ? 'max-w-xl' : 'max-w-2xl'}`}
      >
        <form 
          onSubmit={handleSubmit}
          className={`
            relative w-full flex items-center gap-3 p-1.5 pl-5 rounded-full 
            backdrop-blur-2xl border shadow-2xl transition-all duration-500
            ${mode === 'hero' 
              ? 'bg-slate-950/40 border-white/10 ring-1 ring-white/5 py-4' 
              : 'bg-slate-900/90 border-white/10 ring-1 ring-white/5 py-2'
            }
            ${isFocused ? 'ring-purple-500/30 border-purple-500/30' : ''}
          `}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={mode === 'hero' ? "Describe your vision..." : "Iterate on this UI..."}
            disabled={isGenerating}
            className={`
              flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 transition-all
              ${mode === 'hero' ? 'text-xl text-center' : 'text-base text-left'}
            `}
          />

          <div className="flex items-center gap-1 pr-1">
             {mode === 'docked' && (
               <>
                 <button
                  type="button"
                  onClick={onToggleGallery}
                  className={`p-2 rounded-full transition-colors ${showGallery ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/10 text-slate-400'}`}
                  title="Saved Interfaces"
                >
                  <Layout className="w-4 h-4" />
                </button>
                {currentRegistry && (
                  <button
                    type="button"
                    onClick={handleExport}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 transition-colors"
                    title="Portable Export"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
               </>
             )}
            
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className={`
                p-2 rounded-full transition-all duration-300 flex items-center justify-center
                ${input.trim() && !isGenerating 
                  ? 'bg-white text-black hover:scale-105 shadow-lg shadow-white/10' 
                  : 'bg-white/5 text-slate-600 cursor-not-allowed'}
              `}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CommandBar;
