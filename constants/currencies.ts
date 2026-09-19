import { Address, address } from '@solana/kit'

export type Currency = {
  symbol: string
  name: string
  decimals: number
  mint?: Address
  coingeckoId: string
  plusOnly?: boolean
}

export const CURRENCIES: Currency[] = [
  { symbol: 'SOL', name: 'Solana', decimals: 9, coingeckoId: 'solana' },
  {
    symbol: 'USDC',
    name: 'USD Coin (devnet)',
    decimals: 6,
    mint: address('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
    coingeckoId: 'usd-coin',
  },
  {
    symbol: 'USDT',
    name: 'Tether (devnet test token)',
    decimals: 6,
    mint: address('DQvVLT4a7NZdyBrsnYRGnmUtpmxw7jGuqGe4ucxnqH2Z'),
    coingeckoId: 'tether',
  },
  {
    symbol: 'SKR',
    name: 'Seeker (devnet test token)',
    decimals: 6,
    mint: address('BMPfAEPccUuRmEGfqZGYVpCc1BqmvYaMS7J5PF5c6hWG'),
    coingeckoId: 'seeker',
  },
  // Plus-only — real mainnet tokens, no devnet equivalent. Only actually
  // sendable when the app's Network is switched to mainnet. All four confirmed
  // on the classic Token Program (no Token-2022/transfer-hook complications).
  {
    symbol: 'JUP',
    name: 'Jupiter',
    decimals: 6,
    mint: address('JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'),
    coingeckoId: 'jupiter-exchange-solana',
    plusOnly: true,
  },
  {
    symbol: 'WIF',
    name: 'dogwifhat',
    decimals: 6,
    mint: address('EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm'),
    coingeckoId: 'dogwifcoin',
    plusOnly: true,
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    decimals: 5,
    mint: address('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'),
    coingeckoId: 'bonk',
    plusOnly: true,
  },
  {
    symbol: 'PENGU',
    name: 'Pudgy Penguins',
    decimals: 6,
    mint: address('2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv'),
    coingeckoId: 'pudgy-penguins',
    plusOnly: true,
  },
]
