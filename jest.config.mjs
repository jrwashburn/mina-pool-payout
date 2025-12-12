export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
        useESM: true,
        diagnostics: {
          ignoreCodes: [151002],
        },
      },
    ],
  },
  injectGlobals: true,
};
