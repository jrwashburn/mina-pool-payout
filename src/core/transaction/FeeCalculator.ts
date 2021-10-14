import { inject, injectable } from 'inversify';
import { IFeeCalculator } from './Model';
import { PayoutTransaction } from '../payoutCalculator/Model';
import { ConfigurationManager } from '../../configuration/ConfigurationManager';
@injectable()
export class FeeCalculator implements IFeeCalculator {
    async calculate(transaction: PayoutTransaction): Promise<void> {
        const config  = ConfigurationManager.Setup
        const replacementFee = config.payorSpecificTransactionFees

        if (config.usepayorSpecificTransactionFees && replacementFee[transaction.publicKey]) {
            
            transaction.fee = replacementFee[transaction.publicKey].fee

            console.log(`Using Fee specific for: ${transaction.publicKey}`)
        
        } else {
            
            transaction.fee = config.payorSendTransactionFee
        }

        transaction.amountMina = transaction.amount / 1000000000;
        transaction.feeMina = transaction.fee / 1000000000;
    }
    
}