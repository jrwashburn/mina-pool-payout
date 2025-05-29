import { PaymentConfiguration } from '../../configuration/Model';
import { MockFactory } from './mock-factory';

/**
 * Mock ConfigurationManager for testing
 * This allows tests to run without environment variables
 */
export class MockConfigurationManager {
  public static Setup: PaymentConfiguration;

  /**
   * Initialize the mock configuration
   */
  public static initialize(overrides: Partial<PaymentConfiguration> = {}) {
    this.Setup = MockFactory.createPaymentConfiguration(overrides);
  }

  /**
   * Reset the mock configuration
   */
  public static reset() {
    this.Setup = null as unknown as PaymentConfiguration;
  }
}
