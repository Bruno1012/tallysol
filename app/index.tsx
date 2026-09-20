import { NetworkFeatureIndex } from '@/features/network/network-feature-index'
import { AccountFeatureConnectPrompt } from '@/features/account/account-feature-connect-prompt'
import { AccountFeatureMiniBalance } from '@/features/account/account-feature-mini-balance'
import { WalletTab } from '@/features/account/wallet-tab'
import { AppConfig } from '@/constants/app-config'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { appStyles } from '@/constants/app-styles'
import { SplitFeatureIndex } from '@/features/splits/split-feature-index'
import { TransferTab } from '@/features/send/transfer-tab'
import { HistoryTab } from '@/features/splits/history-tab'
import { TabBar } from '@/components/tab-bar'
import { AppHeader } from '@/components/app-header'
import { WalletAddressPill } from '@/components/wallet-address-pill'
import { PlusUnlockToast } from '@/features/plus/plus-unlock-toast'
import { useMobileWallet } from '@wallet-ui/react-native-kit'

const TABS = ['Split', 'Transfer', 'History', 'Wallet', 'Settings'] as const
type Tab = (typeof TABS)[number]

export default function HomeScreen() {
  const { account } = useMobileWallet()
  const [tab, setTab] = useState<Tab>('Split')

  return (
    <SafeAreaView style={appStyles.screen}>
      {account ? <PlusUnlockToast /> : null}
      <ScrollView contentContainerStyle={[appStyles.stack, { flexGrow: 1 }]}>
        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
          {account ? <AppHeader /> : null}
          <WalletAddressPill />
        </View>
        <AccountFeatureMiniBalance />
        {account ? (
          <>
            <TabBar tabs={TABS} selected={tab} onSelect={setTab} />
            {tab === 'Split' ? <SplitFeatureIndex /> : null}
            {tab === 'Transfer' ? <TransferTab /> : null}
            {tab === 'History' ? <HistoryTab /> : null}
            {tab === 'Wallet' ? <WalletTab /> : null}
            {tab === 'Settings' ? (
              <View style={appStyles.stack}>
                <Text style={appStyles.title}>App Config</Text>
                <View style={appStyles.card}>
                  <Text style={appStyles.cardText}>
                    Name <Text style={{ fontWeight: 'bold' }}>{AppConfig.identity.name}</Text>
                  </Text>
                  <Text style={appStyles.cardText}>
                    URL <Text style={{ fontWeight: 'bold' }}>{AppConfig.identity.uri}</Text>
                  </Text>
                </View>
                <NetworkFeatureIndex />
              </View>
            ) : null}
          </>
        ) : null}
        <View style={{ flex: account ? 0 : 1, alignItems: 'center', justifyContent: 'center' }}>
          {!account ? <AppHeader large /> : null}
        </View>
        <AccountFeatureConnectPrompt />
      </ScrollView>
    </SafeAreaView>
  )
}
