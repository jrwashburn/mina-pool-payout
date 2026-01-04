import { PayoutTransaction } from '../payoutCalculator/Model.js';
import { ISubstituteAndExcludePayToAddresses } from './Model.js';
import fs from 'node:fs';
import { parse } from 'csv-parse';
import { injectable } from 'inversify';
import path from 'node:path'

@injectable()
export class SubstituteAndExcludePayToAddresses implements ISubstituteAndExcludePayToAddresses {
  async run(transactions: PayoutTransaction[]): Promise<PayoutTransaction[]> {
    // load susbtitutes from file
    // expects format:
    //  B62... | B62...
    //  B62... | EXCLUDE
    // remove excluded addresses
    // swap mapped addresses

    const substitutePayToFile = path.join('src', 'data', '.substitutePayTo');
    const filterPayouts = () => {
      return new Promise((resolve, reject) => {
        fs.createReadStream(substitutePayToFile)
          .pipe(parse({ delimiter: '|', relax_column_count: true }))
          .on('data', (record) => {
            transactions = transactions
              .filter((transaction) => !(transaction.publicKey == record[0] && record[1] == 'EXCLUDE'))
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
                  summaryGroup: 0,
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
    if (fs.existsSync(substitutePayToFile)) {
      await filterPayouts();
    }
    return transactions;
  }
}
