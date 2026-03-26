/**
 * Major currency units as number rounded to 2 decimal places for CleverTap consistency.
 */
export function formatMoneyAmount(value: number | undefined | null): number {
  if (value == null || Number.isNaN(Number(value))) {
    return 0
  }

  return Number(Number(value).toFixed(2))
}

/**
 * Cart / pixel line prices: VTEX often sends minor units (cents). Same rule as formatCartSummary.
 */
export function normalizeCartItemUnitPrice(
  price: number,
  priceIsInt?: boolean
): number {
  const shouldConvertFromMinorUnits = priceIsInt ?? true
  const majorUnits = shouldConvertFromMinorUnits ? price / 100 : price

  return formatMoneyAmount(majorUnits)
}
