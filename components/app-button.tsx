import { GestureResponderEvent, Pressable, StyleSheet, Text } from 'react-native'
import { Colors } from '@/constants/colors'

export function AppButton({
  title,
  onPress,
  disabled,
}: {
  title: string
  onPress: (event: GestureResponderEvent) => void
  disabled?: boolean
}) {
  return (
    <Pressable style={[styles.button, disabled && styles.disabled]} onPress={onPress} disabled={disabled}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: Colors.purple,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: Colors.white,
    fontWeight: 'bold',
  },
})
