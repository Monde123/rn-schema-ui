import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { EmptyState, ErrorState, LoadingState, ScreenStates, SuccessState } from '../src/states';

describe('states', () => {
  it('rend Loading Error Empty Success', () => {
    expect(renderer.create(<LoadingState />).toJSON()).toBeTruthy();
    expect(renderer.create(<EmptyState />).toJSON()).toBeTruthy();
    expect(renderer.create(<SuccessState />).toJSON()).toBeTruthy();
    const err = renderer.create(<ErrorState onRetry={() => undefined} />);
    expect(err.toJSON()).toBeTruthy();
  });

  it('ScreenStates loading vs idle', () => {
    const loading = renderer.create(
      <ScreenStates status="loading">
        <></>
      </ScreenStates>,
    );
    expect(JSON.stringify(loading.toJSON())).toContain('Loading');
    const idle = renderer.create(
      <ScreenStates status="idle">
        <React.Fragment>OK</React.Fragment>
      </ScreenStates>,
    );
    expect(JSON.stringify(idle.toJSON())).toContain('OK');
  });

  it('ErrorState onRetry', () => {
    const onRetry = jest.fn();
    let tree!: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<ErrorState onRetry={onRetry} />);
    });
    const pressable = tree.root.findByProps({ testID: 'state-error-retry' });
    act(() => {
      pressable.props.onPress();
    });
    expect(onRetry).toHaveBeenCalled();
  });

  it('ScreenStates empty', () => {
    const t = renderer.create(
      <ScreenStates status="empty">
        <></>
      </ScreenStates>,
    );
    expect(JSON.stringify(t.toJSON())).toContain('No data');
  });
});

describe('ScreenStates branches', () => {
  it('error sans children', () => {
    const t = renderer.create(
      <ScreenStates status="error" errorMessage="Boom" onRetry={() => undefined}>
        {null}
      </ScreenStates>,
    );
    expect(JSON.stringify(t.toJSON())).toContain('Boom');
  });

  it('success avec message', () => {
    const t = renderer.create(
      <ScreenStates status="success" successMessage="Yay">
        <React.Fragment>child</React.Fragment>
      </ScreenStates>,
    );
    const s = JSON.stringify(t.toJSON());
    expect(s).toContain('Yay');
  });
});
