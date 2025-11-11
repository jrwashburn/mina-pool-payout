import { LedgerEntry } from '../../src/core/dataProvider/dataprovider-types';
import { calculateUntimedSlot, getPublicKeyShareClass } from '../../src/utils/staking-ledger-util';

describe('Should be succesful calculating untimed slot', () => {
  it('when ledger is valid', () => {
    const ledgerMock: LedgerEntry = {
      balance: 0,
      delegate: '',
      pk: '',
      timing: {
        cliff_amount: 0,
        cliff_time: 0,
        initial_minimum_balance: 0,
        vesting_increment: 0,
        vesting_period: 0,
      },
    };

    const result = calculateUntimedSlot(ledgerMock);

    expect(0).toStrictEqual(result);
  });
});

describe('getPublicKeyShareClass', () => {
  it('should return Common shareClass for unknown addresses', () => {
    const unknownAddress = 'B62qTestUnknownAddressXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    const result = getPublicKeyShareClass(unknownAddress);
    
    expect(result.shareClass).toBe('Common');
    expect(result.shareOwner).toBe('');
  });

  it('should handle missing .burnSupercharged file gracefully', () => {
    // This test verifies that the function doesn't crash when .burnSupercharged doesn't exist
    const testAddress = 'B62qTestAddressXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    expect(() => getPublicKeyShareClass(testAddress)).not.toThrow();
  });
});
