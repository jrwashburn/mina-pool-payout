import { interfaces } from 'inversify';
import { PaymentConfiguration } from '../../configuration/Model';
import { MockFactory } from './mock-factory';

/**
 * Mock configuration provider for tests
 * This allows tests to run without environment variables
 */
export class MockConfigurationProvider {
  /**
   * Get a mock configuration for tests
   */
  static get(): PaymentConfiguration {
    return MockFactory.createPaymentConfiguration();
  }
}
