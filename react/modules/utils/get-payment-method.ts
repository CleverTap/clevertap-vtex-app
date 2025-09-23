import type { PaymentType } from '../../typings/events'

export function getPaymentMethodsString(
  transactionPaymentType: PaymentType[]
): string {
  if (!transactionPaymentType?.length) return ''

  return transactionPaymentType.map(p => p.paymentSystemName).join(', ')
}
