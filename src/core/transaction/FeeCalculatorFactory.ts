import { inject, injectable } from 'inversify';
import { IFeeCalculatorFactory } from '../payoutCalculator/Model';
import { FeeCalculator } from './FeeCalculator';
import { IFeeCalculator } from './Model';

@injectable()
export class FeeCalculatorFactory implements IFeeCalculatorFactory {
    create(): IFeeCalculator {
        return new FeeCalculator()
    }
    
}