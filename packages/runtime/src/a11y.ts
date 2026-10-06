import type { A11yProps } from './types.js';

/** Helper a11y cross-platform pour champs générés. */
export function a11yProps(
  label: string,
  hint?: string,
  id?: string,
  role?: A11yProps['accessibilityRole'],
): A11yProps {
  const testID = id ?? slug(label);
  return {
    accessibilityLabel: label,
    ...(hint ? { accessibilityHint: hint } : {}),
    ...(role ? { accessibilityRole: role } : {}),
    testID,
  };
}

export function slug(label: string): string {
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function errorA11y(
  message: string,
): Pick<A11yProps, 'accessibilityRole' | 'accessibilityLabel'> {
  return {
    accessibilityRole: 'alert',
    accessibilityLabel: message,
  };
}
