import { useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { address } from '@solana/kit'
import { appStyles } from '@/constants/app-styles'
import { AppButton } from '@/components/app-button'
import { CurrencyPicker } from '@/components/currency-picker'
import { QrCodeDisplay } from '@/components/qr-code-display'
import { CURRENCIES } from '@/constants/currencies'
import { Split, getShareUsd } from '@/features/splits/split-types'
import { useSendPayment } from '@/features/send/use-send-payment'
import { useAvailableCurrencies } from '@/features/plus/use-available-currencies'
import { usePrices } from '@/utils/use-prices'
import { buildSolanaPayUrl } from '@/utils/build-solana-pay-url'

export function SplitFeatureList({
  splits,
  onPaid,
  onDelete,
  emptyMessage = 'No splits yet — create one above.',
  mode = 'active',
}: {
  splits: Split[]
  onPaid: (splitId: string, memberId: string, signature: string, paidCurrencySymbol: string) => void
  onDelete: (splitId: string) => void
  emptyMessage?: string
  mode?: 'active' | 'history'
}) {
  const { sendPayment } = useSendPayment()
  const availableCurrencies = useAvailableCurrencies()
  const { data: prices, isLoading: pricesLoading } = usePrices()
  const [statusByMember, setStatusByMember] = useState<Record<string, string>>({})
  const [currencyByMember, setCurrencyByMember] = useState<Record<string, (typeof CURRENCIES)[number]>>({})
  const [qrVisibleMemberId, setQrVisibleMemberId] = useState<string | null>(null)

  function currencyFor(memberId: string) {
    return currencyByMember[memberId] ?? CURRENCIES[0]
  }

  async function pay(split: Split, memberId: string) {
    const currency = currencyFor(memberId)
    const price = prices?.[currency.symbol]
    if (!price) {
      setStatusByMember((prev) => ({ ...prev, [memberId]: 'Price unavailable, try again' }))
      return
    }
    setStatusByMember((prev) => ({ ...prev, [memberId]: 'Sending...' }))
    try {
      const destination = address(split.organizerAddress)
      const uiAmount = getShareUsd(split) / price
      const signature = await sendPayment({ currency, destination, uiAmount })
      onPaid(split.id, memberId, signature, currency.symbol)
      setStatusByMember((prev) => ({ ...prev, [memberId]: '' }))
    } catch (e) {
      setStatusByMember((prev) => ({ ...prev, [memberId]: `Failed: ${e}` }))
    }
  }

  function confirmDelete(split: Split) {
    if (mode === 'history') {
      Alert.alert('Delete this record?', `This will permanently remove "${split.description}" from your history.`, [
        { text: 'Keep it', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(split.id) },
      ])
      return
    }
    Alert.alert('Cancel split?', `This will remove "${split.description}" and its payment status. This can't be undone.`, [
      { text: 'Keep it', style: 'cancel' },
      { text: 'Cancel split', style: 'destructive', onPress: () => onDelete(split.id) },
    ])
  }

  if (splits.length === 0) {
    return <Text style={appStyles.cardText}>{emptyMessage}</Text>
  }

  return (
    <View style={appStyles.stack}>
      {splits.map((split) => {
        const shareUsd = getShareUsd(split)
        return (
          <View key={split.id} style={[appStyles.card, appStyles.stack]}>
            <Text style={appStyles.cardText}>{split.description}</Text>
            <Text style={appStyles.cardText}>
              Total: ${split.totalAmountUsd.toFixed(2)} · Each owes: ${shareUsd.toFixed(2)}
            </Text>
            <AppButton title={mode === 'history' ? 'Delete from history' : 'Cancel split'} onPress={() => confirmDelete(split)} />
            {split.members.map((member) => {
              const currency = currencyFor(member.id)
              const price = prices?.[currency.symbol]
              const convertedAmount = price ? shareUsd / price : undefined
              return (
                <View key={member.id} style={appStyles.stack}>
                  <Text style={appStyles.cardText}>
                    {member.name} {member.paid ? `— Paid ✓ (${member.paidCurrencySymbol})` : ''}
                  </Text>
                  {!member.paid ? (
                    <>
                      <CurrencyPicker
                        selected={currency}
                        onSelect={(c) => setCurrencyByMember((prev) => ({ ...prev, [member.id]: c }))}
                        currencies={availableCurrencies}
                      />
                      <Text style={appStyles.cardText}>
                        {pricesLoading ? 'Loading price...' : convertedAmount !== undefined ? `≈ ${convertedAmount.toFixed(4)} ${currency.symbol}` : 'Price unavailable'}
                      </Text>
                      <AppButton title={`Pay in ${currency.symbol}`} onPress={() => pay(split, member.id)} disabled={!convertedAmount} />
                      <AppButton
                        title={qrVisibleMemberId === member.id ? 'Hide QR' : 'Show QR to scan'}
                        onPress={() => setQrVisibleMemberId(qrVisibleMemberId === member.id ? null : member.id)}
                      />
                      {qrVisibleMemberId === member.id && convertedAmount !== undefined ? (
                        <>
                          <QrCodeDisplay
                            value={buildSolanaPayUrl({
                              address: split.organizerAddress,
                              amount: convertedAmount,
                              splToken: currency.mint,
                              label: split.description,
                            })}
                          />
                          <Text style={[appStyles.cardText, { textAlign: 'center' }]}>{split.organizerAddress}</Text>
                        </>
                      ) : null}
                    </>
                  ) : null}
                  {statusByMember[member.id] ? <Text style={appStyles.cardText}>{statusByMember[member.id]}</Text> : null}
                </View>
              )
            })}
          </View>
        )
      })}
    </View>
  )
}
