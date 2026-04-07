import React from 'react';
import { motion } from 'framer-motion';

interface CodeViewerProps {
  code: string;
  isVisible: boolean;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code, isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-4 top-4 bottom-32 w-[500px] bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-40"
    >
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <span className="text-sm font-mono text-slate-400">Component Source</span>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <pre className="text-xs md:text-sm font-mono text-blue-100 leading-relaxed whitespace-pre-wrap break-all">
          {code}
        </pre>
      </div>
    </motion.div>
  );
};

export default CodeViewer;
