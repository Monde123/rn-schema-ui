import React from 'react';
import { z } from 'zod';
import renderer, { act } from 'react-test-renderer';
import { FormProvider, useField, useForm, useFormContext } from '../src/form';

function FieldProbe({ onReady }: { onReady: (v: unknown) => void }) {
  const field = useField('name');
  const ctx = useFormContext();
  React.useEffect(() => {
    onReady({ field, ctx });
  });
  return null;
}

describe('useField + FormProvider', () => {
  it('lit et écrit via le contexte', async () => {
    let api: any;
    function Host() {
      const form = useForm({
        schema: z.object({ name: z.string() }),
        defaultValues: { name: '' },
      });
      return (
        <FormProvider form={form}>
          <FieldProbe
            onReady={(v) => {
              api = v;
            }}
          />
        </FormProvider>
      );
    }
    await act(async () => {
      renderer.create(<Host />);
    });
    await act(async () => {
      api.field.onChange('Ada');
    });
    expect(api.field.value).toBe('Ada');
    expect(api.ctx.values.name).toBe('Ada');
  });

  it('useFormContext hors provider lève', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    function Boom() {
      useFormContext();
      return null;
    }
    expect(() => renderer.create(<Boom />)).toThrow(/FormProvider/);
    err.mockRestore();
  });
});

describe('useForm onSubmit throw', () => {
  it('passe en error si onSubmit rejette', async () => {
    let formApi: any;
    function Host() {
      const form = useForm({
        schema: z.object({ x: z.string() }),
        defaultValues: { x: 'ok' },
        onSubmit: async () => {
          throw new Error('boom');
        },
      });
      React.useEffect(() => {
        formApi = form;
      });
      return null;
    }
    await act(async () => {
      renderer.create(<Host />);
    });
    let ok = true;
    await act(async () => {
      ok = await formApi.handleSubmit();
    });
    expect(ok).toBe(false);
    expect(formApi.status).toBe('error');
    expect(formApi.errors._form).toBeTruthy();
  });
});
