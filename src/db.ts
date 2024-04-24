import { Store, type StoreIndex } from './store'

export interface IdxDBStore extends IDBObjectStoreParameters {
  name: string
  indexes?: Array<StoreIndex | string>
}

export interface IdxDBInitOptions {
  name: string
  stores: IdxDBStore[]
  version: number
}

const getDBVersion = async (name: string) => {
  const databases = await window.indexedDB.databases()
  const database = databases.find((item) => item.name === name)
  return database?.version
}

export class IdxDB {
  public name: string
  public version?: number
  #db?: IDBDatabase
  constructor(name: string) {
    this.name = name
    getDBVersion(name).then((version) => {
      this.version = version
    })
  }
  /**
   * 使用数据库
   *
   * @param options.name 数据库名
   * @param options.version 版本
   * @param options.stores 存储仓库
   */
  static async useDB({ name, stores, version = 1 }: IdxDBInitOptions) {
    const currentVersion = await getDBVersion(name)
    if (version < (currentVersion ?? version)) {
      console.error(
        `当前数据库【${name}】的使用版本: ${version}, 最新版本: ${currentVersion}。虽然不影响使用，但是为了防止出现更新数据库不生效的问题，请更改使用版本到最新版本。`,
      )
      return Promise.resolve(true)
    }

    const request = window.indexedDB.open(name, version)
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(true)
      request.onerror = (e: any) => {
        if (e.target.readyState !== 'done') {
          console.error(`使用数据库失败: ${JSON.stringify(e)}`)
        }
        reject(e)
      }
      request.onupgradeneeded = (e: any) => {
        const db: IDBDatabase = e.target.result
        for (const storeData of stores) {
          const { name, indexes, ...options } = storeData
          let store: IDBObjectStore
          if (db.objectStoreNames.contains(name)) {
            store = e.target.transaction.objectStore(name)
          } else {
            store = db.createObjectStore(name, options)
          }

          if (indexes) {
            // 删除已经移除的index
            const indexNames = Array.from(store.indexNames)
            const removeIndexNames = indexNames.filter(
              (name) => !indexes.includes(name),
            )
            for (const name of removeIndexNames) {
              store.deleteIndex(name)
            }

            for (const index of indexes) {
              if (typeof index === 'string') {
                if (store.indexNames.contains(index)) {
                  store.deleteIndex(index)
                }
                store.createIndex(index, index)
              } else {
                const {
                  name: indexName,
                  keyPath = indexName,
                  ...indexOptions
                } = index
                if (store.indexNames.contains(indexName)) {
                  store.deleteIndex(indexName)
                }
                store.createIndex(indexName, keyPath, indexOptions)
              }
            }
          }
        }

        db.close()
        resolve(true)
      }
    })
  }
  /**
   * 连接数据库
   */
  async connect(): Promise<void> {
    const databases = await window.indexedDB.databases()
    const database = databases.find((item) => item.name === this.name)
    if (!database) {
      console.error(`未找到数据库${this.name}, 连接前请先使用init初始化`)
      return
    }
    this.version = database.version as number

    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.name, this.version)
      request.onsuccess = (e: any) => {
        this.#db = e.target.result
        resolve()
      }
      request.onerror = reject
    })
  }
  /**
   * 关闭数据库
   */
  close() {
    this.#db?.close()
  }
  /**
   * 获取数据库对象
   * @returns 如果有则返回数据库对象，否则返回undefined
   */
  getDBDatabase() {
    return this.#db
  }
  /**
   * 创建存储对象
   * @param storeName 存储名称
   * @returns 返回存储对象
   */
  store(storeName: string) {
    if (this.#db) {
      return new Store(this.#db, storeName)
    }

    return
  }
}
