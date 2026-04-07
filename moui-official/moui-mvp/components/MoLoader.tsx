import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Layout, Rocket, ShieldCheck } from 'lucide-react';

const SLIDES = [
  {
    icon: <Sparkles className="text-purple-400" size={32} />,
    title: "get more with moui",
    description: "Your UI for everything. Intelligent, adaptive, and beautiful."
  },
  {
    icon: <Zap className="text-blue-400" size={32} />,
    title: "instant materialization",
    description: "From prompt to production-ready code in seconds."
  },
  {
    icon: <Layout className="text-indigo-400" size={32} />,
    title: "premium design systems",
    description: "MoUI uses industry-standard patterns for accessibility and polish."
  },
  {
    icon: <ShieldCheck className="text-emerald-400" size={32} />,
    title: "secure & scalable",
    description: "Built on robust frameworks to ensure your UI stands the test of time."
  }
];

interface MoLoaderProps {
  isGenerating: boolean;
  progress: number;
  estimatedTime: number;
  onTemplateClick?: (template: string) => void;
}

const TEMPLATE_CARDS = [
  {
    title: 'Analytics Dashboard',
    subtitle: 'Live charts, KPI cards, and real-time insights.',
    icon: <Layout className="text-cyan-400" size={20} />,
  },
  {
    title: 'Auth Flow',
    subtitle: 'Branded sign-in, secure onboarding, and user states.',
    icon: <ShieldCheck className="text-emerald-400" size={20} />,
  },
  {
    title: 'Commerce Launchpad',
    subtitle: 'Product grid, purchase actions, and checkout flows.',
    icon: <Sparkles className="text-purple-400" size={20} />,
  },
  {
    title: 'Chat Console',
    subtitle: 'Conversational UI with cards, inputs, and transitions.',
    icon: <Zap className="text-blue-400" size={20} />,
  },
];

const MoLoader: React.FC<MoLoaderProps> = ({ isGenerating, progress, estimatedTime, onTemplateClick }) => {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) return;

    const slideInterval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 3500);

    return () => {
      clearInterval(slideInterval);
    };
  }, [isGenerating]);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 blur-[120px] rounded-full" />

      <div className="absolute inset-0 px-8 py-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 opacity-15 blur-sm">
          {TEMPLATE_CARDS.map((card, index) => (
            <div
              key={index}
              className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl backdrop-blur-xl cursor-pointer hover:opacity-50 transition-opacity"
              onClick={() => onTemplateClick?.(card.title)}
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Moui template</span>
                {card.icon}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-400">{card.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="relative w-full max-w-2xl px-8 flex flex-col items-center space-y-12">
        {/* Slideshow */}
        <div className="h-48 w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slideIndex}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 shadow-2xl">
                {SLIDES[slideIndex].icon}
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">
                  {SLIDES[slideIndex].title}
                </h2>
                <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                  {SLIDES[slideIndex].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Section */}
        <div className="w-full space-y-6">
          <div className="flex justify-between items-end text-[10px] font-mono tracking-widest text-slate-500 uppercase">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
              <span>{progress >= 95 ? 'Finalizing interface' : 'Materializing system'}</span>
            </div>
            <span>{Math.round(progress)}%</span>
          </div>
          
          <div className="relative h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute h-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-[0_0_20px_rgba(147,51,234,0.5)]"
            />
          </div>

          <div className="flex justify-center">
            <div className="px-4 py-1.5 bg-slate-900/80 border border-slate-800 rounded-full text-[10px] font-mono text-slate-400 flex items-center gap-2">
              <Clock size={12} className="text-purple-500" />
              <span>Estimated finish in {estimatedTime}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 opacity-20 grayscale">
        <Layout size={24} />
        <Rocket size={24} />
        <Zap size={24} />
      </div>
    </div>
  );
};

const Clock = ({ size, className }: { size: number; className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default MoLoader;
