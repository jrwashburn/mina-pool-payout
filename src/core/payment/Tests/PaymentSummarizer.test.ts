/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import { IFileWriter } from '../../../shared/Model';
import { Block } from '../../dataProvider/dataprovider-types';
import { PaymentProcess } from '../Model';
import { PaymentSummarizer } from '../PaymentSummarizer';

describe('Payment Summarizer tests', () => {
    describe('should be succesful', () => {
        it('when payment process is finished', async () => {
            const mockFileWriter: IFileWriter = {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                write: (filename, obj) => {
                    return new Promise(() => {});
                },
            };

            const summarizer = new PaymentSummarizer(mockFileWriter);

            const mockedBlocks: Block[] = [
                {
                    blockdatetime: 213456789,
                    blockheight: 10,
                    coinbase: 720000000000,
                    creatorpublickey: '123645789',
                    feetransferfromcoinbase: 10000000000,
                    feetransfertoreceiver: 1000000000,
                    globalslotsincegenesis: 1,
                    receiverpublickey: '123445676',
                    slot: 1,
                    stakingledgerhash: 'da622bbdea9ab2c632385a78791b202a',
                    statehash: '0062aca83e3d7027cd77cfe03e0fe7d9',
                    usercommandtransactionfees: 10000000000,
                    winnerpublickey: '123645789',
                },
                {
                    blockdatetime: 213456781,
                    blockheight: 11,
                    coinbase: 720000000000,
                    creatorpublickey: '123645782',
                    feetransferfromcoinbase: 10000000000,
                    feetransfertoreceiver: 1000000000,
                    globalslotsincegenesis: 1,
                    receiverpublickey: '123445672',
                    slot: 1,
                    stakingledgerhash: 'da622bbdea9ab2c632385a78791b202a',
                    statehash: '0062aca83e3d7027cd77cfe03e0fe7d9',
                    usercommandtransactionfees: 10000000000,
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
                totalPayouts: 0,
                totalBurn: 0,
            };

            const totals = {
                coinBaseSum: 1440,
                feeTransferFromCoinBaseSum: 20,
                userCommandTransactionFeeSum: 20,
                netCoinBaseReceived: 1440,
                payoutAmountsSum: 0,
                payoutFeesSum: 0,
                netMinaToPoolOperator: 1440,
            };

            await summarizer.calculateTotals(process);
            expect(process.totals).toStrictEqual(totals);
        });
    });
});
