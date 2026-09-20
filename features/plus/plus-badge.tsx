import { Text, View } from 'react-native'
import { useIsPlus } from '@/features/plus/use-is-plus'
import { SKR_PLUS_THRESHOLD } from '@/constants/plus'
import { Colors } from '@/constants/colors'
import { StarIcon } from '@/components/star-icon'

export function PlusBadge() {
  const { isPlus, skrBalance, isLoading, isError, error } = useIsPlus()

  if (isLoading) {
    return <Text style={{ color: Colors.gray, fontSize: 12 }}>Checking SKR balance...</Text>
  }

  if (isError) {
    return <Text style={{ color: Colors.gray, fontSize: 12 }}>SKR check failed: {String(error)}</Text>
  }

  if (isPlus) {
    return (
      <View
        style={{
          alignSelf: 'flex-start',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 6,
          backgroundColor: Colors.purple,
          borderRadius: 16,
          paddingHorizontal: 12,
          paddingVertical: 6,
        }}
      >
        <StarIcon size={14} color={Colors.gold} />
        <Text style={{ color: Colors.white, fontSize: 12, fontWeight: 'bold' }}>TallySol Plus · {skrBalance.toFixed(0)} SKR (mainnet)</Text>
      </View>
    )
  }

  const progress = Math.min(skrBalance / SKR_PLUS_THRESHOLD, 1)

  return (
    <View style={{ alignSelf: 'stretch', gap: 6 }}>
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
        <StarIcon size={16} color={Colors.gray} />
        <Text style={{ color: Colors.gray, flex: 1, fontSize: 14, fontWeight: 'bold' }}>
          {skrBalance.toFixed(0)} / {SKR_PLUS_THRESHOLD} SKR (mainnet) to unlock Plus
        </Text>
      </View>
      <View style={{ height: 10, borderRadius: 5, backgroundColor: '#E5DEEE', overflow: 'hidden', width: '100%' }}>
        <View style={{ height: '100%', width: `${progress * 100}%`, borderRadius: 5, backgroundColor: Colors.green }} />
      </View>
    </View>
  )
}
