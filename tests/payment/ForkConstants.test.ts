import { ForkConstants } from '../../src/core/payoutCalculator/ForkConstants.js';

describe('ForkConstants', () => {
  describe('getRegularCoinbase', () => {
    it('returns 720 MINA for fork 0', () => {
      expect(ForkConstants.getRegularCoinbase(0)).toBe(720000000000);
    });

    it('returns 720 MINA for fork 1', () => {
      expect(ForkConstants.getRegularCoinbase(1)).toBe(720000000000);
    });

    it('returns 360 MINA for fork 2 (Mesa)', () => {
      expect(ForkConstants.getRegularCoinbase(2)).toBe(360000000000);
    });

    it('throws error for unknown fork number', () => {
      expect(() => ForkConstants.getRegularCoinbase(3)).toThrow(
        'Unknown fork number: 3. Fork must be 0, 1, or 2.',
      );
    });

    it('throws error for negative fork number', () => {
      expect(() => ForkConstants.getRegularCoinbase(-1)).toThrow(
        'Unknown fork number: -1. Fork must be 0, 1, or 2.',
      );
    });
  });

  describe('getSuperchargedCoinbase', () => {
    it('returns 1440 MINA for fork 0', () => {
      expect(ForkConstants.getSuperchargedCoinbase(0)).toBe(1440000000000);
    });

    it('throws error for fork 1 (no supercharged blocks)', () => {
      expect(() => ForkConstants.getSuperchargedCoinbase(1)).toThrow(
        'Fork 1 does not support supercharged blocks. Supercharged blocks only exist in fork 0.',
      );
    });

    it('throws error for fork 2 (no supercharged blocks)', () => {
      expect(() => ForkConstants.getSuperchargedCoinbase(2)).toThrow(
        'Fork 2 does not support supercharged blocks. Supercharged blocks only exist in fork 0.',
      );
    });

    it('throws error for unknown fork number', () => {
      expect(() => ForkConstants.getSuperchargedCoinbase(3)).toThrow(
        'Fork 3 does not support supercharged blocks. Supercharged blocks only exist in fork 0.',
      );
    });
  });

  describe('validateCoinbase', () => {
    it('accepts 720 MINA for fork 0', () => {
      expect(() => ForkConstants.validateCoinbase(0, 720000000000)).not.toThrow();
    });

    it('accepts 720 MINA for fork 1', () => {
      expect(() => ForkConstants.validateCoinbase(1, 720000000000)).not.toThrow();
    });

    it('accepts 360 MINA for fork 2 (Mesa)', () => {
      expect(() => ForkConstants.validateCoinbase(2, 360000000000)).not.toThrow();
    });

    it('throws error for wrong coinbase on fork 0', () => {
      expect(() => ForkConstants.validateCoinbase(0, 360000000000)).toThrow(
        'Coinbase must be equal to 720000000000 for fork 0 but is 360000000000',
      );
    });

    it('throws error for wrong coinbase on fork 1', () => {
      expect(() => ForkConstants.validateCoinbase(1, 360000000000)).toThrow(
        'Coinbase must be equal to 720000000000 for fork 1 but is 360000000000',
      );
    });

    it('throws error for 720 MINA on fork 2 (should be 360)', () => {
      expect(() => ForkConstants.validateCoinbase(2, 720000000000)).toThrow(
        'Coinbase must be equal to 360000000000 for fork 2 but is 720000000000',
      );
    });

    it('throws error for 1440 MINA on fork 2 (should be 360)', () => {
      expect(() => ForkConstants.validateCoinbase(2, 1440000000000)).toThrow(
        'Coinbase must be equal to 360000000000 for fork 2 but is 1440000000000',
      );
    });

    it('throws error for unknown fork number', () => {
      expect(() => ForkConstants.validateCoinbase(3, 720000000000)).toThrow(
        'Unknown fork number: 3. Fork must be 0, 1, or 2.',
      );
    });
  });
});
