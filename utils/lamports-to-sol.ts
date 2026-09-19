export function lamportsToSol(balance: bigint) {
  return Number(balance) / 1e9
}

export function solToLamports(sol: number) {
  return BigInt(Math.round(sol * 1e9))
}
