export type { FieldIR, FieldKind, GenerateOptions, SchemaIR } from './ir.js';
export { labelFor, hintFor } from './labels.js';
export { renderScreen, renderTest, renderStatesBarrel } from './render-screen.js';
export declare const adapters: readonly ["plain", "paper"];
export declare const routers: readonly ["expo", "rn"];
export declare function listTemplates(): {
    adapters: readonly ["plain", "paper"];
    routers: readonly ["expo", "rn"];
    screens: string[];
    tests: string[];
};
