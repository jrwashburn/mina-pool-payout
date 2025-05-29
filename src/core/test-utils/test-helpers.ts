import { Block, Stake } from '../dataProvider/dataprovider-types';
import { MockFactory } from './mock-factory';

/**
 * Test helpers for creating consistent test data
 */
export class TestHelpers {
  /**
   * Create blocks and stakes with matching winner
   * This ensures that one of the stakes has a publicKey that matches the block's winnerpublickey
   * which is required by PayoutCalculator.getWinner
   */
  static createBlocksAndStakesWithWinner(
    blockCount: number = 1,
    stakesCount: number = 3,
    blockOverrides: Partial<Block> = {},
    stakeOverrides: Partial<Stake> = {}
  ): [Block[], Stake[], number] {
    const winnerPublicKey = 'B62qWinnerPublicKey';
    
    const blocks = MockFactory.createBlocks(blockCount, { 
      winnerpublickey: winnerPublicKey,
      ...blockOverrides 
    });
    
    const stakes: Stake[] = [];
    
    stakes.push(MockFactory.createStake({
      publicKey: winnerPublicKey,
      ...stakeOverrides
    }));
    
    for (let i = 0; i < stakesCount - 1; i++) {
      stakes.push(MockFactory.createStake({
        publicKey: `B62qStakerPublicKey${i}`,
        ...stakeOverrides
      }));
    }
    
    const totalStake = stakes.reduce((sum, stake) => sum + stake.stakingBalance, 0);
    
    return [blocks, stakes, totalStake];
  }
  
  /**
   * Mock the getWinner method of PayoutCalculator
   * This is useful for tests where you don't want to include a winner stake
   * Returns a function to restore the original method
   */
  static mockGetWinner(calculator: any): () => void {
    const originalGetWinner = calculator.getWinner;
    
    calculator.getWinner = jest.fn().mockReturnValue({
      publicKey: 'B62qWinnerPublicKey',
      total: 0,
      stakingBalance: 100000000000,
      untimedAfterSlot: 20000,
      shareClass: { shareClass: 'Common', shareOwner: '' },
      totalToBurn: 0
    });
    
    return () => {
      calculator.getWinner = originalGetWinner;
    };
  }
}
