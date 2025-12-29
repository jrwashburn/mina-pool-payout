import { injectable } from 'inversify';
import { PayoutCalculator } from './PayoutCalculator.js';
import { PayoutCalculatorIsolateSuperCharge } from './PayoutCalculatorIsolateSuperCharge.js';
import { PayoutCalculatorPostSuperChargeShareFees } from './PayoutCalculatorPostSuperChargeShareFees.js';
import { PayoutCalculatorPostSuperChargeCommonShareFees } from './PayoutCalculatorPostSuperChargeCommonShareFees.js';
import { PayoutCalculatorPostSuperChargeKeepFees } from './PayoutCalculatorPostSuperChargeKeepFees.js';
import { IPayoutCalculatorFactory, IPayoutCalculator } from './Model.js';

//valid payoutCalculator Values: ['postSuperChargeShareFees', 'postSuperChargeKeepFees', 'postSuperChargeCommonShareFees', 'isolateSuperCharge', 'original']
@injectable()
export class PayoutCalculatorFactory implements IPayoutCalculatorFactory<IPayoutCalculator> {
  build(fork: number, payoutCalculator: string): IPayoutCalculator {
    if (fork == 0) {
      if (payoutCalculator === 'isolateSuperCharge') {
        return new PayoutCalculatorIsolateSuperCharge();
      }
      if (payoutCalculator === 'original') {
        return new PayoutCalculator();
      }
      throw new Error('Invalid payoutCalculator specified for fork 0');
    } else if (fork == 1 || fork == 2) {
      if (payoutCalculator === 'postSuperChargeKeepFees') {
        return new PayoutCalculatorPostSuperChargeKeepFees(fork);
      }
      if (payoutCalculator === 'postSuperChargeShareFees') {
        return new PayoutCalculatorPostSuperChargeShareFees(fork);
      }
      if (payoutCalculator === 'postSuperChargeCommonShareFees') {
        return new PayoutCalculatorPostSuperChargeCommonShareFees(fork);
      }
      throw new Error(`Invalid payoutCalculator specified for fork ${fork}`);
    } else {
      throw new Error(`Invalid fork value ${fork} not sure which calculator to use.`);
    }
  }
}
