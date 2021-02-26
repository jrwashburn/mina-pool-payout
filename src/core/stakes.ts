import ledger from "../data/staking-epoch-ledger.json";

export function getStakes(key: string) {
  const stakes = ledger.filter((x) => x.delegate == key);
  return stakes;
}
