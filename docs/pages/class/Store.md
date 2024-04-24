# Store

`indexedDB API`存储类。

## 基本用法

通过此存储类可以进行数据库的增删改查操作，一般不直接实例化对象，可通过`IdxDB.store`方法获取存储对象。

```ts
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

await idxDB?.store("logs")?.addList(logs)
const result = await idxDB?.store("logs")?.getAll()
console.log(result)
```

## 构造函数

```ts
constructor(db: IDBDatabase, name: string)
```

| 参数 | 说明       | 类型          | 默认值 | 是否必填 |
| ---- | ---------- | ------------- | ------ | -------- |
| db   | 数据库对象 | `IDBDatabase` | -      | 是       |
| name | 存储名称   | `string`      | -      | 是       |


## 方法

| 参数                | 说明                                        | 类型                                               |
| ------------------- | ------------------------------------------- | -------------------------------------------------- |
| add                 | 添加数据                                    | `<T = unknown>(data: T) => Promise<T>`             |
| addList             | 添加多条数据                                | `<T = unknown[]>(data: T) => Promise<T>`           |
| deleteByKey         | 通过`key`删除数据                           | `(key: string) => Promise<undefined>`              |
| deleteByQuery       | 通过指定条件删除数据(`isLike`默认为`false`) | `<T = any>(query:  Query<T>) => Promise<boolean>`  |
| clear               | 清空存储数据                                | `() => Promise<undefined>`                         |
| updateByKey         | 通过`key`更新数据                           | `(data: any, key: string) => Promise<IDBValidKey>` |
| updateByKeyPath     | 通过`keyPath`更新数据                       | `(data: any) => Promise<IDBValidKey>`              |
| updateListByKeyPath | 通过`keyPath`更新多条数据                   | `(data: any) => Promise<unknown>`                  |
| getByKey            | 通过`key`获取数据                           | `(key: string) => Promise<any>`                    |
| getAll              | 获取存储全部数据                            | `() => Promise<any[]>`                             |
| getQuery            | 通过查询条件获取数据(`isLike`默认为`true`)  | `<T = any>(query: Query<T>) => Promise<any[]>`     |


```ts
export interface Query<T = any> {
  // 返回字段
  values?: Record<string, any>
  // 过滤条件
  filter?: (v: T) => boolean
  // 是否模糊匹配
  isLike?: boolean
}
```