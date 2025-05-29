const { setupTests } = require('./src/core/test-utils/test-setup');

process.env.PAYOUT_DATA_PROVIDER_API_ENDPOINT = 'http://localhost:3000';
process.env.NODE_ENV = 'test';

setupTests();

afterAll(() => {
  const { teardownTests } = require('./src/core/test-utils/test-setup');
  teardownTests();
});
