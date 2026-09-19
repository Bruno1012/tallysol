import { useEffect, useRef, useState } from 'react'
import { Text, View } from 'react-native'
import { useIsPlus } from '@/features/plus/use-is-plus'
import { Colors } from '@/constants/colors'
import { StarIcon } from '@/components/star-icon'

export function PlusUnlockToast() {
  const { isPlus } = useIsPlus()
  const wasPlus = useRef(isPlus)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const justUnlocked = isPlus && !wasPlus.current
    wasPlus.current = isPlus
    if (justUnlocked) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [isPlus])

  if (!visible) {
    return null
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: 8,
        left: 16,
        right: 16,
        zIndex: 100,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.purple,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <StarIcon size={18} color={Colors.gold} />
      <Text style={{ color: Colors.white, fontWeight: 'bold' }}>You've unlocked TallySol Plus!</Text>
    </View>
  )
}
