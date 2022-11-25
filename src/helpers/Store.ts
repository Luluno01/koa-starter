import { createClient } from 'redis'


export type RedisClientOptions = Parameters<typeof createClient>[0]
export type RedisClient = ReturnType<typeof createClient>

export class Store implements IStore {
  public client!: RedisClient
  public options?: RedisClientOptions

  constructor(options?: RedisClientOptions) {
    this.options = options
  }

  /**
   * Init the Redis client, connect to the server and ping
   * @returns 
   */
  public async init() {
    if (this.client) return this
    const client = this.client = createClient(this.options)
    await client.connect()
    await client.ping()
    return this
  }
  
  public async get(key: string) {
    return this.client.get(key)
  }

  public async getParsed<T = any>(key: string): Promise<T | null> {
    const res = await this.get(key)
    return res ? JSON.parse(res) : null
  }

  public async set(key: string, value: object | null, expire: number = 0) {
    if (expire) {
      return this.client.set(key, JSON.stringify(value), { EX: expire }) as Promise<'OK'>
    } else {
      return this.client.set(key, JSON.stringify(value)) as Promise<'OK'>
    }
  }

  public async del(...keys: string[]) {
    return this.client.del(keys)
  }

  public async flushDb() {
    return this.client.flushDb() as Promise<'OK'>
  }

  public async getAndSet(
    key: string,
    value: () => Promise<object>,
    force: boolean = false,
    expire: number = 0
  ) {
    if (force) {
      const val = await value()
      if (val != null) await this.set(key, val, expire)
      return val
    } else {
      let val: string | object | null = await this.get(key)
      if (val === null) {
        val = await value()
        if (val !== null) await this.set(key, val, expire)
      }
      return val
    }
  }
}

export default Store
