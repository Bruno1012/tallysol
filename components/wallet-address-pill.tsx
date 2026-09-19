import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import Clipboard from '@react-native-clipboard/clipboard'
import { Colors } from '@/constants/colors'
import { AppButton } from '@/components/app-button'

function truncate(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function WalletAddressPill() {
  const { account, disconnect } = useMobileWallet()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!account) {
    return null
  }

  return (
    <View style={{ alignItems: 'flex-end' }}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={{
          alignItems: 'center',
          backgroundColor: Colors.cardTint,
          borderRadius: 20,
          flexDirection: 'row',
          gap: 6,
          paddingHorizontal: 12,
          paddingVertical: 6,
        }}
      >
        <View style={{ backgroundColor: Colors.green, borderRadius: 5, height: 8, width: 8 }} />
        <Text style={{ color: Colors.purple, fontWeight: 'bold' }}>{truncate(account.address)}</Text>
      </Pressable>
      {open ? (
        <View style={{ marginTop: 8, gap: 8 }}>
          <AppButton
            title={copied ? 'Copied!' : 'Copy address'}
            onPress={() => {
              Clipboard.setString(account.address)
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            }}
          />
          <AppButton
            title="Disconnect"
            onPress={() => {
              setOpen(false)
              disconnect()
            }}
          />
        </View>
      ) : null}
    </View>
  )
}
