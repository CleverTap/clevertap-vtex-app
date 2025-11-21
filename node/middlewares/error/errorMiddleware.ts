export async function errorMiddleware(ctx: Context, next: () => Promise<any>) {
  try {
    await next()
  } catch (err) {
    const {
      vtex: { logger },
    } = ctx

    const status = err.status || err.statusCode || err.response.data.code || 500

    ctx.status = status

    ctx.body = {
      error: err.message || 'Unexpected error',
    }

    logger.error(`[Error] - ${ctx.method} - ${ctx.path} - ${status}: ${err}`)
    console.error(`[Error] - ${ctx.method} - ${ctx.path} - ${status}:`, err)
  }
}
