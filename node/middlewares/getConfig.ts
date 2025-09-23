export const getConfig = async (ctx: any) => {
  const {
    clients: { apps },
    vtex: { logger },
  } = ctx

  const appId = process.env.VTEX_APP_ID

  if (!appId) {
    throw new Error('appId not founded on enviroment')
  }

  try {
    const settings = await apps.getAppSettings(appId)

    return settings
  } catch (error) {
    logger.error({
      message: 'getConfig-getAppSettings-error',
      error,
    })
  }
}
