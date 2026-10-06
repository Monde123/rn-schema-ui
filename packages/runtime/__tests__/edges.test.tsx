import React from 'react';
import { z } from 'zod';
import renderer, { act } from 'react-test-renderer';
import { useForm } from '../src/form';
import { unflatten } from '../src/unflatten';
import { a11yProps, errorA11y } from '../src/a11y';

type Api = ReturnType<typeof useForm<Record<string, unknown>>>;

function Harness({
  schema,
  defaults,
  onReady,
  onSubmit,
}: {
  schema: z.ZodTypeAny;
  defaults?: Record<string, unknown>;
  onReady: (api: Api) => void;
  onSubmit?: (v: Record<string, unknown>) => void;
}) {
  const form = useForm({ schema, defaultValues: defaults ?? {}, onSubmit });
  React.useEffect(() => {
    onReady(form);
  });
  return null;
}

describe('runtime edges', () => {
  it('optional: omit OK', async () => {
    const schema = z.object({
      nick: z.string().optional(),
      email: z.string().email(),
    });
    let api!: Api;
    const onSubmit = jest.fn();
    await act(async () => {
      renderer.create(
        <Harness
          schema={schema}
          defaults={{ email: 'a@b.co' }}
          onReady={(a) => {
            api = a;
          }}
          onSubmit={onSubmit}
        />,
      );
    });
    let ok = false;
    await act(async () => {
      ok = await api.handleSubmit();
    });
    expect(ok).toBe(true);
    expect(onSubmit).toHaveBeenCalled();
  });

  it('enum: invalide puis valide', async () => {
    const schema = z.object({ country: z.enum(['BJ', 'FR']) });
    let api!: Api;
    await act(async () => {
      renderer.create(
        <Harness
          schema={schema}
          defaults={{ country: 'XX' }}
          onReady={(a) => {
            api = a;
          }}
        />,
      );
    });
    await act(async () => {
      await api.handleSubmit();
    });
    expect(api.status).toBe('error');
    await act(async () => {
      api.setValue('country', 'BJ');
    });
    await act(async () => {
      await api.handleSubmit();
    });
    expect(api.status).toBe('success');
  });

  it('array de strings', async () => {
    const schema = z.object({ tags: z.array(z.string()).min(1) });
    let api!: Api;
    const onSubmit = jest.fn();
    await act(async () => {
      renderer.create(
        <Harness
          schema={schema}
          defaults={{ tags: [] }}
          onReady={(a) => {
            api = a;
          }}
          onSubmit={onSubmit}
        />,
      );
    });
    await act(async () => {
      await api.handleSubmit();
    });
    expect(api.errors.tags).toBeTruthy();
    await act(async () => {
      api.setValue('tags', ['a', 'b']);
    });
    await act(async () => {
      await api.handleSubmit();
    });
    expect(onSubmit).toHaveBeenCalledWith({ tags: ['a', 'b'] });
  });

  it('nested flatten via unflatten avant parse', async () => {
    const schema = z.object({
      profile: z.object({ city: z.string().min(1) }),
    });
    let api!: Api;
    const onSubmit = jest.fn();
    await act(async () => {
      renderer.create(
        <Harness
          schema={schema}
          defaults={{ 'profile.city': '' }}
          onReady={(a) => {
            api = a;
          }}
          onSubmit={onSubmit}
        />,
      );
    });
    await act(async () => {
      await api.handleSubmit();
    });
    expect(api.status).toBe('error');
    await act(async () => {
      api.setValue('profile.city', 'Cotonou');
    });
    await act(async () => {
      await api.handleSubmit();
    });
    expect(onSubmit).toHaveBeenCalledWith({ profile: { city: 'Cotonou' } });
    expect(unflatten({ 'profile.city': 'X' })).toEqual({ profile: { city: 'X' } });
  });

  it('a11y helpers roles', () => {
    const p = a11yProps('Pays', 'Choisissez', 'field-country', 'button');
    expect(p.accessibilityRole).toBe('button');
    expect(p.accessibilityLabel).toBe('Pays');
    expect(errorA11y('Requis').accessibilityRole).toBe('alert');
  });
});
