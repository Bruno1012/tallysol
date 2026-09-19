import { useQuery } from '@tanstack/react-query'
import { CURRENCIES } from '@/constants/currencies'

export function usePrices() {
  return useQuery({
    queryKey: ['prices-usd'],
    queryFn: async () => {
      const ids = CURRENCIES.map((c) => c.coingeckoId).join(',')
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
      const data = await response.json()
      const prices: Record<string, number> = {}
      for (const currency of CURRENCIES) {
        prices[currency.symbol] = data[currency.coingeckoId]?.usd ?? 0
      }
      return prices
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
  })
}
