import { createHash, BinaryLike } from 'crypto'


/**
 * @description Hash content to hex string.
 * @param content Content to be hashed.
 * @param algo Optional. Hash algorithm. Defaults to `md5`.
 */
export function hash(content: BinaryLike, algo: string = 'md5'): string {
  return createHash(algo).update(content).digest('hex')
}

export default hash
