import 'reflect-metadata';
import { BlockProcessor } from '../BlockProcessor';

describe('BlockProcessor Tests', () => {
    describe('Should be succesful', () => {
        it('when all data is correct', () => {
            const blockProcessor = new BlockProcessor();

            return blockProcessor.determineLastBlockHeightToProcess(11, 10, 12).then((result) => {
                expect(2).toBe(result);
            });
        });

        it('when finallityheight is higher', async () => {
            const blockProcessor = new BlockProcessor();

            const result = await blockProcessor.determineLastBlockHeightToProcess(5, 1, 12);
            expect(5).toBe(result);
        });
    });
});
