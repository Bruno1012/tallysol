import { CURRENCIES } from '@/constants/currencies'
import { useIsPlus } from '@/features/plus/use-is-plus'

export function useAvailableCurrencies() {
  const { isPlus } = useIsPlus()
  return CURRENCIES.filter((c) => !c.plusOnly || isPlus)
}
