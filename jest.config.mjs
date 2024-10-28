/**  @type {import('@jest/types').Config.ProjectConfig} */
export default {
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        // Note: We are limited to one single TS config even though we have
        // vastly different TS configs for the sources and the tests. So we'll
        // make do with a **very** loose config file. Any type checking should
        // be done with `yarn tsc:check`.
        tsconfig: 'tsconfig.test.json',
        module: 'nodenext',
      },
    ],
  },
  resolver: 'ts-jest-resolver',
  moduleFileExtensions: ['mjs', 'js', 'ts'],
  testMatch: ['<rootDir>/test/**/*.ts'],
  testEnvironment: 'node',
};
