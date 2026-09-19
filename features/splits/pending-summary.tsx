import { Text, View } from 'react-native'
import { appStyles } from '@/constants/app-styles'
import { Colors } from '@/constants/colors'
import { Split, getShareUsd } from '@/features/splits/split-types'

export function PendingSummary({ splits }: { splits: Split[] }) {
  const unpaidCount = splits.reduce((sum, split) => sum + split.members.filter((m) => !m.paid).length, 0)
  const unpaidUsd = splits.reduce((sum, split) => sum + split.members.filter((m) => !m.paid).length * getShareUsd(split), 0)

  if (unpaidCount === 0) {
    return null
  }

  const people = unpaidCount === 1 ? 'person' : 'people'

  return (
    <View style={[appStyles.card, { backgroundColor: Colors.purple }]}>
      <Text style={{ color: Colors.white, fontWeight: 'bold' }}>
        {unpaidCount} {people} still owe you ${unpaidUsd.toFixed(2)} across {splits.length} active split{splits.length === 1 ? '' : 's'}
      </Text>
    </View>
  )
}
