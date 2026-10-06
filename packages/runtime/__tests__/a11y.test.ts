import { a11yProps, errorA11y, slug } from '../src/a11y';

describe('a11y', () => {
  it('slug normalizes accents', () => {
    expect(slug('E-mail')).toBe('e-mail');
    expect(slug('Prénom')).toBe('prenom');
  });

  it('a11yProps builds label + testID', () => {
    const p = a11yProps('Email', 'Enter your email', 'field-email', 'text');
    expect(p.accessibilityLabel).toBe('Email');
    expect(p.accessibilityHint).toBe('Enter your email');
    expect(p.testID).toBe('field-email');
    expect(p.accessibilityRole).toBe('text');
  });

  it('errorA11y announces alert', () => {
    expect(errorA11y('Required').accessibilityRole).toBe('alert');
  });
});
