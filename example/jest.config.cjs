module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@rn-schema-ui/.*)',
  ],
  moduleNameMapper: {
    '^@rn-schema-ui/runtime$': '<rootDir>/../packages/runtime/dist/index.js',
  },
};
