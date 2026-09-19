import { Text, View } from 'react-native'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { appStyles } from '@/constants/app-styles'
import { MAX_FREE_ACTIVE_GROUPS } from '@/constants/plus'
import { useSplits } from '@/features/splits/use-splits'
import { useIsPlus } from '@/features/plus/use-is-plus'
import { SplitFeatureCreate } from '@/features/splits/split-feature-create'
import { SplitFeatureList } from '@/features/splits/split-feature-list'
import { PendingSummary } from '@/features/splits/pending-summary'
import { isSplitFullyPaid } from '@/features/splits/split-types'

export function SplitFeatureIndex() {
  const { account } = useMobileWallet()
  const { splits, createSplit, markPaid, deleteSplit } = useSplits()
  const { isPlus } = useIsPlus()

  if (!account) {
    return null
  }

  const activeSplits = splits.filter((s) => !isSplitFullyPaid(s))
  const limitReached = !isPlus && activeSplits.length >= MAX_FREE_ACTIVE_GROUPS

  return (
    <View style={appStyles.stack}>
      <Text style={appStyles.title}>Splits</Text>
      <PendingSummary splits={activeSplits} />
      {limitReached ? (
        <View style={[appStyles.card, appStyles.stack]}>
          <Text style={appStyles.cardText}>
            You've reached the free limit of {MAX_FREE_ACTIVE_GROUPS} active splits. Cancel or finish one, or hold 1000+ SKR to unlock TallySol Plus for
            unlimited splits.
          </Text>
        </View>
      ) : (
        <SplitFeatureCreate onCreate={(description, totalAmountUsd, members) => createSplit(description, totalAmountUsd, account.address, members)} />
      )}
      <SplitFeatureList splits={activeSplits} onPaid={markPaid} onDelete={deleteSplit} />
    </View>
  )
}
