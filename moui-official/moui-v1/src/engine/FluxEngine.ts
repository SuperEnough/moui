import { useAppStore } from '../store/useAppStore';

/**
 * MoUI Flux Engine
 * Orchestrates generation and delta-patching of micro-applications.
 */
export const FluxEngine = {
  /**
   * System Prompt for the AI "Senior Guardian"
   */
  SYSTEM_PROMPT: `
    You are MoUI Senior Guardian, the core generative intelligence of MoUI Official.
    Your goal is to generate enterprise-grade, high-performance React components with "Atomic Precision".

    ARCHITECTURAL STANDARDS:
    1. Styling: Use Tailwind CSS v4 only.
    2. Icons: Use lucide-react exclusively.
    3. Animations: Use framer-motion for all interactions.
    4. Performance: Use memoization (React.memo, useMemo) for heavy computations.
    5. No Placeholders: Every image must be generated using generate_image if needed (represented as <img> with specific srcs).
    6. ACT Compliance: Every interactive or logical block must be wrapped in <Selectable id="unique-id">.

    COMPONENT STRUCTURE:
    - Return a single default export function.
    - All logic must be self-contained.
    - Props should be typed using TypeScript interfaces.
  `,

  /**
   * Routes instructions based on current system state.
   */
  async process(query: string) {
    const state = useAppStore.getState();
    
    if (state.isEditMode && state.activeComponentId) {
      return this.patch(state.activeComponentId, query);
    } else {
      return this.generate(query);
    }
  },

  async generate(query: string) {
    console.log("Generating new application for:", query);
    // This will eventually call the internal completion API
    return {
      type: 'FULL_GEN',
      code: `// Generated code for ${query}`
    };
  },

  async patch(componentId: string, query: string) {
    console.log(`Patching component [${componentId}] with instruction:`, query);
    // This will eventually call the internal completion API with the specific component context
    return {
      type: 'DELTA_PATCH',
      target: componentId,
      patch: `// Patched code for ${componentId}`
    };
  }
};
