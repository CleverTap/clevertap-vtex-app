export const getConfig = async (ctx: Context | StatusChangeContext) => {
  const {
    clients: { apps },
  } = ctx

  const appId = process.env.VTEX_APP_ID

  if (!appId) {
    throw new Error('appId not founded on enviroment')
  }

  try {
    const settings = await apps.getAppSettings(appId)

    return settings
  } catch (error) {
    console.error(error)
  }
}
