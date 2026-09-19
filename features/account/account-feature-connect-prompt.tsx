import { Text, View } from 'react-native'
import React from 'react'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { appStyles } from '@/constants/app-styles'
import { AccountFeatureSignIn } from '@/features/account/account-feature-sign-in'

// Shown only before connecting — placed lower on the first page.
export function AccountFeatureConnectPrompt() {
  const { account } = useMobileWallet()

  if (account) {
    return null
  }

  return (
    <View style={appStyles.stack}>
      <Text style={[appStyles.title, { textAlign: 'center' }]}>Account</Text>
      <AccountFeatureSignIn />
    </View>
  )
}
