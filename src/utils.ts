export const requestPromise = <T = any>(request: IDBRequest<T>) => {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = (e: any) => {
      resolve(e.target.result as T)
    }
    request.onerror = reject
  })
}

export const createCursorRequest = <T = any>(
  request: IDBRequest<IDBCursorWithValue | null>,
  onsuccess: (
    cursor: IDBCursorWithValue,
    resolve: (value: T | PromiseLike<T>) => void,
  ) => void,
) => {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = (e: any) => {
      const cursor = e.target.result
      onsuccess(cursor, resolve)
    }

    request.onerror = reject
  })
}

export const findQuery = (data: any, query: any) => {
  const keys = Object.keys(query).filter((key) => query[key])

  return keys.reduce((prev, key) => {
    const target = data[key]
    const value = query[key]

    if (target === value) {
      return prev && true
    }

    return false
  }, true)
}

export const findLikeQuery = (data: any, query: any) => {
  const keys = Object.keys(query).filter((key) => query[key])

  return keys.reduce((prev, key) => {
    const target = data[key]
    const value = query[key]

    if (
      (typeof value === 'number' || typeof value === 'boolean') &&
      target === value
    ) {
      return prev && true
    }

    if (typeof value === 'string' && target.includes(value)) {
      return prev && true
    }

    if (Array.isArray(value) && value.includes(target)) {
      return prev && true
    }

    return false
  }, true)
}
