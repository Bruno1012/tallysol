import { useCallback } from 'react'
import { Address } from '@solana/kit'
import { Currency } from '@/constants/currencies'
import { useSendSol } from '@/features/send/use-send-sol'
import { useSendToken } from '@/features/send/use-send-token'

export function useSendPayment() {
  const { sendSol } = useSendSol()
  const { sendToken } = useSendToken()

  const sendPayment = useCallback(
    async ({ currency, destination, uiAmount }: { currency: Currency; destination: Address; uiAmount: number }) => {
      const amount = BigInt(Math.round(uiAmount * 10 ** currency.decimals))
      if (!currency.mint) {
        return sendSol({ destination, amountLamports: amount })
      }
      return sendToken({ mint: currency.mint, decimals: currency.decimals, destination, amount })
    },
    [sendSol, sendToken],
  )

  return { sendPayment }
}
