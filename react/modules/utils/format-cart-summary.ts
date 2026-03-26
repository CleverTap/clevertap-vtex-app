import type { CartItem } from '../../typings/events'
import { formatMoneyAmount } from './format-money'

export function formatCartSummary(
  cartItems: CartItem[],
  options?: {
    dividePrice?: boolean
  }
) {
  let totalValue = 0
  let totalItems = 0

  if (!cartItems.length) {
    return { totalValue: formatMoneyAmount(0), totalItems }
  }

  cartItems.forEach((item: CartItem) => {
    const shouldFormatPrice = item.priceIsInt ?? options?.dividePrice
    const formattedPrice = formatMoneyAmount(
      shouldFormatPrice ? item.price / 100 : item.price
    )

    totalValue += formattedPrice * item.quantity
    totalItems += item.quantity
  })

  return {
    totalValue: formatMoneyAmount(totalValue),
    totalItems,
  }
}
