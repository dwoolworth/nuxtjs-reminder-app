const path = require('path');

module.exports = {
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '#app': '<rootDir>/tests/mocks/app.js',
    '#imports': '<rootDir>/tests/mocks/imports.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$': '<rootDir>/tests/mocks/fileMock.js', // Add this line
  },
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.(js|jsx|ts|tsx)',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.cjs'],
  transformIgnorePatterns: ['/node_modules/(?!@vue)'],
};