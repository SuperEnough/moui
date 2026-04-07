import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Layout, Trash2, Play } from 'lucide-react';

import { HistoryItem } from '../types';

interface GalleryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (index: number) => void;
}

const Gallery: React.FC<GalleryProps> = ({ history, onSelect, onDelete }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
        <Layout size={48} strokeWidth={1} />
        <p className="text-sm font-medium tracking-wide">No saved interfaces yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 max-w-7xl mx-auto">
      {history.map((item, index) => (
        <motion.div
          key={item.timestamp}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300"
        >
          <div className="aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden relative">
            {/* Preview Placeholder - in a real app we might use a screenshot or a mini-render */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
            <Layout className="text-slate-800 group-hover:text-purple-500/20 transition-colors duration-500" size={64} />
            
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
              <button
                onClick={() => onSelect(item)}
                className="p-3 bg-purple-600 hover:bg-purple-500 rounded-full text-white transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg shadow-purple-500/20"
              >
                <Play size={20} fill="currentColor" />
              </button>
              <button
                onClick={() => onDelete(index)}
                className="p-3 bg-slate-800 hover:bg-red-900/50 rounded-full text-slate-400 hover:text-red-400 transform scale-90 group-hover:scale-100 transition-all duration-300"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-200 line-clamp-1">
              {item.prompt || "Untitled Interface"}
            </h3>
            <div className="flex items-center text-[10px] text-slate-500 font-mono space-x-2">
              <Clock size={12} />
              <span>{new Date(item.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Gallery;
