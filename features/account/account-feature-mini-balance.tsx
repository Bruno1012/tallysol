import { Text } from 'react-native'
import { Address } from '@solana/kit'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { useAccountGetBalance } from '@/features/account/use-account-get-balance'
import { useAccountGetTokenBalance } from '@/features/account/use-account-get-token-balance'
import { CURRENCIES } from '@/constants/currencies'
import { lamportsToSol } from '@/utils/lamports-to-sol'
import { Colors } from '@/constants/colors'

const USDC = CURRENCIES.find((c) => c.symbol === 'USDC')!

function MiniBalanceInner({ address }: { address: Address }) {
  const { data: solData } = useAccountGetBalance({ address })
  const { data: usdcData } = useAccountGetTokenBalance({ address, currency: USDC })
  const sol = lamportsToSol(solData?.value ?? 0n).toFixed(3)
  const usdc = (usdcData ?? 0).toFixed(2)

  return <Text style={{ color: Colors.gray, fontWeight: 'bold' }}>{sol} SOL · {usdc} USDC</Text>
}

export function AccountFeatureMiniBalance() {
  const { account } = useMobileWallet()

  if (!account) {
    return null
  }

  return <MiniBalanceInner address={account.address} />
}
