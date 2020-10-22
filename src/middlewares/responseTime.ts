export async function responseTime(ctx: MyAppContext, next: Next) {
  const start = Date.now()
  await next()
  ctx.set('X-Response-Time', `${Date.now() - start}ms`)
}

export default responseTime
