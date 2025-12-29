/**
 * Integration test to ensure the main entry point and all dependencies can be loaded
 * This test catches import issues that unit tests might miss
 */
describe('Integration - Main Entry Point', () => {
  it('should be able to import graphql-me without errors', async () => {
    // This will fail if there are any import issues with NodeNext module resolution
    await expect(import('../../src/infrastructure/graphql-me.js')).resolves.toBeDefined();
  });

  it('should be able to import graphql-pay without errors', async () => {
    await expect(import('../../src/infrastructure/graphql-pay.js')).resolves.toBeDefined();
  });

  it('should be able to import TransactionBuilder', async () => {
    await expect(import('../../src/core/transaction/TransactionBuilder.js')).resolves.toBeDefined();
  });

  it('should be able to import data provider modules', async () => {
    await expect(import('../../src/core/dataProvider/dataprovider-minaexplorer/block-queries-gql.js')).resolves.toBeDefined();
    await expect(import('../../src/core/dataProvider/dataprovider-minaexplorer/staking-ledger-gql.js')).resolves.toBeDefined();
  });
});
