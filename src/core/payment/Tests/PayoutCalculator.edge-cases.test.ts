import 'reflect-metadata';
import { KeyedRate } from '../../../configuration/Model';
import { Block, Stake } from '../../dataProvider/dataprovider-types';
import { PayoutCalculator } from '../../payoutCalculator/PayoutCalculator';
import { MockFactory } from '../../test-utils/mock-factory';
import { TestHelpers } from '../../test-utils/test-helpers';

describe('PayoutCalculator Edge Cases', () => {
  let calculator: PayoutCalculator;
  let commissionRates: KeyedRate;
  let keyBurnRates: KeyedRate;

  beforeEach(() => {
    calculator = new PayoutCalculator();
    commissionRates = {};
    keyBurnRates = {};
  });

  describe('Winner validation', () => {
    it('should throw error when no matching winner exists', async () => {
      const blocks: Block[] = MockFactory.createBlocks(1, {
        winnerpublickey: 'B62qNonExistentWinner'
      });
      
      const stakes: Stake[] = [
        MockFactory.createStake({ publicKey: 'B62qStaker1', stakingBalance: 100000000000 }),
        MockFactory.createStake({ publicKey: 'B62qStaker2', stakingBalance: 100000000000 })
      ];
      
      const totalStake = stakes.reduce((sum, stake) => sum + stake.stakingBalance, 0);

      await expect(calculator.getPayouts(
        blocks,
        stakes,
        totalStake,
        0.05,
        0.08,
        0.05,
        0.08,
        commissionRates,
        keyBurnRates,
        'burnAddress',
        'md5hash',
        'memo'
      )).rejects.toThrow('Should have exactly 1 winner.');
    });
  });

  describe('Custom commission rates', () => {
    it('should apply custom commission rates correctly', async () => {
      const [blocks, stakes, totalStake] = TestHelpers.createBlocksAndStakesWithWinner(1, 4);
      
      stakes[1].publicKey = 'customRate1';
      stakes[2].publicKey = 'customRate2';
      stakes[3].publicKey = 'defaultRate';

      commissionRates['customRate1'] = { rate: 0.10 }; // 10% commission
      commissionRates['customRate2'] = { rate: 0.15 }; // 15% commission

      const result = await calculator.getPayouts(
        blocks,
        stakes,
        totalStake,
        0.05, // default commission rate
        0.08,
        0.05,
        0.08,
        commissionRates,
        keyBurnRates,
        'burnAddress',
        'md5hash',
        'memo'
      );

      const payouts = result[0];
      
      const customRate1Payout = payouts.find(p => p.publicKey === 'customRate1');
      const customRate2Payout = payouts.find(p => p.publicKey === 'customRate2');
      const defaultRatePayout = payouts.find(p => p.publicKey === 'defaultRate');

      expect(customRate1Payout).toBeDefined();
      expect(customRate2Payout).toBeDefined();
      expect(defaultRatePayout).toBeDefined();
      
      if (customRate1Payout && customRate2Payout && defaultRatePayout) {
        expect(customRate1Payout.amount).toBeLessThan(defaultRatePayout.amount);
        expect(customRate2Payout.amount).toBeLessThan(customRate1Payout.amount);
      }
    });
  });

  describe('Burn rate scenarios', () => {
    it('should apply burn rates correctly', async () => {
      const blocks: Block[] = MockFactory.createBlocks(1, {
        coinbase: 720000000000, // REGULARCOINBASE value
        usercommandtransactionfees: 10000000, // Add transaction fees
        feetransfertoreceiver: 5000000, // Add fee transfer
        feetransferfromcoinbase: 1000000 // Add fee transfer from coinbase
      });
      
      const stakes: Stake[] = [
        MockFactory.createStake({ 
          publicKey: blocks[0].winnerpublickey, 
          stakingBalance: 100000000000,
          shareClass: { shareClass: 'Common', shareOwner: '' }
        }),
        MockFactory.createStake({ 
          publicKey: 'burnRate1', 
          stakingBalance: 100000000000,
          shareClass: { shareClass: 'Common', shareOwner: '' }
        }),
        MockFactory.createStake({ 
          publicKey: 'burnRate2', 
          stakingBalance: 100000000000,
          shareClass: { shareClass: 'Common', shareOwner: '' }
        }),
        MockFactory.createStake({ 
          publicKey: 'noBurn', 
          stakingBalance: 100000000000,
          shareClass: { shareClass: 'Common', shareOwner: '' }
        })
      ];
      
      const totalStake = stakes.reduce((sum, stake) => sum + stake.stakingBalance, 0);
      
      keyBurnRates['burnRate1'] = { rate: 0.10 }; // 10% burn
      keyBurnRates['burnRate2'] = { rate: 0.20 }; // 20% burn
      keyBurnRates[blocks[0].winnerpublickey] = { rate: 0.05 }; // 5% burn for winner

      const result = await calculator.getPayouts(
        blocks,
        stakes,
        totalStake,
        0.05, // default commission rate
        0.08, // MF commission rate
        0.05, // O1 commission rate
        0.08, // investors commission rate
        commissionRates,
        keyBurnRates,
        'burnAddress',
        'md5hash',
        'memo'
      );

      const payouts = result[0];
      const details = result[1];
      const totalNegotiatedBurn = result[5]; // This is the negotiated burn amount (6th element)
      
      expect(totalNegotiatedBurn).toBeGreaterThan(0);
      
      const burnPayout = payouts.find(p => p.publicKey === 'burnAddress' && p.summaryGroup === 2);
      expect(burnPayout).toBeDefined();
      
      if (burnPayout) {
        expect(burnPayout.amount).toEqual(totalNegotiatedBurn);
      }
      
      const burnRate1Payout = payouts.find(p => p.publicKey === 'burnRate1');
      const burnRate2Payout = payouts.find(p => p.publicKey === 'burnRate2');
      const noBurnPayout = payouts.find(p => p.publicKey === 'noBurn');
      
      if (burnRate1Payout && burnRate2Payout && noBurnPayout) {
        const burnRate1Amount = burnRate1Payout.amount;
        const burnRate2Amount = burnRate2Payout.amount;
        const noBurnAmount = noBurnPayout.amount;
        
        const burnRate1PerStake = burnRate1Amount / 100000000000;
        const burnRate2PerStake = burnRate2Amount / 100000000000;
        const noBurnPerStake = noBurnAmount / 100000000000;
        
        expect(burnRate1PerStake).toBeLessThan(noBurnPerStake);
        expect(burnRate2PerStake).toBeLessThan(burnRate1PerStake);
      }
    });
  });

  describe('Different share classes', () => {
    it('should handle different share classes correctly', async () => {
      const [blocks, stakes, totalStake] = TestHelpers.createBlocksAndStakesWithWinner(1, 3);
      
      stakes[1].publicKey = 'npsShare';
      stakes[1].shareClass = { shareClass: 'NPS', shareOwner: 'MF' };
      
      stakes[2].publicKey = 'commonShare';
      stakes[2].shareClass = { shareClass: 'Common', shareOwner: '' };

      const result = await calculator.getPayouts(
        blocks,
        stakes,
        totalStake,
        0.05,
        0.08, // MF commission rate
        0.05,
        0.08,
        commissionRates,
        keyBurnRates,
        'burnAddress',
        'md5hash',
        'memo'
      );

      const details = result[1];
      
      const npsShareDetails = details.find(d => d.publicKey === 'npsShare');
      const commonShareDetails = details.find(d => d.publicKey === 'commonShare');

      expect(npsShareDetails).toBeDefined();
      expect(commonShareDetails).toBeDefined();
      
      if (npsShareDetails && commonShareDetails) {
        expect(npsShareDetails.shareClass.shareClass).toBe('NPS');
        expect(npsShareDetails.shareClass.shareOwner).toBe('MF');
        expect(commonShareDetails.shareClass.shareClass).toBe('Common');
      }
    });
  });

  describe('Error scenarios', () => {
    it('should throw error for invalid share classes', async () => {
      const [blocks, stakes, totalStake] = TestHelpers.createBlocksAndStakesWithWinner(1, 2);
      
      stakes[1].publicKey = 'invalidShare';
      stakes[1].shareClass = { shareClass: 'Invalid', shareOwner: 'Unknown' } as any;

      await expect(calculator.getPayouts(
        blocks,
        stakes,
        totalStake,
        0.05,
        0.08,
        0.05,
        0.08,
        commissionRates,
        keyBurnRates,
        'burnAddress',
        'md5hash',
        'memo'
      )).rejects.toThrow('Shares should be common or non-participating');
    });

    it('should handle NPS shares with different owners', async () => {
      const [blocks, stakes, totalStake] = TestHelpers.createBlocksAndStakesWithWinner(1, 3);
      
      stakes[1].publicKey = 'npsShare1';
      stakes[1].shareClass = { shareClass: 'NPS', shareOwner: 'MF' };
      
      stakes[2].publicKey = 'npsShare2';
      stakes[2].shareClass = { shareClass: 'NPS', shareOwner: 'O1' }; // Using valid owner for test

      const result = await calculator.getPayouts(
        blocks,
        stakes,
        totalStake,
        0.05,
        0.08,
        0.05,
        0.08,
        commissionRates,
        keyBurnRates,
        'burnAddress',
        'md5hash',
        'memo'
      );

      const payouts = result[0];
      const npsShare1Payout = payouts.find(p => p.publicKey === 'npsShare1');
      const npsShare2Payout = payouts.find(p => p.publicKey === 'npsShare2');
      
      expect(npsShare1Payout).toBeDefined();
      expect(npsShare2Payout).toBeDefined();
    });
  });
});
