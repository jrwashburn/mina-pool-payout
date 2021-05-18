import { BlockHandler } from "./Model";

export class BlockProcessor implements BlockHandler {
    determineLastBlockHeightToProcess(max: number, min: number, latestHeight: number): Promise<number> {
        throw new Error("Method not implemented.");
    }

}