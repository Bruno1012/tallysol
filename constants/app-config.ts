import { AppIdentity, createSolanaDevnet, createSolanaMainnet, createSolanaTestnet, SolanaCluster } from '@wallet-ui/react-native-kit'

export class AppConfig {
  static identity: AppIdentity = { name: 'TallySol' }
  static networks: SolanaCluster[] = [
    createSolanaDevnet({ url: 'https://api.devnet.solana.com' }),
    createSolanaTestnet({ url: 'https://api.testnet.solana.com' }),
    createSolanaMainnet({ url: `https://mainnet.helius-rpc.com/?api-key=${process.env.EXPO_PUBLIC_HELIUS_API_KEY}` }),
  ]
}
