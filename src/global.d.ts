interface Config {
  port: number
  cache?: boolean | { expire: number }
  CORS?: string[]
}

interface IStore {
  /**
   * Retrieve a string value identified by a key, return null if not found
   * @param key Key of the value to retrieve
   */
  get(key: string): Promise<string | null>

  /**
   * Get a string value identified by a key and parse it as JSON, return null if not found
   * @param key Key of the value to retrieve
   */
  getParsed<T = any>(key: string): Promise<T | null>

  /**
   * Set a value identified by a key, optionally set its TTL
   * @param key Key of the value to set
   * @param value Formattable value or JSON object
   * @param expire Optional, expiration duration in seconds
   */
  set(key: string, value: object, expire?: number): Promise<'OK'>

  /**
   * Delete a value identified by a key
   * @param keys Keys to be deleted
   */
  del(...keys: string[]): Promise<number>

  /**
   * Flush database
   */
  flushDb(): Promise<'OK'>

  /**
   * Retrieve the value if it is not found in the store and update the cache, or return the cached value without retrieving it again
   * @param key Key of the value to set
   * @param value Lazy value retriever
   * @param force Ignore cache and update the value
   * @param expire Optional, expiration duration in seconds
   */
  getAndSet(key: string, value: () => Promise<object>, force?: boolean, expire?: number): Promise<string | object | null>
}

type Logger = import('log4js').Logger

type DefaultContext = import('koa').Context

interface MyAppContext extends DefaultContext {
  config: Config
  logger: Logger
  store?: IStore
}

type App = import('koa')<import('koa').DefaultState, MyAppContext>

type Next = import('koa').Next

type Method = 'get' | 'post' | 'patch' | 'put' | 'del' | 'all'
type Router = import('@koa/router')<import('koa').DefaultState, MyAppContext>
interface ISimpleController {
  method: Method
  pattern: string
  handler(ctx: MyAppContext, next: Next): Promise<any>
}
interface IRouterController {
  pattern: string
  router: Router
}
type Controller = ISimpleController | IRouterController

interface MiddlewareModule {
  init?(app: App, router: Router): Promise<void>
  default?(ctx: MyAppContext, next: Next): Promise<void>
}
