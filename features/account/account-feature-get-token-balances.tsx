import { Text } from 'react-native'
import { Address } from '@solana/kit'
import { CURRENCIES, Currency } from '@/constants/currencies'
import { useAccountGetTokenBalance } from '@/features/account/use-account-get-token-balance'
import { appStyles } from '@/constants/app-styles'

function TokenBalanceRow({ address, currency }: { address: Address; currency: Currency }) {
  const { data, isLoading } = useAccountGetTokenBalance({ address, currency })
  // USDC/USDT/SKR here are all devnet-only test mints, not the real mainnet
  // tokens — labeled so they're never mistaken for the real thing (SKR doubly
  // so, since its real mainnet balance is checked separately for the Plus gate).
  const label = ['USDC', 'USDT', 'SKR'].includes(currency.symbol) ? `${currency.symbol} (devnet)` : currency.symbol
  return (
    <Text style={appStyles.walletRow}>
      {label}: {isLoading ? '...' : (data ?? 0).toFixed(2)}
    </Text>
  )
}

export function AccountFeatureGetTokenBalances({ address }: { address: Address }) {
  return (
    <>
      {CURRENCIES.filter((c) => c.mint).map((c) => (
        <TokenBalanceRow key={c.symbol} address={address} currency={c} />
      ))}
    </>
  )
}
