export function buildSolanaPayUrl({
  address,
  amount,
  splToken,
  label,
}: {
  address: string
  amount?: number
  splToken?: string
  label?: string
}) {
  const params: string[] = []
  if (amount !== undefined) {
    params.push(`amount=${amount}`)
  }
  if (splToken) {
    params.push(`spl-token=${splToken}`)
  }
  if (label) {
    params.push(`label=${encodeURIComponent(label)}`)
  }
  return `solana:${address}${params.length ? `?${params.join('&')}` : ''}`
}
