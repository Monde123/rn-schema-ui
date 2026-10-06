export type { FieldIR, FieldKind, GenerateOptions, SchemaIR } from './ir.js';
export { labelFor, hintFor } from './labels.js';
export { renderScreen, renderTest, renderStatesBarrel } from './render-screen.js';

export const adapters = ['plain', 'paper'] as const;
export const routers = ['expo', 'rn'] as const;

export function listTemplates() {
  return {
    adapters,
    routers,
    screens: ['index', 'states'],
    tests: ['rntl-form'],
  };
}
