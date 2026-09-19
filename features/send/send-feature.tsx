import { useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { address } from '@solana/kit'
import { appStyles } from '@/constants/app-styles'
import { AppButton } from '@/components/app-button'
import { QrScanButton } from '@/components/qr-scan-button'
import { PasteButton } from '@/components/paste-button'
import { CurrencyPicker } from '@/components/currency-picker'
import { CURRENCIES } from '@/constants/currencies'
import { useSendPayment } from '@/features/send/use-send-payment'
import { useAvailableCurrencies } from '@/features/plus/use-available-currencies'

export function SendFeature() {
  const { account } = useMobileWallet()
  const { sendPayment } = useSendPayment()
  const availableCurrencies = useAvailableCurrencies()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState(CURRENCIES[0])
  const [status, setStatus] = useState('')

  async function submit() {
    setStatus('Sending...')
    try {
      const destination = address(recipient.trim())
      const signature = await sendPayment({ currency, destination, uiAmount: Number(amount) })
      setStatus(`Sent! ${signature.slice(0, 12)}...`)
    } catch (e) {
      setStatus(`Failed: ${e}`)
    }
  }

  if (!account) {
    return null
  }

  return (
    <View style={appStyles.stack}>
      <View style={[appStyles.card, appStyles.stack]}>
        <CurrencyPicker selected={currency} onSelect={setCurrency} currencies={availableCurrencies} />
        <TextInput
          style={appStyles.input}
          placeholder="Recipient address"
          placeholderTextColor="#B39DDB"
          value={recipient}
          onChangeText={setRecipient}
          autoCapitalize="none"
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <PasteButton onPaste={setRecipient} />
          <QrScanButton
            onScanned={({ address: scannedAddress, amountSol }) => {
              setRecipient(scannedAddress)
              if (amountSol) {
                setAmount(String(amountSol))
              }
            }}
          />
        </View>
        <TextInput
          style={appStyles.input}
          placeholder={`Amount in ${currency.symbol}`}
          placeholderTextColor="#B39DDB"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />
        <AppButton title={`Send ${currency.symbol}`} onPress={submit} disabled={!recipient || !amount} />
        {status ? <Text style={appStyles.cardText}>{status}</Text> : null}
      </View>
    </View>
  )
}
