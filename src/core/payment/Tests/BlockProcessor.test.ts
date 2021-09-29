import { BlockProcessor } from '../BlockProcessor';

describe('BlockProcessor Tests', () => {
    describe('Should be succesful', () => {
        it('when all data is correct', () => {
            const blockProcessor = new BlockProcessor();

            return blockProcessor.determineLastBlockHeightToProcess(11, 10, 12).then((result) => {
                expect(2).toBe(result);
            });
        });

        it('when finallityheight is higher', () => {
            const blockProcessor = new BlockProcessor();

            return blockProcessor.determineLastBlockHeightToProcess(5, 1, 12).then((result) => {
                expect(5).toBe(result);
            });
        });
    });
});
