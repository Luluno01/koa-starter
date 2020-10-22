import * as redis from 'redis'
import { promisify } from 'util'


export function createClient(url: string = process.env.RD_URL!): Promise<redis.RedisClient> {
  const client = redis.createClient(url)
  return new Promise((resolve, reject) => {
    client
      .on('error', err => reject(err))
      .on('connect', () => resolve(client))
  })
}

function stringify(value: Formattable | object) {
  if (typeof (value as any).toJSON == 'function') {
    return JSON.stringify((value as Formattable).toJSON())
  } else {
    return JSON.stringify(value)
  }
}

export class Store implements IStore {
  public client!: redis.RedisClient
  public url: string
  private _get!: (key: string) => Promise<string | null>
  private _set!: (key: string, value: string, mode?: string, duration?: number) => Promise<'OK'>
  private _del!: (key: string) => Promise<0 | 1>
  private _flushdb!: () => Promise<'OK'>

  constructor(url: string = process.env.RD_URL!) {
    this.url = url
  }

  async init() {
    if (this.client) return this
    const client = this.client = await createClient(this.url)
    this._get = promisify(client.get).bind(client)
    this._set = promisify(client.set).bind(client) as (key: string, value: string, mode?: string, duration?: number) => Promise<'OK'>
    this._del = promisify(client.del as redis.OverloadedCommand<string, 0 | 1, boolean>).bind(client)
    this._flushdb = promisify<'OK'>(client.flushdb).bind(client)
    return this
  }
  
  async get(key: string) {
    return await this._get(key)
  }

  async getParsed<T = any>(key: string): Promise<T | null> {
    let res = await this._get(key)
    return res ? JSON.parse(res) : null
  }

  async set(key: string, value: Formattable | object, expire: number = 0) {
    if (expire) return await this._set(key, stringify(value), 'EX', expire)
    else return await this._set(key, stringify(value))
  }

  async del(key: string) {
    return await this._del(key)
  }

  async flushdb() {
    return await this._flushdb()
  }

  async getAndSet(key: string, value: () => Promise<Formattable | object>, force: boolean = false, expire: number = 0) {
    if (force) {
      const val = await value()
      if (val != null) await this.set(key, val, expire)
      return val
    } else {
      let val: string | Formattable | object | null = await this.get(key)
      if (val == null) {
        val = await value()
        if (val != null) await this.set(key, val, expire)
      }
      return val
    }
  }
}

export default Store
