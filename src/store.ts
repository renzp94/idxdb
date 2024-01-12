import {
  createCursorRequest,
  findLikeQuery,
  findQuery,
  requestPromise,
} from './utils'

export interface StoreIndex extends IDBIndexParameters {
  name: string
  keyPath?: string | string[]
}

export interface StoreConfigs {
  autoIncrement?: boolean
}

export interface Query<T = any> {
  values?: Record<string, any>
  filter?: (v: T) => boolean
  isLike?: boolean
}

export class Store {
  #name: string
  #db: IDBDatabase
  constructor(db: IDBDatabase, name: string) {
    this.#db = db
    this.#name = name
  }
  #createTransaction(mode: IDBTransactionMode) {
    return this.#db.transaction([this.#name], mode).objectStore(this.#name)
  }
  #createRequest<T = any>(
    mode: IDBTransactionMode,
    fn: (transaction: IDBObjectStore) => IDBRequest<T>,
  ) {
    return requestPromise(fn(this.#createTransaction(mode)))
  }
  async add<T = unknown>(data: T) {
    return this.#createRequest('readwrite', (transaction) =>
      transaction.add(data),
    )
  }
  async deleteByKey(key: string) {
    return this.#createRequest('readwrite', (transaction) =>
      transaction.delete(key),
    )
  }
  #deleteByQuery(isDelete: (value: any) => boolean) {
    const request = this.#createTransaction('readwrite').openCursor()
    let success = false
    return createCursorRequest<boolean>(request, (cursor, resolve) => {
      if (cursor) {
        if (isDelete(cursor.value)) {
          success = true
          cursor.delete()
        }
        cursor.continue()
      } else {
        resolve(success)
      }
    })
  }
  deleteByQuery<T = any>({ filter, values = {}, isLike = false }: Query<T>) {
    const hasValues = !!Object.keys(values).find((key) => values?.[key])
    // 如果只有filter，则只使用filter过滤
    if (!hasValues && filter) {
      return this.#deleteByQuery(filter)
    }

    if (hasValues) {
      const find = isLike ? findLikeQuery : findQuery
      return this.#deleteByQuery((value: any) => {
        // 先用values过滤
        const status = find(value, values)
        // 如果有值并且有filter，则再使用filter过滤
        if (status && filter) {
          return filter(value)
        }

        return status
      })
    }

    return false
  }
  async updateByKey(data: any, key: string) {
    return this.#createRequest('readwrite', (transaction) =>
      transaction.put(data, key),
    )
  }
  async updateByKeyPath(data: any) {
    return this.#createRequest('readwrite', (transaction) =>
      transaction.put(data),
    )
  }
  async getByKey(key: any) {
    return this.#createRequest('readonly', (transaction) =>
      transaction.get(key),
    )
  }
  async getAll() {
    return this.#createRequest('readonly', (transaction) =>
      transaction.getAll(),
    )
  }
  #query<T = any>(isQuery: (value: any) => boolean) {
    const list: T[] = [] as unknown as T[]

    const request = this.#createTransaction('readwrite').openCursor()
    return createCursorRequest<T[]>(request, (cursor, resolve) => {
      if (cursor) {
        if (isQuery(cursor.value)) {
          list.push(cursor.value)
        }
        cursor.continue()
      } else {
        resolve(list)
      }
    })
  }
  async getQuery<T = any>({
    filter,
    values = {},
    isLike = true,
  }: Record<string, any>) {
    const hasValues = !!Object.keys(values).find((key) => values?.[key])
    // 如果只有filter，则只使用filter过滤
    if (!hasValues && filter) {
      return this.#query<T>(filter)
    }

    if (hasValues) {
      const find = isLike ? findLikeQuery : findQuery
      return this.#query<T>((value: any) => {
        // 先用values过滤
        const status = find(value, values)
        // 如果有值并且有filter，则再使用filter过滤
        if (status && filter) {
          return filter(value)
        }

        return status
      })
    }

    return this.getAll()
  }
}
