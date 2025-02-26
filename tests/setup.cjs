const { config } = require('@vue/test-utils');
const Vue = require('vue');

// Set Vue as a global variable
global.Vue = Vue;

// Configure Vue Test Utils
if (config) {
  config.global.plugins = [];
}