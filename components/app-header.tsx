import { Text, View } from 'react-native'
import Svg, { Polygon } from 'react-native-svg'
import { Colors } from '@/constants/colors'

export function AppHeader({ large = false }: { large?: boolean }) {
  const scale = large ? 2.6 : 1
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 * scale }}>
      <Svg width={22 * scale} height={28 * scale} viewBox="260 50 160 200">
        <Polygon points="270,60 350,60 395,105 350,150 270,150 305,105" fill={Colors.purple} />
        <Polygon points="410,150 330,150 285,195 330,240 410,240 375,195" fill={Colors.green} />
      </Svg>
      <Text style={{ color: Colors.purple, fontSize: 20 * scale, fontWeight: 'bold' }}>TallySol</Text>
    </View>
  )
}
