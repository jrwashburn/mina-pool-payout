import type { ShareClass } from '../../data/mina-addresses/minaAddressShareClass.js';

export type Block = {
    blockheight: number;
    statehash: string;
    stakingledgerhash: string;
    blockdatetime: number;
    slot: number;
    globalslotsincegenesis: number;
    creatorpublickey: string;
    winnerpublickey: string;
    receiverpublickey: string;
    coinbase: number;
    feetransfertoreceiver: number;
    feetransferfromcoinbase: number;
    usercommandtransactionfees: number;
};

export type Blocks = Array<Block>;

export type Ledger = {
    stakes: Stake[];
    totalStakingBalance: number;
};

export type Stake = {
    publicKey: string;
    total: number;
    stakingBalance: number;
    untimedAfterSlot: number;
    shareClass: ShareClass;
    totalToBurn: number;
};

//TODO: Add remaining field definitions as needed
export type LedgerEntry = {
    pk: string;
    balance: number;
    delegate: string;
    timing: {
        initial_minimum_balance: number;
        cliff_time: number;
        cliff_amount: number;
        vesting_period: number;
        vesting_increment: number;
    };
};

export type { ShareClass };
