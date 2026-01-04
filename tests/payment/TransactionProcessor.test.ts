import 'reflect-metadata';
import { TransactionProcessor } from '../../src/core/transaction/TransactionProcessor';
import { IFileWriter } from '../../src/shared/Model';
import { PaymentConfiguration } from '../../src/configuration/Model';
import { PaymentProcess } from '../../src/core/payment/Model';
import fs from 'fs';
import path from 'path';

const makeConfig = (minimumHeight: number = 100, useLegacyJsonFormat: boolean = false): PaymentConfiguration => ({
  blockDataSource: '',
  bpKeyMd5Hash: '',
  burnAddress: '',
  burnRatesByPublicKey: {},
  commissionRatesByPublicKey: {},
  configuredMaximum: 0,
  defaultCommissionRate: 0,
  doNotTransmit: false,
  doNotSaveTransactionDetails: false,
  epoch: 0,
  fork: 0,
  investorsCommissionRate: 0,
  mfCommissionRate: 0,
  minimumConfirmations: 0,
  minimumHeight: minimumHeight,
  o1CommissionRate: 0,
  payoutHash: '',
  payoutMemo: 'memo',
  payorSendTransactionFee: 1_000_000,
  payoutThreshold: 0,
  senderKeys: { privateKey: '', publicKey: '' },
  slotsInEpoch: 0,
  stakingPoolPublicKey: '',
  verbose: false,
  payoutCalculator: 'original',
  useLegacyJsonFormat: useLegacyJsonFormat,
});

const makePaymentProcess = (maximumHeight: number = 200): PaymentProcess => ({
  blocks: [],
  maximumHeight: maximumHeight,
  payoutTransactions: [
    { publicKey: 'B62alice', amount: 1000000000, fee: 1000000, amountMina: 1, feeMina: 0.001, memo: 'test1', summaryGroup: 0 },
    { publicKey: 'B62bob', amount: 2000000000, fee: 1000000, amountMina: 2, feeMina: 0.001, memo: 'test2', summaryGroup: 1 },
    { publicKey: 'B62charlie', amount: 3000000000, fee: 1000000, amountMina: 3, feeMina: 0.001, memo: 'test3', summaryGroup: 2 },
  ],
  payoutDetails: [],
  totalPayoutFundsNeeded: 6000000000,
  payoutsBeforeExclusions: [],
  totalPayouts: 6000000000,
  totalBurn: 0,
});

