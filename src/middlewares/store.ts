import Store from '../helpers/Store'
import log4js from 'log4js'


export async function init(app: App, _: Router) {
  app.context.store = await (new Store).init()
  log4js.getLogger('app').info('Redis store enabled')
}
