import { useCallback } from 'react'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstructionAsync,
  getTransferCheckedInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from '@solana-program/token'
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

export function useSendToken() {
  const { account, client, getTransactionSigner } = useMobileWallet()

  const sendToken = useCallback(
    async ({ mint, decimals, destination, amount }: { mint: Address; decimals: number; destination: Address; amount: bigint }) => {
      if (!account) {
        throw new Error('No wallet connected')
      }

      const {
        context: { slot: minContextSlot },
        value: latestBlockhash,
      } = await client.rpc.getLatestBlockhash().send()

      const signer = getTransactionSigner(account.address, minContextSlot)

      const [sourceAta] = await findAssociatedTokenPda({ owner: account.address, mint, tokenProgram: TOKEN_PROGRAM_ADDRESS })
      const [destinationAta] = await findAssociatedTokenPda({ owner: destination, mint, tokenProgram: TOKEN_PROGRAM_ADDRESS })

      // Idempotent: safe to include even if the recipient already has a token account for this mint.
      const createDestinationAtaInstruction = await getCreateAssociatedTokenIdempotentInstructionAsync({
        payer: signer,
        owner: destination,
        mint,
      })

      const transferInstruction = getTransferCheckedInstruction({
        source: sourceAta,
        mint,
        destination: destinationAta,
        authority: signer,
        amount,
        decimals,
      })

      const transactionMessage = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => appendTransactionMessageInstructions([createDestinationAtaInstruction, transferInstruction], tx),
        (tx) => setTransactionMessageFeePayerSigner(signer, tx),
        (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      )

      const signatureBytes = await signAndSendTransactionMessageWithSigners(transactionMessage)
      return getBase58Decoder().decode(signatureBytes) as string
    },
    [account, client, getTransactionSigner],
  )

  return { sendToken }
}
