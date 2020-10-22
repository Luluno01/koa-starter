import Store from '../helpers/Store'
import * as log4js from 'koa-log4'


export async function init(app: App, _: Router) {
  app.context.store = await (new Store).init()
  log4js.getLogger('app').info('Redis store enabled')
}
