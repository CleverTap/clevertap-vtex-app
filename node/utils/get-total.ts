import type { ItemTotal } from '@vtex/clients'

export function getTotal(id: string, totals: ItemTotal[]) {
  if (totals.length === 0) return

  return totals.find(t => t.id === id)?.value ?? 0
}
