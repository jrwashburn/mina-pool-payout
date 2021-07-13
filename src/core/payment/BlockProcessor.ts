import { IBlockProcessor as IBlockProcessor } from "./Model";
import { injectable } from "inversify";

@injectable()
export class BlockProcessor implements IBlockProcessor {
    async determineLastBlockHeightToProcess(max: number, min: number, latestHeight: number): Promise<number> {
          // Finality is understood to be max height minus k blocks. unsafe to process blocks above maxHeight since they could change if there is a long running, short-range fork
  // Alternatively, stop processing at maximum height if lower than finality
  // TODO: where does this really belong?
    let result = 0
    // TODO #13 get "getBlocks" and "getLatestHeight" based on data souce
    const finalityHeight = latestHeight - min;
    
    if (finalityHeight > max) {
        result = max;
    } else {
        result = finalityHeight;
    }
    return result;
    }

}