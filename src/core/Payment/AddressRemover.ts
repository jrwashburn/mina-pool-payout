import { PayoutTransaction } from "../PayoutCalculator/Model";
import { IAddressRemover } from "./Model";
import fs from "fs";
import parse from "csv-parse";
import { injectable } from "inversify";

@injectable()
export class AddressRemover implements IAddressRemover {
    async remove(transactions: PayoutTransaction[]): Promise<PayoutTransaction[]> {
          // load susbtitutes from file
  // expects format:
  //  B62... | B62...
  //  B62... | EXCLUDE
  // remove excluded addresses
  // swap mapped addresses
  const path = require("path");
  const substitutePayToFile = path.join("src", "data", ".substitutePayTo");
  const filterPayouts = () => {
    return new Promise((resolve, reject) => {
      fs.createReadStream(substitutePayToFile)
        .pipe(parse({ delimiter: "|" }))
        .on("data", (record) => {
          transactions = transactions
            .filter(
              (transaction) =>
                !(transaction.publicKey == record[0] && record[1] == "EXCLUDE")
            )
            .map((t) => {
              if (t.publicKey == record[0]) t.publicKey = record[1];
              return t;
            });
        })
        .on("end", resolve)
        .on("error", reject);
    });
  };
  if (fs.existsSync(substitutePayToFile)) {
    await filterPayouts();
  }
  return transactions;
    }

}