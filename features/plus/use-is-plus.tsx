import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { createSolanaRpc } from '@solana/kit'
import { SKR_MINT, SKR_PLUS_THRESHOLD } from '@/constants/plus'

// The Plus check always reads real mainnet SKR holdings, independent of
// whichever network (devnet/testnet) the rest of the app is connected to for
// testing — reading a balance doesn't need wallet authorization, only signing does.
// Uses Helius (free tier) rather than the public mainnet RPC, which blocks/throttles
// getTokenAccountsByOwner-style indexed queries without an API key.
const mainnetRpc = createSolanaRpc(`https://mainnet.helius-rpc.com/?api-key=${process.env.EXPO_PUBLIC_HELIUS_API_KEY}`)

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Mainnet RPC timed out after ${ms}ms`)), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

export function useIsPlus() {
  const { account } = useMobileWallet()

  const query = useQuery({
    queryKey: ['skr-balance-mainnet', account?.address],
    queryFn: async () => {
      const { value } = await withTimeout(
        mainnetRpc.getTokenAccountsByOwner(account!.address, { mint: SKR_MINT }, { encoding: 'jsonParsed' }).send(),
        10000,
      )
      if (value.length === 0) {
        return 0
      }
      return value[0].account.data.parsed.info.tokenAmount.uiAmount ?? 0
    },
    enabled: !!account,
    retry: 1,
  })

  const skrBalance = query.data ?? 0
  const isPlus = !query.isError && skrBalance >= SKR_PLUS_THRESHOLD

  return { isPlus, skrBalance, isLoading: query.isLoading, isError: query.isError, error: query.error }
}
