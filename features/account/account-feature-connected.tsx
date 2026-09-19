import { Text, View } from 'react-native'
import React from 'react'
import { AccountFeatureGetBalance } from '@/features/account/account-feature-get-balance'
import { AccountFeatureGetTokenBalances } from '@/features/account/account-feature-get-token-balances'
import { AccountFeaturePortfolioValue } from '@/features/account/account-feature-portfolio-value'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { appStyles } from '@/constants/app-styles'
import { AccountFeatureDisconnect } from '@/features/account/account-feature-disconnect'

// Shown only once connected — placed near the top of the page.
export function AccountFeatureConnected() {
  const { account } = useMobileWallet()

  if (!account) {
    return null
  }

  return (
    <View style={appStyles.stack}>
      <Text style={appStyles.title}>Account</Text>
      <View style={appStyles.stack}>
        <View style={appStyles.card}>
          <Text style={appStyles.cardText}>Connected to {account.label}</Text>
          <AccountFeaturePortfolioValue address={account.address} />
          <AccountFeatureGetBalance address={account.address} />
          <AccountFeatureGetTokenBalances address={account.address} />
        </View>
        <AccountFeatureDisconnect />
      </View>
    </View>
  )
}
