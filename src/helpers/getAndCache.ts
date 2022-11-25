export async function getAndCache(
  ctx: MyAppContext,
  key: string,
  value: () => Promise<object>,
  force: boolean = false,
  expire: number = 0
) {
  const store = ctx.store
  const logger = ctx.logger
  if (ctx.config.cache && store) {
    return store.getAndSet(key, async () => {
      logger.debug(`Cache missed, getting value for key ${key}`)
      return value()
    }, force, expire)
  } else {
    return value()
  }
}

export default getAndCache
