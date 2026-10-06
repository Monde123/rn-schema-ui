import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { RegisterScreen } from '../index';

describe('RegisterScreen', () => {
  it('rend les champs', () => {
    const { getByLabelText, getByTestId } = render(<RegisterScreen />);
    expect(getByLabelText('First name')).toBeTruthy();
    expect(getByTestId('submit')).toBeTruthy();
  });

  it('affiche des erreurs de validation au submit vide', async () => {
    const { getByTestId, findAllByRole } = render(<RegisterScreen />);
    fireEvent.press(getByTestId('submit'));
    const alerts = await findAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
  });

  it('soumet avec succès quand valide', async () => {
    const onSuccess = jest.fn();
    const { getByTestId } = render(<RegisterScreen onSuccess={onSuccess} />);
    fireEvent.changeText(getByTestId('field-firstName'), 'value');
    fireEvent.changeText(getByTestId('field-lastName'), 'value');
    fireEvent.changeText(getByTestId('field-email'), 'user@example.com');
    fireEvent.changeText(getByTestId('field-password'), 'password1');
    fireEvent.changeText(getByTestId('field-age'), '21');
    fireEvent(getByTestId('field-acceptTerms'), 'valueChange', true);
    fireEvent.press(getByTestId('field-country-BJ'));
    fireEvent.changeText(getByTestId('field-bio'), 'value');
    fireEvent.press(getByTestId('submit'));
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });
});
