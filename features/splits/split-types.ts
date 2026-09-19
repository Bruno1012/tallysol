export type SplitMember = {
  id: string
  name: string
  address: string
  paid: boolean
  signature?: string
  paidCurrencySymbol?: string
}

export type Split = {
  id: string
  description: string
  totalAmountUsd: number
  organizerAddress: string
  members: SplitMember[]
  createdAt: number
}

export function getShareUsd(split: Split) {
  return split.totalAmountUsd / (split.members.length + 1)
}

export function isSplitFullyPaid(split: Split) {
  return split.members.every((m) => m.paid)
}
