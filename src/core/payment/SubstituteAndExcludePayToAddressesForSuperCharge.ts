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

        const knownSubstitutePayToFile = path.join('src', 'data', 'mfSubstitutePayTo');
        const substitutePayToFile = path.join('src', 'data', '.substitutePayTo');

        const filterPayouts = (filterFile: any) => {
            return new Promise((resolve, reject) => {
                fs.createReadStream(filterFile)
                    .pipe(parse({ delimiter: '|' }))
                    .on('data', (record) => {
                        transactions = transactions
                            .filter(
                                (transaction) =>
                                    !(transaction.publicKey == record[0] && record[1] == 'EXCLUDE') &&
                                    !(transaction.amount <= payoutThreshold),
                            )
                            .map((t) => {
                                if (t.publicKey == record[0]) t.publicKey = record[1];
                                return t;
                            });
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });
        };
        
        if (fs.existsSync(knownSubstitutePayToFile)) {
            await filterPayouts(knownSubstitutePayToFile);
        }

        if (fs.existsSync(substitutePayToFile)) {
            await filterPayouts(substitutePayToFile);
        }
        
        return transactions;
    }
}
