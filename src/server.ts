/* Koa */
import Koa from 'koa'
import Router from '@koa/router'
/* Standard node lib */
import fs from 'fs'
/* Config */
const config = JSON.parse(fs.readFileSync('config.json').toString()) as Config
const loggerConfig = JSON.parse(fs.readFileSync('log4js.json').toString())
/* Helpers */
import { formatError } from './helpers/formatError'
/* Logger */
import log4js from 'log4js'
import { koaLogger, Logger as _Logger } from 'koa-log4'
/* Middlewares */
import installMiddlewares from './middlewares'
/* Controller */
import installControllers from './controllers'
import { HttpError } from 'http-errors'


let logger: log4js.Logger | undefined

async function main() {
  /* Initialize logger */
  const logDir = 'logs'  // Under current working directory
  try {
    fs.mkdirSync(logDir)
  } catch(err) {
    if(err.code != 'EEXIST') {
      console.error(`Could not set up log directory: ${formatError(err)}`)
      process.exit(1)
    }
  }
  log4js.addLayout('json', config => logEvent => JSON.stringify(logEvent) + (config.separator ?? ''))
  log4js.configure(loggerConfig)
  logger = log4js.getLogger('app')

  /* Get port */
  const port: number = parseInt(process.env.PORT!) || config.port

  /* Initialize application */
  const app = new Koa<Koa.DefaultState, MyAppContext>()
  const router = new Router<Koa.DefaultState, MyAppContext>()
  app.context.config = config
  router.use(koaLogger(log4js.getLogger('http') as unknown as _Logger, { level: 'auto' }))

  /* Add logger */
  app.context.logger = logger

  /* Load middlewares */
  await installMiddlewares(app, router)

  /* Install controllers */
  installControllers(router)

  app
    .use(router.routes())
    .use(router.allowedMethods())


  /* Start server */
  app.listen(port, () => {
    logger!.info(`Server running on port ${port}`)
  })

  app.on('error', err => {
    const status = (err as HttpError)?.status ?? (err as HttpError)?.statusCode
    if (typeof status !== 'number' || status.toString().startsWith('5')) {
      logger!.error('Server error:', err)
    }
  })
}

main()
  .catch(err => {
    (logger ?? console).error('Failed to start server', err)
    process.exit(1)
  })
