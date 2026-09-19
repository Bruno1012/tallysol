export function parseSolanaPayUrl(data: string): { address: string; amountSol?: number } {
  const trimmed = data.trim()
  if (trimmed.startsWith('solana:')) {
    const withoutScheme = trimmed.slice('solana:'.length)
    const [address, query] = withoutScheme.split('?')
    let amountSol: number | undefined
    if (query) {
      for (const pair of query.split('&')) {
        const [key, value] = pair.split('=')
        if (key === 'amount' && value) {
          amountSol = Number(decodeURIComponent(value))
        }
      }
    }
    return { address, amountSol }
  }
  return { address: trimmed }
}
