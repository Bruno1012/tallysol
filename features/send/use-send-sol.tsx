import { useCallback } from 'react'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { getTransferSolInstruction } from '@solana-program/system'
import {
  Address,
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getBase58Decoder,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
} from '@solana/kit'

export function useSendSol() {
  const { account, client, getTransactionSigner } = useMobileWallet()

  const sendSol = useCallback(
    async ({ destination, amountLamports }: { destination: Address; amountLamports: bigint }) => {
      if (!account) {
        throw new Error('No wallet connected')
      }

      const {
        context: { slot: minContextSlot },
        value: latestBlockhash,
      } = await client.rpc.getLatestBlockhash().send()

      const signer = getTransactionSigner(account.address, minContextSlot)

      const instruction = getTransferSolInstruction({
        source: signer,
        destination,
        amount: amountLamports,
      })

      const transactionMessage = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => appendTransactionMessageInstructions([instruction], tx),
        (tx) => setTransactionMessageFeePayerSigner(signer, tx),
        (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      )

      const signatureBytes = await signAndSendTransactionMessageWithSigners(transactionMessage)
      return getBase58Decoder().decode(signatureBytes) as string
    },
    [account, client, getTransactionSigner],
  )

  return { sendSol }
}
