import * as cors from './cors'
import * as responseTime from './responseTime'
import * as store from './store'


export const middlewareModules: MiddlewareModule[] = [
  cors,
  responseTime
]

export default function installMiddlewares(app: App, router: Router) {
  if (app.context.config.cache) middlewareModules.push(store)
  for (const mod of middlewareModules) {
    mod.init?.(app, router)
    if (mod.default) router.use(mod.default)
  }
}
