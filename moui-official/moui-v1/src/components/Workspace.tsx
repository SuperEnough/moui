import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

interface WorkspaceProps {
  children?: React.ReactNode;
}

export function Workspace({ children }: WorkspaceProps) {
  const { isEditMode, activeComponentId, setActiveComponentId } = useAppStore();

  return (
    <div className={`relative h-full w-full transition-all duration-500 ${isEditMode ? 'scale-[0.98]' : 'scale-100'}`}>
      {/* The actual App content */}
      <div className="h-full w-full overflow-auto rounded-3xl border border-white/5 bg-white/5 shadow-inner">
        {children || (
          <div className="flex h-full items-center justify-center text-white/20 italic">
            No application active. Use the Command Lattice to generate one.
          </div>
        )}
      </div>

      {/* ACT Mode Selection Overlay */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 cursor-crosshair bg-blue-500/10 backdrop-blur-[2px]"
          >
            <div className="absolute top-4 left-4 h-10 px-4 flex items-center rounded-full bg-blue-600 text-white text-xs font-bold shadow-lg animate-pulse">
              SELECT COMPONENT TO PATCH
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SelectableProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function Selectable({ id, children, className }: SelectableProps) {
  const { isEditMode, activeComponentId, setActiveComponentId } = useAppStore();
  const isActive = activeComponentId === id;

  return (
    <div
      onClick={(e) => {
        if (isEditMode) {
          e.stopPropagation();
          setActiveComponentId(id);
        }
      }}
      className={`relative transition-all ${className} ${
        isEditMode ? 'hover:outline hover:outline-2 hover:outline-blue-500/50 cursor-pointer' : ''
      } ${
        isActive ? 'outline outline-2 outline-blue-500 bg-blue-500/10' : ''
      }`}
    >
      {children}
      {isActive && isEditMode && (
        <div className="absolute -top-6 left-0 rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
          {id}
        </div>
      )}
    </div>
  );
}
