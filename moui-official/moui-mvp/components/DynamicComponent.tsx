import React, { useState, useEffect } from 'react';
import { executeRegistry } from '../utils/codeExecution';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Registry } from '../types';

interface DynamicComponentProps {
  registry?: Registry;
  code?: string; // Fallback for old monolithic code
}

const DynamicComponent: React.FC<DynamicComponentProps> = ({ registry, code }) => {
  const [DynamicCmp, setDynamicCmp] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setError(null);
      let compiledComponent: React.ComponentType | null = null;
      
      if (registry) {
        // Compile logic first
        const logicModule = executeRegistry({ Logic: registry.logic }, 'Logic');
        
        // Compile components
        const components = { ...registry.components };
        
        // Compile layout which wraps Main
        const Layout = executeRegistry({ 
          ...components, 
          Layout: registry.layout,
          Logic: registry.logic,
          logic: registry.logic
        }, 'Layout');

        compiledComponent = Layout;
      } else if (code) {
        // Fallback for monolithic code
        compiledComponent = executeRegistry({ App: code }, 'App');
      }

      if (compiledComponent) {
        setDynamicCmp(() => compiledComponent);
      } else {
        throw new Error("No component materialized.");
      }
    } catch (err: any) {
      setError(err);
      setDynamicCmp(null);
    }
  }, [registry, code]);

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-red-950/20 p-8 text-center">
        <div className="bg-red-900/20 p-4 rounded-full mb-4">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-red-200 mb-2">Compilation Error</h3>
        <p className="text-red-300 max-w-lg mb-6">{error.message}</p>
        <pre className="bg-black/50 p-4 rounded-lg text-xs text-left text-red-200 w-full max-w-2xl overflow-auto border border-red-900/50">
          {code}
        </pre>
      </div>
    );
  }

  if (!DynamicCmp) {
    return (
      <div className="flex h-full w-full items-center justify-center text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <DynamicCmp />
    </div>
  );
};

export default DynamicComponent;