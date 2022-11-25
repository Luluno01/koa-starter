export async function responseTime(ctx: MyAppContext, next: Next) {
  const start = performance.now()
  try {
    await next()
  } finally {
    ctx.set('X-Response-Time', `${performance.now() - start}ms`)
  }
}

export default responseTime
