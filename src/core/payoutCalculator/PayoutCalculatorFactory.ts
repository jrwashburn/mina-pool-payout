import { injectable } from 'inversify';
import { PayoutCalculatorIsolateSuperCharge } from './PayoutCalculatorIsolateSuperCharge';
import { PayoutCalculatorPostSuperCharge } from './PayoutCalculatorPostSuperCharge';
import { IPayoutCalculatorFactory, IPayoutCalculator } from './Model';

@injectable()
export class PayoutCalculatorFactory implements IPayoutCalculatorFactory<IPayoutCalculator> {
  build(fork: number): IPayoutCalculator {
    if (fork == 0) {
      return new PayoutCalculatorIsolateSuperCharge();
    } else if (fork == 1) {
      return new PayoutCalculatorPostSuperCharge();
    } else {
      throw new Error(`Invalid fork value ${fork} not sure which calculator to use.`);
    }
  }
}