describe('TransactionProcessor', () => {
  let outputFiles: string[] = [];

  afterEach(() => {
    // Clean up any files created during tests
    outputFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
    outputFiles = [];
  });

  it('writes payout_transactions as valid JSON array', async () => {
    const fileWriter: IFileWriter = {
      write: jest.fn(),
    };
    const processor = new TransactionProcessor(fileWriter);
    const config = makeConfig(1000);
    const paymentProcess = makePaymentProcess(1100);

    await processor.write(config, paymentProcess);

    // Wait a bit for file to be written
    await new Promise(resolve => setTimeout(resolve, 100));

    // Find the created file
    const dataDir = path.join(__dirname, '../../src/data');
    const files = fs.readdirSync(dataDir);
    const transactionFile = files.find(f => f.startsWith('payout_transactions_') && f.includes('_1000_1100.json'));
    
    expect(transactionFile).toBeDefined();
    
    if (transactionFile) {
      const filePath = path.join(dataDir, transactionFile);
      outputFiles.push(filePath);
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Should be valid JSON
      let parsedData;
      expect(() => {
        parsedData = JSON.parse(fileContent);
      }).not.toThrow();
      
      // Should be an array
      expect(Array.isArray(parsedData)).toBe(true);
      
      // Should have the expected number of elements
      expect(parsedData).toHaveLength(3);
      
      // Should have the expected data
      if (parsedData) {
        expect(parsedData[0]).toMatchObject({
          publicKey: 'B62alice',
          amount: 1000000000,
          fee: 1000000,
          amountMina: 1,
          feeMina: 0.001,
          memo: 'test1',
          summaryGroup: 0,
        });
        
        expect(parsedData[1]).toMatchObject({
          publicKey: 'B62bob',
          amount: 2000000000,
          fee: 1000000,
          amountMina: 2,
          feeMina: 0.001,
          memo: 'test2',
          summaryGroup: 1,
        });
        
        expect(parsedData[2]).toMatchObject({
          publicKey: 'B62charlie',
          amount: 3000000000,
          fee: 1000000,
          amountMina: 3,
          feeMina: 0.001,
          memo: 'test3',
          summaryGroup: 2,
        });
      }
    }
  });

  it('writes payout_details as valid JSON array when not disabled', async () => {
    const fileWriter: IFileWriter = {
      write: jest.fn(),
    };
    const processor = new TransactionProcessor(fileWriter);
    const config = makeConfig(2000);
    const paymentProcess = makePaymentProcess(2100);
    paymentProcess.payoutDetails = [
      {
        publicKey: 'B62alice',
        owner: 'alice',
        blockHeight: 100,
        globalSlot: 1000,
        publicKeyUntimedAfter: 0,
        winnerShareOwner: 'alice',
        shareClass: { shareClass: 'Common', shareOwner: '' },
        stateHash: 'state1',
        effectiveNPSPoolWeighting: 1,
        effectiveNPSPoolStakes: 100,
        effectiveCommonPoolWeighting: 1,
        effectiveCommonPoolStakes: 100,
        effectiveSuperchargedPoolWeighting: 0,
        effectiveSuperchargedPoolStakes: 0,
        stakingBalance: 100,
        sumEffectiveNPSPoolStakes: 100,
        sumEffectiveCommonPoolStakes: 100,
        sumEffectiveSuperchargedPoolStakes: 0,
        superchargedWeightingDiscount: 0,
        dateTime: 1000000,
        coinbase: 720000000000,
        totalRewards: 720000000000,
        totalRewardsToBurn: 0,
        totalRewardsNPSPool: 0,
        totalRewardsCommonPool: 720000000000,
        totalRewardsSuperchargedPool: 0,
        payout: 100000000,
        isEffectiveSuperCharge: false,
      },
      {
        publicKey: 'B62bob',
        owner: 'bob',
        blockHeight: 101,
        globalSlot: 1001,
        publicKeyUntimedAfter: 0,
        winnerShareOwner: 'bob',
        shareClass: { shareClass: 'Common', shareOwner: '' },
        stateHash: 'state2',
        effectiveNPSPoolWeighting: 1,
        effectiveNPSPoolStakes: 200,
        effectiveCommonPoolWeighting: 1,
        effectiveCommonPoolStakes: 200,
        effectiveSuperchargedPoolWeighting: 0,
        effectiveSuperchargedPoolStakes: 0,
        stakingBalance: 200,
        sumEffectiveNPSPoolStakes: 200,
        sumEffectiveCommonPoolStakes: 200,
        sumEffectiveSuperchargedPoolStakes: 0,
        superchargedWeightingDiscount: 0,
        dateTime: 1000001,
        coinbase: 720000000000,
        totalRewards: 720000000000,
        totalRewardsToBurn: 0,
        totalRewardsNPSPool: 0,
        totalRewardsCommonPool: 720000000000,
        totalRewardsSuperchargedPool: 0,
        payout: 200000000,
        isEffectiveSuperCharge: false,
      },
    ];

    await processor.write(config, paymentProcess);

    // Wait a bit for file to be written
    await new Promise(resolve => setTimeout(resolve, 100));

    // Find the created file
    const dataDir = path.join(__dirname, '../../src/data');
    const files = fs.readdirSync(dataDir);
    const detailsFile = files.find(f => f.startsWith('payout_details_') && f.includes('_2000_2100.json'));
    
    expect(detailsFile).toBeDefined();
    
    if (detailsFile) {
      const filePath = path.join(dataDir, detailsFile);
      outputFiles.push(filePath);
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Should be valid JSON
      let parsedData;
      expect(() => {
        parsedData = JSON.parse(fileContent);
      }).not.toThrow();
      
      // Should be an array
      expect(Array.isArray(parsedData)).toBe(true);
      
      // Should have the expected number of elements
      expect(parsedData).toHaveLength(2);
    }
  });

  it('handles empty transaction array', async () => {
    const fileWriter: IFileWriter = {
      write: jest.fn(),
    };
    const processor = new TransactionProcessor(fileWriter);
    const config = makeConfig(3000);
    const paymentProcess = makePaymentProcess(3100);
    paymentProcess.payoutTransactions = [];

    await processor.write(config, paymentProcess);

    // Wait a bit for file to be written
    await new Promise(resolve => setTimeout(resolve, 100));

    // Find the created file
    const dataDir = path.join(__dirname, '../../src/data');
    const files = fs.readdirSync(dataDir);
    const transactionFile = files.find(f => f.startsWith('payout_transactions_') && f.includes('_3000_3100.json'));
    
    expect(transactionFile).toBeDefined();
    
    if (transactionFile) {
      const filePath = path.join(dataDir, transactionFile);
      outputFiles.push(filePath);
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Should be valid JSON
      let parsedData;
      expect(() => {
        parsedData = JSON.parse(fileContent);
      }).not.toThrow();
      
      // Should be an empty array
      expect(Array.isArray(parsedData)).toBe(true);
      expect(parsedData).toHaveLength(0);
    }
  });

  it('writes payout_transactions in legacy format when flag is set', async () => {
    const fileWriter: IFileWriter = {
      write: jest.fn(),
    };
    const processor = new TransactionProcessor(fileWriter);
    const config = makeConfig(4000, true); // Enable legacy format
    const paymentProcess = makePaymentProcess(4100);

    await processor.write(config, paymentProcess);

    // Wait a bit for file to be written
    await new Promise(resolve => setTimeout(resolve, 100));

    // Find the created file
    const dataDir = path.join(__dirname, '../../src/data');
    const files = fs.readdirSync(dataDir);
    const transactionFile = files.find(f => f.startsWith('payout_transactions_') && f.includes('_4000_4100.json'));
    
    expect(transactionFile).toBeDefined();
    
    if (transactionFile) {
      const filePath = path.join(dataDir, transactionFile);
      outputFiles.push(filePath);
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Legacy format: concatenated JSON objects without array brackets
      // Should NOT be valid as a single JSON parse
      expect(() => {
        JSON.parse(fileContent);
      }).toThrow();
      
      // Should contain multiple objects concatenated
      expect(fileContent).toContain('{"publicKey":"B62alice"');
      expect(fileContent).toContain('{"publicKey":"B62bob"');
      expect(fileContent).toContain('{"publicKey":"B62charlie"');
      
      // Should NOT have array brackets or commas between objects
      expect(fileContent.startsWith('[')).toBe(false);
      expect(fileContent.endsWith(']')).toBe(false);
    }
  });

  it('writes payout_details in legacy format when flag is set', async () => {
    const fileWriter: IFileWriter = {
      write: jest.fn(),
    };
    const processor = new TransactionProcessor(fileWriter);
    const config = makeConfig(5000, true); // Enable legacy format
    const paymentProcess = makePaymentProcess(5100);
    paymentProcess.payoutDetails = [
      {
        publicKey: 'B62alice',
        owner: 'alice',
        blockHeight: 100,
        globalSlot: 1000,
        publicKeyUntimedAfter: 0,
        winnerShareOwner: 'alice',
        shareClass: { shareClass: 'Common', shareOwner: '' },
        stateHash: 'state1',
        effectiveNPSPoolWeighting: 1,
        effectiveNPSPoolStakes: 100,
        effectiveCommonPoolWeighting: 1,
        effectiveCommonPoolStakes: 100,
        effectiveSuperchargedPoolWeighting: 0,
        effectiveSuperchargedPoolStakes: 0,
        stakingBalance: 100,
        sumEffectiveNPSPoolStakes: 100,
        sumEffectiveCommonPoolStakes: 100,
        sumEffectiveSuperchargedPoolStakes: 0,
        superchargedWeightingDiscount: 0,
        dateTime: 1000000,
        coinbase: 720000000000,
        totalRewards: 720000000000,
        totalRewardsToBurn: 0,
        totalRewardsNPSPool: 0,
        totalRewardsCommonPool: 720000000000,
        totalRewardsSuperchargedPool: 0,
        payout: 100000000,
        isEffectiveSuperCharge: false,
      },
    ];

    await processor.write(config, paymentProcess);

    // Wait a bit for file to be written
    await new Promise(resolve => setTimeout(resolve, 100));

    // Find the created file
    const dataDir = path.join(__dirname, '../../src/data');
    const files = fs.readdirSync(dataDir);
    const detailsFile = files.find(f => f.startsWith('payout_details_') && f.includes('_5000_5100.json'));
    
    expect(detailsFile).toBeDefined();
    
    if (detailsFile) {
      const filePath = path.join(dataDir, detailsFile);
      outputFiles.push(filePath);
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Legacy format: should NOT be valid as a single JSON parse (when multiple objects)
      // With just one object, it should parse, but shouldn't be an array
      const parsedData = JSON.parse(fileContent);
      expect(Array.isArray(parsedData)).toBe(false);
      expect(parsedData.publicKey).toBe('B62alice');
    }
  });
});
