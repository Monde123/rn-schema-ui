export { labelFor, hintFor } from './labels.js';
export { renderScreen, renderTest, renderStatesBarrel } from './render-screen.js';
export const adapters = ['plain', 'paper'];
export const routers = ['expo', 'rn'];
export function listTemplates() {
    return {
        adapters,
        routers,
        screens: ['index', 'states'],
        tests: ['rntl-form'],
    };
}
