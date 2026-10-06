import React from 'react';
import { z } from 'zod';
import renderer, { act } from 'react-test-renderer';
import { FormProvider, useForm } from '../src/form';

const schema = z.object({
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Min age 18'),
});

type Api = ReturnType<typeof useForm<(typeof schema)['_output']>>;

function Harness({
  onReady,
  defaults,
  onSubmit,
  onError,
}: {
  onReady: (api: Api) => void;
  defaults?: { email?: string; age?: number };
  onSubmit?: (v: { email: string; age: number }) => void;
  onError?: (e: Record<string, string | undefined>) => void;
}) {
  const form = useForm({
    schema,
    defaultValues: defaults ?? { email: '', age: 0 },
    onSubmit,
    onError,
  });
  React.useEffect(() => {
    onReady(form);
  });
  return <FormProvider form={form}>{null}</FormProvider>;
}

describe('useForm', () => {
  it('valide et appelle onSubmit', async () => {
    const onSubmit = jest.fn();
    let api!: Api;
    await act(async () => {
      renderer.create(
        <Harness
          onReady={(a) => {
            api = a;
          }}
          onSubmit={onSubmit}
        />,
      );
    });
    await act(async () => {
      api.setValue('email', 'a@b.co');
      api.setValue('age', 21);
    });
    let ok = false;
    await act(async () => {
      ok = await api.handleSubmit();
    });
    expect(ok).toBe(true);
    expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.co', age: 21 });
    expect(api.status).toBe('success');
  });

  it('remplit errors sur submit invalide', async () => {
    const onError = jest.fn();
    let api!: Api;
    await act(async () => {
      renderer.create(
        <Harness
          defaults={{ email: 'x', age: 10 }}
          onReady={(a) => {
            api = a;
          }}
          onError={onError}
        />,
      );
    });
    await act(async () => {
      await api.handleSubmit();
    });
    expect(api.errors.email).toBeTruthy();
    expect(api.errors.age).toBeTruthy();
    expect(api.status).toBe('error');
    expect(onError).toHaveBeenCalled();
  });

  it('reset restaure defaultValues', async () => {
    let api!: Api;
    await act(async () => {
      renderer.create(
        <Harness
          defaults={{ email: 'a@b.co', age: 20 }}
          onReady={(a) => {
            api = a;
          }}
        />,
      );
    });
    await act(async () => {
      api.setValue('email', 'other@x.com');
      api.reset();
    });
    expect(api.values.email).toBe('a@b.co');
    expect(api.status).toBe('idle');
  });

  it('setValues merge', async () => {
    let api!: Api;
    await act(async () => {
      renderer.create(
        <Harness
          onReady={(a) => {
            api = a;
          }}
        />,
      );
    });
    await act(async () => {
      api.setValues({ email: 'z@z.co', age: 30 });
    });
    expect(api.values).toEqual({ email: 'z@z.co', age: 30 });
  });
});

describe('useForm error clear', () => {
  it('efface l erreur du champ au setValue', async () => {
    let api!: Api;
    await act(async () => {
      renderer.create(
        <Harness
          defaults={{ email: 'bad', age: 10 }}
          onReady={(a) => {
            api = a;
          }}
        />,
      );
    });
    await act(async () => {
      await api.handleSubmit();
    });
    expect(api.errors.email).toBeTruthy();
    await act(async () => {
      api.setValue('email', 'good@x.com');
    });
    expect(api.errors.email).toBeUndefined();
  });
});
