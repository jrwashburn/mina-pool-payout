export class ForkConstants {
  private static readonly FORK_COINBASE_MAP: {
    [fork: number]: { regular: number; supercharged?: number };
  } = {
      0: { regular: 720000000000, supercharged: 1440000000000 },
      1: { regular: 720000000000 },
      2: { regular: 360000000000 }, // Mesa hardfork
    };

  static getRegularCoinbase(fork: number): number {
    const forkConfig = this.FORK_COINBASE_MAP[fork];
    if (!forkConfig) {
      throw new Error(`Unknown fork number: ${fork}. Fork must be 0, 1, or 2.`);
    }
    return forkConfig.regular;
  }

  static getSuperchargedCoinbase(fork: number): number {
    if (fork !== 0) {
      throw new Error(
        `Fork ${fork} does not support supercharged blocks. Supercharged blocks only exist in fork 0.`,
      );
    }
    return this.FORK_COINBASE_MAP[0].supercharged!;
  }

  static validateCoinbase(fork: number, actualCoinbase: number): void {
    const expectedCoinbase = this.getRegularCoinbase(fork);
    if (actualCoinbase !== expectedCoinbase) {
      throw new Error(
        `Coinbase must be equal to ${expectedCoinbase} for fork ${fork} but is ${actualCoinbase}`,
      );
    }
  }
}
