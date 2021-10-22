import { IFileWriter } from '../../../shared/Model';
import { Block } from '../../dataProvider/dataprovider-types';
import { PaymentProcess } from '../Model';
import { PaymentSummarizer } from '../PaymentSummarizer';

describe('Payment Summarizer tests', () => {
    describe('should be succesful', () => {
        it('when payment process is finished', () => {

            const mockFileWriter: IFileWriter = {
                write: (filename, obj) => {
                    return new Promise(() => {})
                }
            };

            const summarizer = new PaymentSummarizer(mockFileWriter);

            const mockedBlocks: Block[] = [
                {
                    blockdatetime: 213456789,
                    blockheight: 10,
                    coinbase: 10,
                    creatorpublickey: '123645789',
                    feetransferfromcoinbase: 10,
                    feetransfertoreceiver: 1,
                    globalslotsincegenesis: 1,
                    receiverpublickey: '123445676',
                    slot: 1,
                    stakingledgerhash: 'da622bbdea9ab2c632385a78791b202a',
                    statehash: '0062aca83e3d7027cd77cfe03e0fe7d9',
                    usercommandtransactionfees: 10,
                    winnerpublickey: '123645789',
                },
                {
                    blockdatetime: 213456781,
                    blockheight: 11,
                    coinbase: 10,
                    creatorpublickey: '123645782',
                    feetransferfromcoinbase: 10,
                    feetransfertoreceiver: 1,
                    globalslotsincegenesis: 1,
                    receiverpublickey: '123445672',
                    slot: 1,
                    stakingledgerhash: 'da622bbdea9ab2c632385a78791b202a',
                    statehash: '0062aca83e3d7027cd77cfe03e0fe7d9',
                    usercommandtransactionfees: 10,
                    winnerpublickey: '123645789',
                },
            ];

            const process: PaymentProcess = {
                blocks: mockedBlocks,
                maximumHeight: 1,
                payouts: [],
                payoutsBeforeExclusions: [],
                storePayout: [],
                totalPayoutFundsNeeded: 0,
                totals: {
                    coinBaseSum: 720,
                    feeTransferFromCoinBaseSum: 2.823,
                    netCoinBaseReceived: 0,
                    netMinaToPoolOperator: 722,
                    payoutAmountsSum: 686,
                    payoutFeesSum: 0.08,
                    userCommandTransactionFeeSum: 36,
                },
            };

            return summarizer.calculateTotals(process).then((result) => {
                expect(result).toStrictEqual(process);
            });
        });
    });
});
