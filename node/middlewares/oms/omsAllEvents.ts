export async function omsAllEvents(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  console.info(ctx)

  await next()
}
