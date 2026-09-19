import { useState } from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { AppButton } from '@/components/app-button'
import { parseSolanaPayUrl } from '@/utils/parse-solana-pay-url'

export function QrScanButton({ onScanned }: { onScanned: (result: { address: string; amountSol?: number }) => void }) {
  const [permission, requestPermission] = useCameraPermissions()
  const [visible, setVisible] = useState(false)
  const [scanned, setScanned] = useState(false)

  async function open() {
    if (!permission?.granted) {
      const result = await requestPermission()
      if (!result.granted) {
        return
      }
    }
    setScanned(false)
    setVisible(true)
  }

  function handleScan(data: string) {
    if (scanned) {
      return
    }
    setScanned(true)
    setVisible(false)
    onScanned(parseSolanaPayUrl(data))
  }

  return (
    <>
      <AppButton title="Scan QR code" onPress={open} />
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={(result) => handleScan(result.data)}
          />
          <View style={styles.footer}>
            <AppButton title="Cancel" onPress={() => setVisible(false)} />
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    bottom: 40,
    left: 0,
    position: 'absolute',
    right: 0,
  },
})
