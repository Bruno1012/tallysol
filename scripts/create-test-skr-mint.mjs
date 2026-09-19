// One-off dev script: creates a devnet SPL token standing in for SKR
// (Seeker's real token only exists on mainnet, so we need a testable
// equivalent on devnet). Run with: node scripts/create-test-skr-mint.mjs
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  appendTransactionMessageInstructions,
  createSolanaRpc,
  createTransactionMessage,
  generateKeyPairSigner,
  createKeyPairSignerFromBytes,
  getSignatureFromTransaction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  createSolanaRpcSubscriptions,
  writeKeyPairSigner,
} from '@solana/kit'
import { getCreateAccountInstruction } from '@solana-program/system'
import {
  getInitializeMint2Instruction,
  getCreateAssociatedTokenIdempotentInstructionAsync,
  getMintToInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from '@solana-program/token'

const DEVNET_HTTP = 'https://api.devnet.solana.com'
const DEVNET_WSS = 'wss://api.devnet.solana.com'
const MINT_ACCOUNT_LAMPORTS = 1461600
const DECIMALS = 6
const RECIPIENT_WALLET = '96dLEp69X34rGTyeomabyA7HZsv5crKWeiYA4XJkdcpx'
const PAYER_KEYPAIR_PATH = fileURLToPath(new URL('./.test-mint-payer.json', import.meta.url))

const rpc = createSolanaRpc(DEVNET_HTTP)
const rpcSubscriptions = createSolanaRpcSubscriptions(DEVNET_WSS)
const sendAndConfirm = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })

async function getOrCreatePayer() {
  if (existsSync(PAYER_KEYPAIR_PATH)) {
    const bytes = new Uint8Array(JSON.parse(readFileSync(PAYER_KEYPAIR_PATH, 'utf8')))
    const signer = await createKeyPairSignerFromBytes(bytes, true)
    console.log('Reusing existing throwaway payer:', signer.address)
    return signer
  }
  const signer = await generateKeyPairSigner(true)
  await writeKeyPairSigner(signer, PAYER_KEYPAIR_PATH)
  console.log('Generated NEW throwaway payer (saved to disk):', signer.address)
  return signer
}

async function main() {
  const payer = await getOrCreatePayer()

  const { value: lamports } = await rpc.getBalance(payer.address).send()
  console.log(`Payer balance: ${Number(lamports) / 1e9} SOL`)
  if (lamports < 5_000_000n) {
    console.log('')
    console.log(`Not enough SOL yet. Please send at least 0.01 SOL to this address using the SplitSol app:`)
    console.log(payer.address)
    return
  }

  const mint = await generateKeyPairSigner()
  console.log('New SKR (test) mint:', mint.address)

  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()

  const createMintAccount = getCreateAccountInstruction({
    payer,
    newAccount: mint,
    lamports: MINT_ACCOUNT_LAMPORTS,
    space: 82n,
    programAddress: TOKEN_PROGRAM_ADDRESS,
  })

  const initMint = getInitializeMint2Instruction({
    mint: mint.address,
    decimals: DECIMALS,
    mintAuthority: payer.address,
    freezeAuthority: null,
  })

  const createRecipientAta = await getCreateAssociatedTokenIdempotentInstructionAsync({
    payer,
    owner: RECIPIENT_WALLET,
    mint: mint.address,
  })

  const mintToRecipient = getMintToInstruction({
    mint: mint.address,
    token: createRecipientAta.accounts[1].address,
    mintAuthority: payer,
    amount: 1_000n * 10n ** BigInt(DECIMALS),
  })

  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => appendTransactionMessageInstructions([createMintAccount, initMint, createRecipientAta, mintToRecipient], tx),
    (tx) => setTransactionMessageFeePayerSigner(payer, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  )

  const signedTransaction = await signTransactionMessageWithSigners(message)
  await sendAndConfirm(signedTransaction, { commitment: 'confirmed' })
  console.log('Signature:', getSignatureFromTransaction(signedTransaction))
  console.log('')
  console.log('DONE. Mint address to put in constants/currencies.ts:')
  console.log(mint.address)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
