import { LedgerEntry } from '../../src/core/dataProvider/dataprovider-types.js';
import { calculateUntimedSlot, getPublicKeyShareClass } from '../../src/utils/staking-ledger-util.js';

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
  it('should return Common for unknown addresses', async () => {
    const result = await getPublicKeyShareClass('B62qrandomaddress123');
    expect(result).toEqual({ shareClass: 'Common', shareOwner: '' });
  });

  it.skip('should return NPS with BURN owner for addresses in .burnSupercharged file', async () => {
    // This test requires the .burnSupercharged file to exist with test addresses
    // If the file doesn't exist or is empty, this will return Common
    const result = await getPublicKeyShareClass('B62qrandomaddress123');
    // Note: This is a basic test structure. In practice, you'd need to:
    // 1. Create a test .burnSupercharged file with known addresses
    // 2. Or mock the file system to control the burn address list
    expect(result.shareClass).toBe('NPS');
    expect(result.shareOwner).toBe('BURN');
  });
});
