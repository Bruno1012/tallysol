import { Text, View } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { appStyles } from '@/constants/app-styles'
import { AppButton } from '@/components/app-button'
import { QrCodeDisplay } from '@/components/qr-code-display'
import { buildSolanaPayUrl } from '@/utils/build-solana-pay-url'

export function ReceiveFeature() {
  const { account } = useMobileWallet()

  if (!account) {
    return null
  }

  return (
    <View style={[appStyles.card, appStyles.stack]}>
      <Text style={appStyles.cardText}>Show this to receive a payment</Text>
      <QrCodeDisplay value={buildSolanaPayUrl({ address: account.address })} />
      <Text style={[appStyles.cardText, { textAlign: 'center' }]}>{account.address}</Text>
      <AppButton title="Copy address" onPress={() => Clipboard.setString(account.address)} />
    </View>
  )
}
