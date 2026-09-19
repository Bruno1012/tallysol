import { View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

export function QrCodeDisplay({ value, size = 200 }: { value: string; size?: number }) {
  return (
    <View style={{ alignSelf: 'center', backgroundColor: '#ffffff', borderRadius: 12, padding: 12 }}>
      <QRCode value={value} size={size} />
    </View>
  )
}
