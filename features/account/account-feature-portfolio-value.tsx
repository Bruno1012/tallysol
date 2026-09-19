import { Text } from 'react-native'
import { Address } from '@solana/kit'
import { appStyles } from '@/constants/app-styles'
import { CURRENCIES } from '@/constants/currencies'
import { useAccountGetBalance } from '@/features/account/use-account-get-balance'
import { useAccountGetTokenBalance } from '@/features/account/use-account-get-token-balance'
import { usePrices } from '@/utils/use-prices'
import { lamportsToSol } from '@/utils/lamports-to-sol'

const USDC = CURRENCIES.find((c) => c.symbol === 'USDC')!
const USDT = CURRENCIES.find((c) => c.symbol === 'USDT')!
const SKR = CURRENCIES.find((c) => c.symbol === 'SKR')!

export function AccountFeaturePortfolioValue({ address }: { address: Address }) {
  const { data: solBalance } = useAccountGetBalance({ address })
  const { data: usdcBalance } = useAccountGetTokenBalance({ address, currency: USDC })
  const { data: usdtBalance } = useAccountGetTokenBalance({ address, currency: USDT })
  const { data: skrBalance } = useAccountGetTokenBalance({ address, currency: SKR })
  const { data: prices, isLoading: pricesLoading } = usePrices()

  if (pricesLoading || !prices) {
    return <Text style={appStyles.cardText}>Balance: ...</Text>
  }

  const totalUsd =
    lamportsToSol(solBalance?.value ?? 0n) * (prices.SOL ?? 0) +
    (usdcBalance ?? 0) * (prices.USDC ?? 0) +
    (usdtBalance ?? 0) * (prices.USDT ?? 0) +
    (skrBalance ?? 0) * (prices.SKR ?? 0)

  return <Text style={appStyles.cardText}>Balance: ${totalUsd.toFixed(2)}</Text>
}
