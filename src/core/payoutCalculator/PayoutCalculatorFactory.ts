import { injectable } from 'inversify';
import { PayoutCalculator } from './PayoutCalculator';
import { PayoutCalculatorIsolateSuperCharge } from './PayoutCalculatorIsolateSuperCharge';
import { PayoutCalculatorPostSuperChargeShareFees } from './PayoutCalculatorPostSuperChargeShareFees';
import { PayoutCalculatorPostSuperChargeCommonShareFees } from './PayoutCalculatorPostSuperChargeCommonShareFees';
import { PayoutCalculatorPostSuperChargeKeepFees } from './PayoutCalculatorPostSuperChargeKeepFees';
import { IPayoutCalculatorFactory, IPayoutCalculator } from './Model';

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
    } else if (fork == 1) {
      if (payoutCalculator === 'postSuperChargeKeepFees') {
        return new PayoutCalculatorPostSuperChargeKeepFees();
      }
      if (payoutCalculator === 'postSuperChargeShareFees') {
        return new PayoutCalculatorPostSuperChargeShareFees();
      }
      if (payoutCalculator === 'postSuperChargeCommonShareFees') {
        return new PayoutCalculatorPostSuperChargeCommonShareFees();
      }
      throw new Error('Invalid payoutCalculator specified for fork 1');
    } else {
      throw new Error(`Invalid fork value ${fork} not sure which calculator to use.`);
    }
  }
}
