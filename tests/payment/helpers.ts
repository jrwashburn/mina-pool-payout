import { KeyedRate } from '../../src/configuration/Model.js';
import { Block, ShareClass, Stake } from '../../src/core/dataProvider/dataprovider-types.js';
import { PayoutTransaction } from '../../src/core/payoutCalculator/Model.js';

export const MINA = 1_000_000_000;
export const DEFAULT_MEMO = 'pool-memo';
export const DEFAULT_BP_HASH = 'bp-hash';

type ShareOwner = '' | 'MF' | 'O1' | 'INVEST' | 'BURN';

type StakeBuilderOptions = {
  publicKey: string;
  balance: number;
  shareClass?: ShareClass['shareClass'];
  shareOwner?: ShareOwner;
  locked?: boolean;
  untimedAfterSlot?: number;
  total?: number;
};

export const noRates: KeyedRate = Object.freeze({}) as KeyedRate;

export const defaultBurnAddress = 'B62qiburnzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzmp7r7UN6X';

export function buildBlock(overrides: Partial<Block> = {}): Block {
  return {
    blockheight: 1,
    blockdatetime: 0,
    coinbase: 720 * MINA,
    creatorpublickey: 'POOL',
    feetransferfromcoinbase: 0,
    feetransfertoreceiver: 0,
    globalslotsincegenesis: 1,
    receiverpublickey: 'POOL',
    slot: 1,
    stakingledgerhash: 'ledger',
    statehash: 'state',
    usercommandtransactionfees: 0,
    winnerpublickey: 'POOL',
    ...overrides,
  };
}

export function buildStake({
  publicKey,
  balance,
  shareClass = 'Common',
  shareOwner = '',
  locked = false,
  untimedAfterSlot,
  total = 0,
}: StakeBuilderOptions): Stake {
  const resolvedUntimedSlot = typeof untimedAfterSlot === 'number' ? untimedAfterSlot : locked ? 999_999 : 0;

  return {
    publicKey,
    total,
    stakingBalance: balance,
    untimedAfterSlot: resolvedUntimedSlot,
    shareClass: { shareClass, shareOwner },
    totalToBurn: 0,
  };
}

export function cloneStakes(stakes: Stake[]): Stake[] {
  return stakes.map((stake) => ({
    ...stake,
    shareClass: { ...stake.shareClass },
  }));
}

export function summarizeTransactions(transactions: PayoutTransaction[]) {
  return transactions.map(({ publicKey, amount, fee, memo }) => ({ publicKey, amount, fee, memo }));
}

export function sortTransactionsByAmount(transactions: PayoutTransaction[]): PayoutTransaction[] {
  return [...transactions].sort((a, b) => {
    if (a.amount === b.amount) {
      return a.publicKey.localeCompare(b.publicKey);
    }
    return b.amount - a.amount;
  });
}
