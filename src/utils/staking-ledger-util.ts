import fs from 'fs'
import { Stake, LedgerEntry, Block } from '../core/dataProvider/dataprovider-types'

export function stakeIsLocked (stake: Stake, block: Block) {
  return stake.untimedAfterSlot && stake.untimedAfterSlot > block.globalslotsincegenesis
}

export function getPublicKeyShareClass (key: string) {
  const path = require('path')
  const foundationAddressesFile = path.join('src', 'data', 'nps-addresses', 'Mina_Foundation_Addresses.csv')
  const labsAddressesFile = path.join('src', 'data', 'nps-addresses', 'O1_Labs_addresses.csv')
  const foundationAddresses = fs.readFileSync(foundationAddressesFile)
  const o1labsAddresses = fs.readFileSync(labsAddressesFile)

  if (foundationAddresses.includes(key) || o1labsAddresses.includes(key)) {
    return 'NPS'
  } else {
    return 'Common'
  }
}

// Changed from original implementation to simply return the slot number at which account beomes untimed
export function calculateUntimedSlot (ledgerEntry: LedgerEntry): number {
  // account is not locked if there is no timing section at all
  if (!ledgerEntry.timing) {
    // Untimed for full epoch so we have the maximum weighting of 1
    return 0
  } else {
    const vestingPeriod: number = Number(ledgerEntry.timing.vesting_period)
    const vestingIncrement: number = Number(ledgerEntry.timing.vesting_increment)
    const cliffTime: number = Number(ledgerEntry.timing.cliff_time)
    const cliffAmount: number = Number(ledgerEntry.timing.cliff_amount)
    const initialMinimumBalance: number = Number(ledgerEntry.timing.initial_minimum_balance)

    if (vestingIncrement === 0) {
      // if vestingIncrement is zero, account may never unlock
      if (cliffAmount === initialMinimumBalance) {
        return cliffTime
      } else {
        throw new Error('Timed Account with no increment - unsure how to handle')
      }
    } else {
      return ((((initialMinimumBalance - cliffAmount) / vestingIncrement) * vestingPeriod) + cliffTime)
    }
  }
}
