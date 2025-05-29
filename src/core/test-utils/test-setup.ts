import 'reflect-metadata';
import { MockConfigurationManager } from './mock-config-manager';

/**
 * Setup function to be called before tests
 */
export function setupTests() {
  MockConfigurationManager.initialize();
  
  process.env.PAYOUT_DATA_PROVIDER_API_ENDPOINT = 'http://localhost:3000';
}

/**
 * Teardown function to be called after tests
 */
export function teardownTests() {
  MockConfigurationManager.reset();
}
