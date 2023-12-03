import fs from 'fs';
import { Stake, LedgerEntry, Block, ShareClass } from '../core/dataProvider/dataprovider-types';

export function stakeIsLocked(stake: Stake, block: Block) {
    return stake.untimedAfterSlot && stake.untimedAfterSlot > block.globalslotsincegenesis;
}

export function getPublicKeyShareClass(key: string): ShareClass {
    const path = require('path');
    const foundationAddressesFile = path.join('src', 'data', 'nps-addresses', 'Mina_Foundation_Addresses.csv');
    const labsAddressesFile = path.join('src', 'data', 'nps-addresses', 'O1_Labs_Addresses.csv');
    const investorsAddressesFile = path.join('src', 'data', 'nps-addresses', 'Investors_Addresses.csv');
    const foundationAddresses = fs.readFileSync(foundationAddressesFile);
    const o1labsAddresses = fs.readFileSync(labsAddressesFile);
    const investorsAddresses = fs.readFileSync(investorsAddressesFile);

    if (foundationAddresses.includes(key)) {
        return { shareClass: 'NPS', shareOwner: 'MF' };
    } else if (o1labsAddresses.includes(key)) {
        return { shareClass: 'NPS', shareOwner: 'O1' };
    } else if (investorsAddresses.includes(key)) {
        return { shareClass: 'NPS', shareOwner: 'INVEST' };
    } else return { shareClass: 'Common', shareOwner: '' };
}

// Changed from original implementation to simply return the slot number at which account beomes untimed
export function calculateUntimedSlot(ledgerEntry: LedgerEntry): number {
    // account is not locked if there is no timing section at all
    if (!ledgerEntry.timing) {
        // Untimed for full epoch so we have the maximum weighting of 1
        return 0;
    } else {
        const vestingPeriod = Number(ledgerEntry.timing.vesting_period);
        const vestingIncrement = Number(ledgerEntry.timing.vesting_increment);
        const cliffTime = Number(ledgerEntry.timing.cliff_time);
        const cliffAmount = Number(ledgerEntry.timing.cliff_amount);
        const initialMinimumBalance = Number(ledgerEntry.timing.initial_minimum_balance);

        if (vestingIncrement === 0) {
            // if vestingIncrement is zero, account may never unlock
            if (cliffAmount === initialMinimumBalance) {
                return cliffTime;
            } else {
                throw new Error('Timed Account with no increment - unsure how to handle');
            }
        } else {
            return ((initialMinimumBalance - cliffAmount) / vestingIncrement) * vestingPeriod + cliffTime;
        }
    }
}
