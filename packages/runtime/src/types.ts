import type { ZodTypeAny } from 'zod';

export type FormStatus = 'idle' | 'loading' | 'error' | 'empty' | 'success';

export type FieldErrorMap = Record<string, string | undefined>;

export type FormValues = Record<string, unknown>;

export type UseFormOptions<T extends FormValues> = {
  schema: ZodTypeAny;
  defaultValues?: Partial<T>;
  onSubmit?: (values: T) => void | Promise<void>;
  onError?: (errors: FieldErrorMap) => void;
};

export type UseFormReturn<T extends FormValues> = {
  values: T;
  errors: FieldErrorMap;
  status: FormStatus;
  setStatus: (s: FormStatus) => void;
  setValue: (name: keyof T & string, value: unknown) => void;
  setValues: (patch: Partial<T>) => void;
  handleSubmit: () => Promise<boolean>;
  reset: (next?: Partial<T>) => void;
  isSubmitting: boolean;
};

export type A11yProps = {
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityRole?:
    | 'none'
    | 'button'
    | 'link'
    | 'search'
    | 'image'
    | 'keyboardkey'
    | 'text'
    | 'adjustable'
    | 'imagebutton'
    | 'header'
    | 'summary'
    | 'alert'
    | 'checkbox'
    | 'combobox'
    | 'menu'
    | 'menubar'
    | 'menuitem'
    | 'progressbar'
    | 'radio'
    | 'radiogroup'
    | 'scrollbar'
    | 'spinbutton'
    | 'switch'
    | 'tab'
    | 'tablist'
    | 'timer'
    | 'toolbar';
  testID: string;
  accessibilityState?: { disabled?: boolean; checked?: boolean | 'mixed' };
};
