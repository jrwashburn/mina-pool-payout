import 'reflect-metadata';
import { Block } from '../../dataProvider/dataprovider-types';
import { IBlockDataProvider, IDataProviderFactory, IStakeDataProvider } from '../../dataProvider/Models';
import { IPayoutCalculatorFactory, IPayoutCalculator } from '../../payoutCalculator/Model';
import { IBlockProcessor } from '../Model';
import { PaymentBuilder } from '../PaymentBuilder';
import { MockFactory } from '../../test-utils/mock-factory';

describe('PaymentBuilder Error Cases', () => {
  let mockConfig = MockFactory.createPaymentConfiguration();
  
  beforeEach(() => {
    mockConfig = MockFactory.createPaymentConfiguration();
  });

  describe('When block processor fails', () => {
    it('should propagate the error', async () => {
      const mockedBlockProcessor: IBlockProcessor = { 
        determineLastBlockHeightToProcess: jest.fn().mockRejectedValue(new Error('Block processor error'))
      };

      const mockedPayoutCalculatorFactory: IPayoutCalculatorFactory<IPayoutCalculator> = {
        build: jest.fn().mockReturnValue({
          getPayouts: jest.fn().mockResolvedValue([[], [], [], 0, 0, 0])
        })
      };

      const mockedBlockDataFactory: IDataProviderFactory<IBlockDataProvider> = {
        build: jest.fn().mockReturnValue({
          getBlocks: jest.fn().mockResolvedValue([]),
          getLatestHeight: jest.fn().mockResolvedValue(1000),
          getMinMaxBlocksByEpoch: jest.fn()
        })
      };

      const mockedStakeDataFactory: IDataProviderFactory<IStakeDataProvider> = {
        build: jest.fn().mockReturnValue({
          getStakes: jest.fn().mockResolvedValue({
            stakes: [],
            totalStakingBalance: 0
          })
        })
      };

      const builder = new PaymentBuilder(
        mockedBlockProcessor,
        mockedPayoutCalculatorFactory,
        mockedBlockDataFactory,
        mockedStakeDataFactory,
        mockConfig
      );

      await expect(builder.build()).rejects.toThrow('Block processor error');
      expect(mockedBlockProcessor.determineLastBlockHeightToProcess).toHaveBeenCalledTimes(1);
    });
  });

  describe('When block data provider fails', () => {
    it('should propagate the error when getLatestHeight fails', async () => {
      const mockedBlockProcessor: IBlockProcessor = { 
        determineLastBlockHeightToProcess: jest.fn().mockResolvedValue(1000)
      };

      const mockBlockDataProvider: IBlockDataProvider = {
        getBlocks: jest.fn().mockResolvedValue([]),
        getLatestHeight: jest.fn().mockRejectedValue(new Error('Latest height error')),
        getMinMaxBlocksByEpoch: jest.fn()
      };

      const mockedBlockDataFactory: IDataProviderFactory<IBlockDataProvider> = {
        build: jest.fn().mockReturnValue(mockBlockDataProvider)
      };

      const mockedPayoutCalculatorFactory: IPayoutCalculatorFactory<IPayoutCalculator> = {
        build: jest.fn().mockReturnValue({
          getPayouts: jest.fn().mockResolvedValue([[], [], [], 0, 0, 0])
        })
      };

      const mockedStakeDataFactory: IDataProviderFactory<IStakeDataProvider> = {
        build: jest.fn().mockReturnValue({
          getStakes: jest.fn().mockResolvedValue({
            stakes: [],
            totalStakingBalance: 0
          })
        })
      };

      const builder = new PaymentBuilder(
        mockedBlockProcessor,
        mockedPayoutCalculatorFactory,
        mockedBlockDataFactory,
        mockedStakeDataFactory,
        mockConfig
      );

      await expect(builder.build()).rejects.toThrow('Latest height error');
      expect(mockBlockDataProvider.getLatestHeight).toHaveBeenCalledTimes(1);
    });

    it('should propagate the error when getBlocks fails', async () => {
      const mockedBlockProcessor: IBlockProcessor = { 
        determineLastBlockHeightToProcess: jest.fn().mockResolvedValue(1000)
      };

      const mockBlockDataProvider: IBlockDataProvider = {
        getBlocks: jest.fn().mockRejectedValue(new Error('Get blocks error')),
        getLatestHeight: jest.fn().mockResolvedValue(1100),
        getMinMaxBlocksByEpoch: jest.fn()
      };

      const mockedBlockDataFactory: IDataProviderFactory<IBlockDataProvider> = {
        build: jest.fn().mockReturnValue(mockBlockDataProvider)
      };

      const mockedPayoutCalculatorFactory: IPayoutCalculatorFactory<IPayoutCalculator> = {
        build: jest.fn().mockReturnValue({
          getPayouts: jest.fn().mockResolvedValue([[], [], [], 0, 0, 0])
        })
      };

      const mockedStakeDataFactory: IDataProviderFactory<IStakeDataProvider> = {
        build: jest.fn().mockReturnValue({
          getStakes: jest.fn().mockResolvedValue({
            stakes: [],
            totalStakingBalance: 0
          })
        })
      };

      const builder = new PaymentBuilder(
        mockedBlockProcessor,
        mockedPayoutCalculatorFactory,
        mockedBlockDataFactory,
        mockedStakeDataFactory,
        mockConfig
      );

      await expect(builder.build()).rejects.toThrow('Get blocks error');
      expect(mockBlockDataProvider.getLatestHeight).toHaveBeenCalledTimes(1);
      expect(mockBlockDataProvider.getBlocks).toHaveBeenCalledTimes(1);
    });
  });

  describe('When stake data provider fails', () => {
    it('should propagate the error', async () => {
      const mockedBlockProcessor: IBlockProcessor = { 
        determineLastBlockHeightToProcess: jest.fn().mockResolvedValue(1000)
      };

      const mockBlockDataProvider: IBlockDataProvider = {
        getBlocks: jest.fn().mockResolvedValue([
          MockFactory.createBlock({ stakingledgerhash: 'ledger-hash-123' })
        ]),
        getLatestHeight: jest.fn().mockResolvedValue(1100),
        getMinMaxBlocksByEpoch: jest.fn()
      };

      const mockedBlockDataFactory: IDataProviderFactory<IBlockDataProvider> = {
        build: jest.fn().mockReturnValue(mockBlockDataProvider)
      };

      const mockStakeDataProvider: IStakeDataProvider = {
        getStakes: jest.fn().mockRejectedValue(new Error('Stake data error'))
      };

      const mockedStakeDataFactory: IDataProviderFactory<IStakeDataProvider> = {
        build: jest.fn().mockReturnValue(mockStakeDataProvider)
      };

      const mockedPayoutCalculatorFactory: IPayoutCalculatorFactory<IPayoutCalculator> = {
        build: jest.fn().mockReturnValue({
          getPayouts: jest.fn().mockResolvedValue([[], [], [], 0, 0, 0])
        })
      };

      const builder = new PaymentBuilder(
        mockedBlockProcessor,
        mockedPayoutCalculatorFactory,
        mockedBlockDataFactory,
        mockedStakeDataFactory,
        mockConfig
      );

      await expect(builder.build()).rejects.toThrow('Stake data error');
      expect(mockStakeDataProvider.getStakes).toHaveBeenCalledTimes(1);
    });
  });

  describe('When payout calculator fails', () => {
    it('should propagate the error', async () => {
      const mockedBlockProcessor: IBlockProcessor = { 
        determineLastBlockHeightToProcess: jest.fn().mockResolvedValue(1000)
      };

      const mockBlockDataProvider: IBlockDataProvider = {
        getBlocks: jest.fn().mockResolvedValue([
          MockFactory.createBlock({ stakingledgerhash: 'ledger-hash-123' })
        ]),
        getLatestHeight: jest.fn().mockResolvedValue(1100),
        getMinMaxBlocksByEpoch: jest.fn()
      };

      const mockedBlockDataFactory: IDataProviderFactory<IBlockDataProvider> = {
        build: jest.fn().mockReturnValue(mockBlockDataProvider)
      };

      const mockStakeDataProvider: IStakeDataProvider = {
        getStakes: jest.fn().mockResolvedValue({
          stakes: [MockFactory.createStake()],
          totalStakingBalance: 100000000000
        })
      };

      const mockedStakeDataFactory: IDataProviderFactory<IStakeDataProvider> = {
        build: jest.fn().mockReturnValue(mockStakeDataProvider)
      };

      const mockPayoutCalculator: IPayoutCalculator = {
        getPayouts: jest.fn().mockRejectedValue(new Error('Payout calculator error'))
      };

      const mockedPayoutCalculatorFactory: IPayoutCalculatorFactory<IPayoutCalculator> = {
        build: jest.fn().mockReturnValue(mockPayoutCalculator)
      };

      const builder = new PaymentBuilder(
        mockedBlockProcessor,
        mockedPayoutCalculatorFactory,
        mockedBlockDataFactory,
        mockedStakeDataFactory,
        mockConfig
      );

      await expect(builder.build()).rejects.toThrow('Payout calculator error');
      expect(mockPayoutCalculator.getPayouts).toHaveBeenCalledTimes(1);
    });
  });

  describe('When multiple ledger hashes exist', () => {
    it('should process each ledger hash separately', async () => {
      const mockedBlockProcessor: IBlockProcessor = { 
        determineLastBlockHeightToProcess: jest.fn().mockResolvedValue(1000)
      };

      const blocks = [
        MockFactory.createBlock({ 
          blockheight: 995, 
          stakingledgerhash: 'ledger-hash-1',
          winnerpublickey: 'B62qWinner1'
        }),
        MockFactory.createBlock({ 
          blockheight: 996, 
          stakingledgerhash: 'ledger-hash-1',
          winnerpublickey: 'B62qWinner1'
        }),
        MockFactory.createBlock({ 
          blockheight: 997, 
          stakingledgerhash: 'ledger-hash-2',
          winnerpublickey: 'B62qWinner2'
        }),
        MockFactory.createBlock({ 
          blockheight: 998, 
          stakingledgerhash: 'ledger-hash-2',
          winnerpublickey: 'B62qWinner2'
        })
      ];

      const mockBlockDataProvider: IBlockDataProvider = {
        getBlocks: jest.fn().mockResolvedValue(blocks),
        getLatestHeight: jest.fn().mockResolvedValue(1100),
        getMinMaxBlocksByEpoch: jest.fn()
      };

      const mockedBlockDataFactory: IDataProviderFactory<IBlockDataProvider> = {
        build: jest.fn().mockReturnValue(mockBlockDataProvider)
      };

      const mockStakeDataProvider: IStakeDataProvider = {
        getStakes: jest.fn()
          .mockImplementation((ledgerHash) => {
            if (ledgerHash === 'ledger-hash-1') {
              return Promise.resolve({
                stakes: [MockFactory.createStake({ publicKey: 'B62qWinner1' })],
                totalStakingBalance: 100000000000
              });
            } else {
              return Promise.resolve({
                stakes: [MockFactory.createStake({ publicKey: 'B62qWinner2' })],
                totalStakingBalance: 200000000000
              });
            }
          })
      };

      const mockedStakeDataFactory: IDataProviderFactory<IStakeDataProvider> = {
        build: jest.fn().mockReturnValue(mockStakeDataProvider)
      };

      const getPayoutsMock = jest.fn().mockResolvedValue([[], [], [], 0, 0, 0]);
      const mockPayoutCalculator: IPayoutCalculator = {
        getPayouts: getPayoutsMock
      };

      const mockedPayoutCalculatorFactory: IPayoutCalculatorFactory<IPayoutCalculator> = {
        build: jest.fn().mockReturnValue(mockPayoutCalculator)
      };

      const builder = new PaymentBuilder(
        mockedBlockProcessor,
        mockedPayoutCalculatorFactory,
        mockedBlockDataFactory,
        mockedStakeDataFactory,
        mockConfig
      );

      await builder.build();

      expect(mockStakeDataProvider.getStakes).toHaveBeenCalledTimes(2);
      expect(mockStakeDataProvider.getStakes).toHaveBeenCalledWith('ledger-hash-1', mockConfig.stakingPoolPublicKey);
      expect(mockStakeDataProvider.getStakes).toHaveBeenCalledWith('ledger-hash-2', mockConfig.stakingPoolPublicKey);

      expect(getPayoutsMock).toHaveBeenCalledTimes(2);
      
      const firstCallBlocks = getPayoutsMock.mock.calls[0][0];
      expect(firstCallBlocks.length).toBe(2);
      expect(firstCallBlocks[0].stakingledgerhash).toBe('ledger-hash-1');
      expect(firstCallBlocks[1].stakingledgerhash).toBe('ledger-hash-1');
      
      const secondCallBlocks = getPayoutsMock.mock.calls[1][0];
      expect(secondCallBlocks.length).toBe(2);
      expect(secondCallBlocks[0].stakingledgerhash).toBe('ledger-hash-2');
      expect(secondCallBlocks[1].stakingledgerhash).toBe('ledger-hash-2');
    });
  });
});
