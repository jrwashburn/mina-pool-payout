import { IBlockProcessor as IBlockProcessor } from "./Model";

export class BlockProcessor implements IBlockProcessor {
    determineLastBlockHeightToProcess(max: number, min: number, latestHeight: number): Promise<number> {
        throw new Error("Method not implemented.");
    }

}