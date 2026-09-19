import { address } from '@solana/kit'

// The Plus check reads the REAL mainnet SKR mint — deliberately different from
// the devnet test SKR mint in constants/currencies.ts, which exists only so
// SKR can be sent/tested as a free currency during devnet development.
// Verified 2026-09-19 against CoinGecko's platform-contract mapping and by
// reading the mint account directly on mainnet.
export const SKR_MINT = address('SKRbvo6Gf7GondiT3BbTfuRDPqLWei4j2Qy2NPGZhW3')
export const SKR_DECIMALS = 6
export const SKR_PLUS_THRESHOLD = 1000

export const MAX_FREE_ACTIVE_GROUPS = 2
