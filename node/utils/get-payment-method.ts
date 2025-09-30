import type { PaymentDetail } from '@vtex/clients'

export function getPaymentMethodsString(payments: PaymentDetail[]): string {
  if (!payments?.length) return ''

  return payments.map(p => p.paymentSystemName).join(', ')
}
