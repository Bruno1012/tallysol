import Clipboard from '@react-native-clipboard/clipboard'
import { AppButton } from '@/components/app-button'

export function PasteButton({ onPaste }: { onPaste: (text: string) => void }) {
  async function paste() {
    const text = await Clipboard.getString()
    if (text) {
      onPaste(text.trim())
    }
  }

  return <AppButton title="Paste" onPress={paste} />
}
