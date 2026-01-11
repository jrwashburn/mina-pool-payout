import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MinaAddresses } from '../data/mina-addresses/minaAddressShareClass.js';
import { Stake, LedgerEntry, Block, ShareClass } from '../core/dataProvider/dataprovider-types.js';

export function stakeIsLocked(stake: Stake, block: Block) {
  return stake.untimedAfterSlot && stake.untimedAfterSlot > block.globalslotsincegenesis;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const addressesDir = path.join(__dirname, '..', 'data', 'mina-addresses');
const burnAddressesFile = path.join(__dirname, '..', 'data', '.burnSupercharged');
let minaAddressesPromise: Promise<MinaAddresses> | null = null;
let burnAddressesPromise: Promise<Set<string>> | null = null;

async function getMinaAddresses(): Promise<MinaAddresses> {
  if (!minaAddressesPromise) {
    if (!fs.existsSync(addressesDir)) {
      throw new Error(
        `Missing mina-addresses submodule data at ${addressesDir}. Run "git submodule update --init --recursive".`
      );
    }
    minaAddressesPromise = MinaAddresses.create(addressesDir);
  }
  return minaAddressesPromise;
}

async function getBurnAddresses(): Promise<Set<string>> {
  if (!burnAddressesPromise) {
    burnAddressesPromise = (async () => {
      if (!fs.existsSync(burnAddressesFile)) {
        return new Set();
      }
      const content = await fs.promises.readFile(burnAddressesFile, 'utf8');
      return new Set(
        content
          .split(/\r?\n/)
          .map((address) => address.trim())
          .filter((address) => address.length > 0)
      );
    })();
  }
  return burnAddressesPromise;
}

export async function getPublicKeyShareClass(key: string): Promise<ShareClass> {
  const minaAddresses = await getMinaAddresses();
  const shareClass = await minaAddresses.getPublicKeyShareClass(key);
  if (shareClass.shareClass !== 'Common') {
    return shareClass;
  }

  const burnAddresses = await getBurnAddresses();
  if (burnAddresses.has(key)) {
    return { shareClass: 'NPS', shareOwner: 'BURN' };
  }

  return shareClass;
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
