import * as log4js from 'koa-log4'


let CORS: string[] | null

export async function init(app: App, _: Router) {
  CORS = app.context.config.CORS || null
  if (CORS) {
    log4js.getLogger('app').info(`Cross-origin allowed origin(s): ${CORS.join(', ')}`)
  }
}

export async function cors(ctx: MyAppContext, next: Next) {
  const origin = ctx.get('Origin')
  try { 
    await next()
  } catch(err) {
    if (CORS && CORS.includes(origin)) {
      ctx.logger.info(`Cross-origin request from origin "${origin}"`)
      err.headers = err.headers || {}
      err.headers['Access-Control-Allow-Credentials'] = true
      err.headers['Access-Control-Allow-Origin'] = origin
    } 
    throw err
  } 
  if (CORS && CORS.includes(origin)) {
    ctx.logger.info(`Cross-origin request from origin "${origin}"`)
    ctx.set('Access-Control-Allow-Credentials', 'true')
    ctx.set('Access-Control-Allow-Origin', origin)
  }
}

export default cors
