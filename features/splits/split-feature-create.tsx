import { useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { appStyles } from '@/constants/app-styles'
import { AppButton } from '@/components/app-button'
import { QrScanButton } from '@/components/qr-scan-button'
import { PasteButton } from '@/components/paste-button'

type MemberInput = { name: string; address: string }

export function SplitFeatureCreate({ onCreate }: { onCreate: (description: string, totalAmountUsd: number, members: MemberInput[]) => void }) {
  const [description, setDescription] = useState('')
  const [totalAmountUsd, setTotalAmountUsd] = useState('')
  const [members, setMembers] = useState<MemberInput[]>([{ name: '', address: '' }])

  function updateMember(index: number, field: keyof MemberInput, value: string) {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)))
  }

  function addMember() {
    setMembers((prev) => [...prev, { name: '', address: '' }])
  }

  function removeMember(index: number) {
    setMembers((prev) => prev.filter((_, i) => i !== index))
  }

  function submit() {
    const validMembers = members.filter((m) => m.name.trim() && m.address.trim())
    if (!description.trim() || !Number(totalAmountUsd) || validMembers.length === 0) {
      return
    }
    onCreate(description.trim(), Number(totalAmountUsd), validMembers)
    setDescription('')
    setTotalAmountUsd('')
    setMembers([{ name: '', address: '' }])
  }

  const shareUsd = Number(totalAmountUsd) ? Number(totalAmountUsd) / (members.length + 1) : 0

  return (
    <View style={[appStyles.card, appStyles.stack]}>
      <Text style={appStyles.cardText}>New split</Text>
      <TextInput style={appStyles.input} placeholder="Expense" placeholderTextColor="#B39DDB" value={description} onChangeText={setDescription} />
      <TextInput
        style={appStyles.input}
        placeholder="Total amount in USD"
        placeholderTextColor="#B39DDB"
        value={totalAmountUsd}
        onChangeText={setTotalAmountUsd}
        keyboardType="decimal-pad"
      />
      {members.map((member, index) => (
        <View key={index} style={appStyles.stack}>
          <TextInput
            style={appStyles.input}
            placeholder="Name"
            placeholderTextColor="#B39DDB"
            value={member.name}
            onChangeText={(v) => updateMember(index, 'name', v)}
          />
          <TextInput
            style={appStyles.input}
            placeholder="Wallet address"
            placeholderTextColor="#B39DDB"
            value={member.address}
            onChangeText={(v) => updateMember(index, 'address', v)}
            autoCapitalize="none"
          />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <PasteButton onPaste={(text) => updateMember(index, 'address', text)} />
            <QrScanButton onScanned={({ address }) => updateMember(index, 'address', address)} />
          </View>
          {members.length > 1 ? <Text style={appStyles.cardText} onPress={() => removeMember(index)}>Remove</Text> : null}
        </View>
      ))}
      <Text style={appStyles.cardText} onPress={addMember}>
        + Add another person
      </Text>
      {shareUsd > 0 ? <Text style={appStyles.cardText}>Each person owes: ${shareUsd.toFixed(2)} — payable in any currency</Text> : null}
      <AppButton title="Create split" onPress={submit} />
    </View>
  )
}
