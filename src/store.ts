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
  /**
   * 存储构造函数
   *
   * @param db 数据库对象
   * @param name 存储名称
   */
  constructor(db: IDBDatabase, name: string) {
    this.#db = db
    this.#name = name
  }
  #createTransactionStore(mode: IDBTransactionMode) {
    return this.#db.transaction([this.#name], mode).objectStore(this.#name)
  }
  #createRequest<T = any>(
    mode: IDBTransactionMode,
    fn: (transaction: IDBObjectStore) => IDBRequest<T>,
  ) {
    return requestPromise(fn(this.#createTransactionStore(mode)))
  }
  /**
   * 添加数据
   *
   * @param data 数据
   * @returns Promise<IDBValidKey>
   */
  async add<T = unknown>(data: T) {
    return this.#createRequest('readwrite', (transaction) =>
      transaction.add(data),
    )
  }
  /**
   * 添加多条数据
   *
   * @param data 数据
   * @returns Promise<unknown>
   */
  async addList<T = unknown[]>(data: T) {
    const transaction = this.#db.transaction([this.#name], 'readwrite')
    const store = transaction.objectStore(this.#name)

    if (!Array.isArray(data)) {
      return Promise.reject(new Error('addList需要传入一个数组数据'))
    }

    for (const item of (data ?? []) as Array<unknown>) {
      store.add(item)
    }
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve(true)
      }
      transaction.onerror = reject
    })
  }
  /**
   * 通过`key`删除数据
   *
   * @param key key
   * @returns Promise<undefined>
   */
  async deleteByKey(key: string) {
    return this.#createRequest('readwrite', (transaction) =>
      transaction.delete(key),
    )
  }
  #deleteByQuery(isDelete: (value: any) => boolean) {
    const request = this.#createTransactionStore('readwrite').openCursor()
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
  /**
   * 通过指定条件删除数据(`isLike`默认为`false`)
   *
   * @param param 筛选条件
   * @returns Promise<boolean>
   */
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
  /**
   * 清空存储数据
   *
   * @returns Promise<undefined>
   */
  async clear() {
    return this.#createRequest('readwrite', (transaction) =>
      transaction.clear(),
    )
  }
  /**
   * 通过`key`更新数据
   *
   * @param data 数据
   * @param key key
   * @returns Promise<IDBValidKey>
   */
  async updateByKey(data: any, key: string) {
    return this.#createRequest('readwrite', (transaction) =>
      transaction.put(data, key),
    )
  }
  /**
   * 通过`keyPath`更新数据
   *
   * @param data 数据
   * @returns Promise<IDBValidKey>
   */
  async updateByKeyPath(data: any) {
    return this.#createRequest('readwrite', (transaction) =>
      transaction.put(data),
    )
  }
  /**
   * 通过`keyPath`更新多条数据
   *
   * @param data 数据
   * @returns Promise<unknown>
   */
  async updateListByKeyPath<T = unknown[]>(data: T) {
    const transaction = this.#db.transaction([this.#name], 'readwrite')
    const store = transaction.objectStore(this.#name)

    if (!Array.isArray(data)) {
      return Promise.reject(
        new Error('updateListByKeyPath需要传入一个数组数据'),
      )
    }

    for (const item of (data ?? []) as Array<unknown>) {
      store.put(item)
    }
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve(true)
      }
      transaction.onerror = reject
    })
  }
  async getByKey(key: any) {
    return this.#createRequest('readonly', (transaction) =>
      transaction.get(key),
    )
  }
  /**
   * 获取存储全部数据
   * @returns 返回查询的数据
   */
  async getAll() {
    return this.#createRequest('readonly', (transaction) =>
      transaction.getAll(),
    )
  }
  #query<T = any>(isQuery: (value: any) => boolean) {
    const list: T[] = [] as unknown as T[]

    const request = this.#createTransactionStore('readwrite').openCursor()
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
  /**
   * 通过查询条件获取数据(`isLike`默认为`true`)
   *
   * @param param 筛选条件
   * @returns 返回查询的数据
   */
  async getQuery<T = any>({ filter, values = {}, isLike = true }: Query<T>) {
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
