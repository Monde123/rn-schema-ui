import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ZodTypeAny } from 'zod';
import type {
  FieldErrorMap,
  FormStatus,
  FormValues,
  UseFormOptions,
  UseFormReturn,
} from './types.js';
import { needsUnflatten, unflatten } from './unflatten.js';

type FormContextValue = {
  values: FormValues;
  errors: FieldErrorMap;
  setValue: (name: string, value: unknown) => void;
  status: FormStatus;
};

const FormContext = createContext<FormContextValue | null>(null);

function zodIssuesToMap(issues: { path: (string | number)[]; message: string }[]): FieldErrorMap {
  const map: FieldErrorMap = {};
  for (const issue of issues) {
    const key = issue.path.map(String).join('.') || '_form';
    if (!map[key]) map[key] = issue.message;
  }
  return map;
}

export function useForm<T extends FormValues>(options: UseFormOptions<T>): UseFormReturn<T> {
  const { schema, defaultValues, onSubmit, onError } = options;
  const [values, setValuesState] = useState<T>(() => ({ ...(defaultValues ?? {}) }) as T);
  const [errors, setErrors] = useState<FieldErrorMap>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name: keyof T & string, value: unknown) => {
    setValuesState((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const setValues = useCallback((patch: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(
    (next?: Partial<T>) => {
      setValuesState({ ...(defaultValues ?? {}), ...(next ?? {}) } as T);
      setErrors({});
      setStatus('idle');
      setIsSubmitting(false);
    },
    [defaultValues],
  );

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setStatus('loading');
    const payload = needsUnflatten(values) ? unflatten(values) : values;
    const result = (schema as ZodTypeAny).safeParse(payload);
    if (!result.success) {
      const map = zodIssuesToMap(result.error.issues);
      setErrors(map);
      setStatus('error');
      setIsSubmitting(false);
      onError?.(map);
      return false;
    }
    setErrors({});
    try {
      await onSubmit?.(result.data as T);
      setStatus('success');
      setIsSubmitting(false);
      return true;
    } catch {
      setStatus('error');
      setErrors({ _form: 'Something went wrong.' });
      setIsSubmitting(false);
      return false;
    }
  }, [schema, values, onSubmit, onError]);

  return {
    values,
    errors,
    status,
    setStatus,
    setValue,
    setValues,
    handleSubmit,
    reset,
    isSubmitting,
  };
}

export function FormProvider<T extends FormValues>({
  form,
  children,
}: {
  form: UseFormReturn<T>;
  children: React.ReactNode;
}): React.ReactElement {
  const value = useMemo<FormContextValue>(
    () => ({
      values: form.values,
      errors: form.errors,
      setValue: form.setValue as (name: string, value: unknown) => void,
      status: form.status,
    }),
    [form.values, form.errors, form.setValue, form.status],
  );
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return ctx;
}

export type UseFieldReturn = {
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
  setValue: (value: unknown) => void;
};

export function useField(name: string): UseFieldReturn {
  const { values, errors, setValue } = useFormContext();
  return {
    value: values[name],
    error: errors[name],
    onChange: (value: unknown) => setValue(name, value),
    setValue: (value: unknown) => setValue(name, value),
  };
}
