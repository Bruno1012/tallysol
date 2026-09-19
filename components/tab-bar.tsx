import { Pressable, ScrollView, Text } from 'react-native'
import { Colors } from '@/constants/colors'

export function TabBar<T extends string>({ tabs, selected, onSelect }: { tabs: readonly T[]; selected: T; onSelect: (tab: T) => void }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
      contentContainerStyle={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}
    >
      {tabs.map((tab) => {
        const isSelected = tab === selected
        return (
          <Pressable
            key={tab}
            onPress={() => onSelect(tab)}
            style={{
              backgroundColor: isSelected ? Colors.green : 'transparent',
              borderColor: isSelected ? Colors.green : Colors.gray,
              borderRadius: 20,
              borderWidth: 1,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: isSelected ? Colors.purple : Colors.gray, fontWeight: 'bold' }}>{tab}</Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}
