import { getCleverTap } from '../lib/clevertap'

export async function allStates(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const { orderId, currentState } = ctx.body

  if (!orderId || !currentState) return

  const clevertap = await getCleverTap(ctx)

  const data = {
    orderId,
    state: currentState,
  }

  clevertap.upload([
    {
      type: 'event',
      objectId: data.orderId,
      evtName: 'Order Updated',
      evtData: data,
    },
  ])

  await next()
}
