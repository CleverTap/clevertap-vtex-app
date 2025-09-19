import clevertap from '../lib/clevertap'

const processedOrders = new Map<string, Set<string>>()

export async function someStates(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const { orderId, currentState } = ctx.body

  if (!orderId || !currentState) return

  if (!processedOrders.has(orderId)) {
    processedOrders.set(orderId, new Set())
  }

  const statesSet = processedOrders.get(orderId)!

  if (statesSet.has(currentState)) return next()

  statesSet.add(currentState)

  const eventMap: Record<string, (id: string) => void> = {
    cancel: id =>
      clevertap.upload([
        {
          type: 'event',
          objectId: id,
          evtName: 'Order Cancelled',
          evtData: {
            orderId: id,
          },
        },
      ]),
    'payment-approved': id =>
      clevertap.upload([
        {
          type: 'event',
          objectId: id,
          evtName: 'Order Paid',
          evtData: {
            orderId: id,
          },
        },
      ]),
  }

  const handler = eventMap[currentState]

  if (handler) {
    handler(orderId)
  }

  await next()
}
