import { useState } from 'react'
import { View } from 'react-native'
import { appStyles } from '@/constants/app-styles'
import { TabBar } from '@/components/tab-bar'
import { SendFeature } from '@/features/send/send-feature'
import { ReceiveFeature } from '@/features/send/receive-feature'

const MODES = ['Send', 'Receive'] as const

export function TransferTab() {
  const [mode, setMode] = useState<(typeof MODES)[number]>('Send')

  return (
    <View style={appStyles.stack}>
      <TabBar tabs={MODES} selected={mode} onSelect={setMode} />
      {mode === 'Send' ? <SendFeature /> : <ReceiveFeature />}
    </View>
  )
}
