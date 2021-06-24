import { LedgerEntry } from '../Core/DataProvider/dataprovider-types'
import { calculateUntimedSlot } from '../Utils/staking-ledger-util'

describe('Should be succesful calculating untimed slot', () => {
    it('when ledger is valid', () => {
        const ledgerMock: LedgerEntry = {
            balance: 0, 
            delegate: '', 
            pk: '', 
            timing: {
                cliff_amount:0,
                cliff_time:0,
                initial_minimum_balance:0,
                vesting_increment:0,
                vesting_period:0
        }}

        const result = calculateUntimedSlot(ledgerMock)

        expect(0).toStrictEqual(result)

    })
})