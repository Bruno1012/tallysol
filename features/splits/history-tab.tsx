import { Text, View } from 'react-native'
import { appStyles } from '@/constants/app-styles'
import { useSplits } from '@/features/splits/use-splits'
import { SplitFeatureList } from '@/features/splits/split-feature-list'
import { isSplitFullyPaid } from '@/features/splits/split-types'

export function HistoryTab() {
  const { splits, markPaid, deleteSplit } = useSplits()
  const completedSplits = splits.filter(isSplitFullyPaid)

  return (
    <View style={appStyles.stack}>
      <Text style={appStyles.title}>Past Transactions</Text>
      <SplitFeatureList splits={completedSplits} onPaid={markPaid} onDelete={deleteSplit} emptyMessage="No completed splits yet." mode="history" />
    </View>
  )
}
