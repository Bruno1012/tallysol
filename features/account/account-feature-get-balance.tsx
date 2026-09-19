import { Text } from 'react-native'
import { useAccountGetBalance } from '@/features/account/use-account-get-balance'
import { useNetwork } from '@/features/network/use-network'
import { lamportsToSol } from '@/utils/lamports-to-sol'
import { appStyles } from '@/constants/app-styles'
import { Address } from '@solana/kit'

export function AccountFeatureGetBalance({ address }: { address: Address }) {
  const { data, isLoading } = useAccountGetBalance({ address })
  const { selectedNetwork } = useNetwork()

  // SOL is the same native asset on every cluster, unlike the devnet-only test
  // mints — so this label follows whichever network is actually selected
  // instead of being hardcoded, and stays correct if you switch to mainnet.
  return (
    <Text style={appStyles.cardText}>
      SOL ({selectedNetwork.label.toLowerCase()}): {isLoading ? '...' : lamportsToSol(data?.value ?? 0n).toFixed(2)}
    </Text>
  )
}
