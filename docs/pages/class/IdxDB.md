# IdxDB

`indexedDB API`操作类。

## 基本用法

- 在页面加载前需要使用`useDB`初始化数据库，如果已经初始化则会跳过初始化，如果升级了版本则会更新数据库。 
- 初始化之后可调用实例的`connect`方法连接数据库，通过`close`方法关闭数据库连接。
- 需要操作数据库时则需要使用`store`使用具体的存储。

```ts
// utils.ts
import { IdxDB } from '@renzp/idxdb'
import { useEffect, useState } from 'react'

const DB_NAME = 'test'

export const initDB = () => IdxDB.useDB({
  name: DB_NAME,
  version: 1,
  stores,
})

export const useIdxDB = () => {
  const [idxDB, setIdxDB] = useState<IdxDB>()

  useEffect(() => {
    const db = new IdxDB(DB_NAME)
    db.connect().then(() => setIdxDB(db))

    return () => db.close()
  }, [])

  return idxDB
}
```

```tsx
// App.tsx
import { useState } from 'react'
import { initDB } from './utils.ts'
import Demo from './Demo.tsx'

const App = () => {
  const [dbLoading, setDbLoading] = useState(true)
  initDB().finally(() => setDbLoading(false))

  return dbLoading ? <div>indexedDB初始化中...</div> : <Demo />
}

export default App
```

```tsx
// demo.tsx
import { useIdxDB } from './utils.ts'
import { useEffect } from 'react'

const Demo = () => {
  const idxDB = useIdxDB()
  const logs = [
    {
      id: 1,
      text: '测试1'
    },
    {
      id: 2,
      text: '测试2'
    },
  ]

  useEffect(() => {
    const test = async () => {
      await idxDB?.store("logs")?.addList(logs)
      const result = await idxDB?.store("logs")?.getAll()
      console.log(result)
    }
  }, [])
  

  return <div>demo</div>
}

export default Demo
```

## 构造函数

```ts
constructor(name: string)
```

| 参数 | 说明       | 类型     | 默认值 | 是否必填 |
| ---- | ---------- | -------- | ------ | -------- |
| name | 数据库名称 | `string` | -      | 是       |


## 方法

| 方法          | 说明               | 类型                                           |
| ------------- | ------------------ | ---------------------------------------------- |
| useDB         | 使用数据(静态函数) | `(configs: IdxDBInitOptions) => Promise<void>` |
| connect       | 连接数据库         | `() => Promise<void>`                          |
| close         | 关闭数据库         | `() => void`                                   |
| getDBDatabase | 获取数据库对象     | `() => IDBDatabase \| undefined`               |
| store         | 创建存储对象       | `(storeName: string) => Store`                 |
