import React from 'react';
import * as ReactDOM from 'react-dom';
import * as FramerMotion from 'framer-motion';
import * as LucideReact from 'lucide-react';
import * as Recharts from 'recharts';
import { create } from 'zustand';

// Define the execution scope
const scope: any = {
  react: React,
  'react-dom': ReactDOM,
  'framer-motion': FramerMotion,
  'lucide-react': LucideReact,
  'recharts': Recharts,
  'zustand': { create },
};

// Custom require function for the sandboxed environment
const customRequire = (moduleName: string) => {
  if (scope[moduleName]) {
    return scope[moduleName];
  }
  throw new Error(`Module '${moduleName}' is not available in the sandbox.`);
};

export const updateRegistry = (currentRegistry: any, key: string, newCode: string) => {
  return {
    ...currentRegistry,
    components: {
      ...currentRegistry.components,
      [key]: newCode
    }
  };
};

export const exportToHTML = (registry: any) => {
  const layoutCode = (registry.layout as string) || '';
  const logicCode = (registry.logic as string) || '';
  const components = (registry.components as { [name: string]: string }) || {};

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${registry.meta?.title || 'MoUI Export'}</title>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com/3.4.15"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/lucide@0.292.0/dist/umd/lucide.min.js"></script>
    <script src="https://unpkg.com/zustand@4.4.1/dist/umd/index.js"></script>
    <style>
      body { background-color: ${registry.meta?.themeColor || '#020617'}; color: white; margin: 0; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect, createContext, useContext } = React;
        const { motion, AnimatePresence } = FramerMotion;

        // Mock require for the browser
        const modules = {
          'react': React,
          'framer-motion': FramerMotion,
          'lucide-react': lucide,
          'zustand': window.zustand,
        };

        const require = (name) => {
          const normalized = name.replace(/^\.\//, '').replace(/\.(tsx|ts|js)$/, '');
          return modules[normalized] || window[normalized] || window[name];
        };

        // 1. Logic / State
        const logic = (() => {
          const exports = {};
          const module = { exports };
          ${logicCode.replace(/import .* from .*/g, '')}
          return module.exports.default || module.exports;
        })();
        modules['logic'] = logic;
        modules['Logic'] = logic;

        // 2. Components
        ${Object.entries(components).map(([name, code]) => `
          const ${name} = (() => {
            const exports = {};
            const module = { exports };
            ${code.replace(/import .* from .*/g, '')}
            return module.exports.default || module.exports;
          })();
          modules['${name}'] = ${name};
        `).join('\n')}

        // 3. Layout
        const Layout = (() => {
          const exports = {};
          const module = { exports };
          ${layoutCode.replace(/import .* from .*/g, '')}
          return module.exports.default || module.exports;
        })();

        // 4. Bootstrap
        const App = () => (
          <Layout>
            <Main />
          </Layout>
        );

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
  `;

  const blob = new Blob([htmlTemplate], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${registry.meta.title || 'moui-app'}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const globalModuleCache: { [code: string]: any } = {};

export const executeRegistry = (registry: { [name: string]: string }, main: string): React.ComponentType | null => {
  const compiledComponents: { [name: string]: any } = {};
  const compiling = new Set<string>();

  const compileComponent = (name: string) => {
    if (compiledComponents[name]) return compiledComponents[name];
    if (compiling.has(name)) throw new Error(`Circular dependency detected: ${name}`);
    
    compiling.add(name);
    try {
      const code = registry[name];
      if (!code) throw new Error(`Component '${name}' not found in registry.`);

      // Check global cache for logic to preserve state
      if ((name === 'logic' || name === 'Logic') && globalModuleCache[code]) {
        compiledComponents[name] = globalModuleCache[code];
        return compiledComponents[name];
      }

      // @ts-ignore
      const transformed = window.Babel.transform(code, {
        presets: ['react', 'env', 'typescript'],
        filename: `${name}.tsx`,
      }).code;

      const module = { exports: {} as any };
      const wrapperFunction = new Function('require', 'React', 'exports', 'module', transformed);
      wrapperFunction(registryRequire, React, module.exports, module);
      
      compiledComponents[name] = module.exports.default || module.exports;

      // Cache logic to preserve state
      if (name === 'logic' || name === 'Logic') {
        globalModuleCache[code] = compiledComponents[name];
      }

      return compiledComponents[name];
    } finally {
      compiling.delete(name);
    }
  };

  const registryRequire = (moduleName: string) => {
    // Normalize module name (strip ./ and .tsx/.ts/.js)
    const normalizedName = moduleName
      .replace(/^\.\//, '')
      .replace(/\.(tsx|ts|js)$/, '');

    if (registry[normalizedName]) {
      return compileComponent(normalizedName);
    }
    return customRequire(moduleName);
  };

  try {
    return compileComponent(main);
  } catch (error) {
    console.error("Registry Compilation Error:", error);
    throw error;
  }
};

export const transformAndExecute = (code: string): React.ComponentType | null => {
  try {
    // 1. Transform TSX/ESM to CommonJS/Vanilla JS using Babel
    // @ts-ignore - Babel is loaded via CDN in index.html
    if (!window.Babel) {
      throw new Error("Babel not loaded");
    }

    // @ts-ignore
    const transformed = window.Babel.transform(code, {
      presets: ['react', 'env', 'typescript'],
      filename: 'file.tsx',
    }).code;

    // 2. Wrap the code in a function to execute it and capture the export
    // We create a wrapper that provides 'require', 'React', 'exports', 'module'
    const wrapperFunction = new Function('require', 'React', 'exports', 'module', transformed);

    // 3. Execute
    const module = { exports: {} as any };
    const exports = module.exports;

    wrapperFunction(customRequire, React, exports, module);

    // 4. Return the default export
    return module.exports.default || module.exports;

  } catch (error) {
    console.error("Code Compilation Error:", error);
    throw error;
  }
};