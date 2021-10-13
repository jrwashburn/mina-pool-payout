import { inject, injectable } from 'inversify';
import { PaymentConfiguration } from '../../configuration/Model';
import { IFeeCalculator } from '../transaction/Model';
import { PayoutTransaction } from './Model';

export class FeeCalculator implements IFeeCalculator {
    async calculate(transaction: PayoutTransaction, config: PaymentConfiguration): Promise<void> {
        
        //const replacementFee = config.payorSpecificTransactionFees[]
        transaction.fee = config.payorSendTransactionFee;
        transaction.amountMina = transaction.amount / 1000000000;
        transaction.feeMina = transaction.fee / 1000000000;
    }
    
}