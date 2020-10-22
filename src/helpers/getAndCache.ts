export async function getAndCache(ctx: MyAppContext, key: string, value: () => Promise<Formattable | object>, force: boolean = false, expire: number = 0) {
  const store = ctx.store
  const logger = ctx.logger
  return ctx.config.cache && store ? await store.getAndSet(key, async () => {
    logger.debug(`Cache missed, getting value for key ${key}`)
    return await value()
  }, force, expire) : await value()
}

export default getAndCache