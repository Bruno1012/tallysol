import { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Split } from '@/features/splits/split-types'

const STORAGE_KEY = 'splitsol.splits'

export function useSplits() {
  const [splits, setSplits] = useState<Split[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        setSplits(JSON.parse(raw))
      }
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(splits))
    }
  }, [splits, loaded])

  const createSplit = useCallback(
    (description: string, totalAmountUsd: number, organizerAddress: string, members: { name: string; address: string }[]) => {
      const newSplit: Split = {
        id: Date.now().toString(),
        description,
        totalAmountUsd,
        organizerAddress,
        members: members.map((m, i) => ({
          id: `${Date.now()}-${i}`,
          name: m.name,
          address: m.address,
          paid: false,
        })),
        createdAt: Date.now(),
      }
      setSplits((prev) => [newSplit, ...prev])
    },
    [],
  )

  const markPaid = useCallback((splitId: string, memberId: string, signature: string, paidCurrencySymbol: string) => {
    setSplits((prev) =>
      prev.map((s) =>
        s.id === splitId
          ? { ...s, members: s.members.map((m) => (m.id === memberId ? { ...m, paid: true, signature, paidCurrencySymbol } : m)) }
          : s,
      ),
    )
  }, [])

  const deleteSplit = useCallback((splitId: string) => {
    setSplits((prev) => prev.filter((s) => s.id !== splitId))
  }, [])

  return { splits, createSplit, markPaid, deleteSplit }
}
