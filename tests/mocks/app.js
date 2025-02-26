// tests/mocks/app.js
export const useRuntimeConfig = () => ({
    public: {
      apiBase: 'http://mock-api.com'
    }
  });
  
  export const useCookie = () => ({ value: 'mock-token' });