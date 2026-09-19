import { Text, View } from 'react-native'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { appStyles } from '@/constants/app-styles'
import { AccountFeatureGetBalance } from '@/features/account/account-feature-get-balance'
import { AccountFeatureGetTokenBalances } from '@/features/account/account-feature-get-token-balances'
import { AccountFeaturePortfolioValue } from '@/features/account/account-feature-portfolio-value'
import { PlusBadge } from '@/features/plus/plus-badge'

export function WalletTab() {
  const { account } = useMobileWallet()

  if (!account) {
    return null
  }

  return (
    <View style={appStyles.stack}>
      <Text style={appStyles.title}>Wallet</Text>
      <PlusBadge />
      <View style={appStyles.card}>
        <AccountFeaturePortfolioValue address={account.address} />
        <AccountFeatureGetBalance address={account.address} />
        <AccountFeatureGetTokenBalances address={account.address} />
      </View>
    </View>
  )
}
