import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { Address } from '@solana/kit'
import { Currency } from '@/constants/currencies'

export function useAccountGetTokenBalance({ address, currency }: { address: Address; currency: Currency }) {
  const { chain, client } = useMobileWallet()
  return useQuery({
    queryKey: ['get-token-balance', chain, address, currency.symbol],
    queryFn: async () => {
      if (!currency.mint) {
        return 0
      }
      const { value } = await client.rpc.getTokenAccountsByOwner(address, { mint: currency.mint }, { encoding: 'jsonParsed' }).send()
      if (value.length === 0) {
        return 0
      }
      return value[0].account.data.parsed.info.tokenAmount.uiAmount ?? 0
    },
    enabled: !!currency.mint,
  })
}
