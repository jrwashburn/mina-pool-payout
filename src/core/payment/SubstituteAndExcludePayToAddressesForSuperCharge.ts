import { PayoutTransaction } from '../payoutCalculator/Model';
import { ISubstituteAndExcludePayToAddresses } from './Model';
import fs from 'fs';
import { parse } from 'csv-parse';
import { injectable } from 'inversify';
import { ConfigurationManager } from '../../configuration/ConfigurationManager';

@injectable()
export class SubstituteAndExcludePayToAddressesForSuperCharge implements ISubstituteAndExcludePayToAddresses {
    async run(transactions: PayoutTransaction[]): Promise<PayoutTransaction[]> {
        // load susbtitutes from file
        // expects format:
        //  B62... | B62...
        //  B62... | EXCLUDE
        // remove excluded addresses
        // swap mapped addresses
        const payoutThreshold = ConfigurationManager.Setup.payoutThreshold;

        //TODO: Find a different way to handle this without doing require in const
        const path = require('path');

        const mfSubstitutePayToFile = path.join('src', 'data', 'mfSubstitutePayTo');
        const substitutePayToFile = path.join('src', 'data', '.substitutePayTo');

        const filterPayouts = (filterFile: any) => {
            return new Promise((resolve, reject) => {
                fs.createReadStream(filterFile)
                    .pipe(parse({ delimiter: '|', relax_column_count: true }))
                    .on('data', (record) => {
                        transactions = transactions
                            .filter(
                                (transaction) =>
                                    !(transaction.publicKey == record[0] && record[1] == 'EXCLUDE') &&
                                    !(transaction.amount <= payoutThreshold),
                            )
                            .map((t) => {
                                if (t.publicKey == record[0] && record[1] != 'SPLIT') t.publicKey = record[1];
                                return t;
                            });
                        transactions = transactions.flatMap((t) => {
                            if (t.publicKey == record[0] && record[1] == 'SPLIT') {
                                const otherKey = record[2];
                                const splitPercent = parseFloat(record[3]);
                                const publicKeyAmount = Math.ceil(splitPercent * t.amount);
                                const publicKeyAmountMina = publicKeyAmount / 1000000000;
                                const otherKeyAmount = t.amount - publicKeyAmount;
                                const otherKeyAmountMina = otherKeyAmount / 1000000000;
                                t.amount = publicKeyAmount;
                                t.amountMina = publicKeyAmountMina;
                                const otherKeyTransaction: PayoutTransaction = {
                                    publicKey: otherKey,
                                    amount: otherKeyAmount,
                                    fee: t.fee,
                                    amountMina: otherKeyAmountMina,
                                    feeMina: t.feeMina,
                                    memo: t.memo,
                                };

                                return [t, otherKeyTransaction];
                            } else {
                                return [t];
                            }
                        });
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });
        };

        if (fs.existsSync(mfSubstitutePayToFile)) {
            await filterPayouts(mfSubstitutePayToFile);
        }

        if (fs.existsSync(substitutePayToFile)) {
            await filterPayouts(substitutePayToFile);
        }

        return transactions;
    }
}
