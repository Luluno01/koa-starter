import log4js from 'log4js'
import * as cors from './cors'
import * as responseTime from './responseTime'
import * as store from './store'


export const middlewareModules: [ string, MiddlewareModule ][] = [
  [ 'cors', cors ],
  [ 'response time', responseTime ]
]

export default async function installMiddlewares(app: App, router: Router) {
  if (app.context.config.cache) middlewareModules.push([ 'store', store ])
  const logger = log4js.getLogger('app')
  for (const [ name, mod ] of middlewareModules) {
    logger.info('Installing middleware:', name)
    await mod.init?.(app, router)
    if (mod.default) router.use(mod.default)
  }
}
