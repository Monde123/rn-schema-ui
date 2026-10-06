/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: {
          module: 'commonjs',
          jsx: 'react-jsx',
          esModuleInterop: true,
          strict: true,
          skipLibCheck: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^react-native$': '<rootDir>/jest/react-native-mock.js',
    '^@rn-schema-ui/templates$': '<rootDir>/packages/templates/src/index.ts',
    '^.*/vendor/templates/index\\.js$': '<rootDir>/packages/templates/src/index.ts',
    '^@rn-schema-ui/runtime$': '<rootDir>/packages/runtime/src/index.ts',
  },
  collectCoverageFrom: [
    'packages/runtime/src/**/*.{ts,tsx}',
    '!packages/runtime/src/**/*.d.ts',
    '!packages/runtime/src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],
  watchPathIgnorePatterns: ['<rootDir>/tmp-'],
  modulePathIgnorePatterns: ['<rootDir>/tmp-', '<rootDir>/example/dist'],
};
