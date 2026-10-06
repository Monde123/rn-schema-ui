export type FieldKind =
  'string' | 'email' | 'password' | 'number' | 'boolean' | 'enum' | 'date' | 'array';

export type FieldIR = {
  key: string;
  kind: FieldKind;
  required: boolean;
  label: string;
  hint: string;
  section?: string;
  enumValues?: string[];
  arrayItemKind?: 'string' | 'number' | 'boolean';
};

export type SchemaIR = {
  name: string;
  exportName: string;
  schemaImportPath: string;
  fields: FieldIR[];
  warnings: string[];
};

export type GenerateOptions = {
  adapter: 'plain' | 'paper';
  router: 'expo' | 'rn';
  componentName: string;
  locale: 'en';
};
