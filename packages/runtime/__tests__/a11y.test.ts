import { a11yProps, errorA11y, slug } from '../src/a11y';

describe('a11y', () => {
  it('slug normalise accents', () => {
    expect(slug('E-mail')).toBe('e-mail');
    expect(slug('Prénom')).toBe('prenom');
  });

  it('a11yProps construit label + testID', () => {
    const p = a11yProps('E-mail', 'Saisissez votre e-mail', 'field-email', 'text');
    expect(p.accessibilityLabel).toBe('E-mail');
    expect(p.accessibilityHint).toBe('Saisissez votre e-mail');
    expect(p.testID).toBe('field-email');
    expect(p.accessibilityRole).toBe('text');
  });

  it('errorA11y annonce alert', () => {
    expect(errorA11y('Requis').accessibilityRole).toBe('alert');
  });
});
