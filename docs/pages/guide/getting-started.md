# 快速开始

## 安装

::: code-group

```sh [npm]
$ npm add @renzp/idxdb
```

```sh [pnpm]
$ pnpm add @renzp/idxdb
```

```sh [yarn]
$ yarn add @renzp/idxdb
```

```sh [bun]
$ bun add @renzp/idxdb
```

:::


## 使用

```ts
import { IdxDB } from '@renzp/idxdb'

const DB_NAME = "test"

await IdxDB.useDB({
  name: DB_NAME,
  version: 1,
  stores: [
    {
      name: 't_user',
      indexes: ['name', 'age'],
      keyPath: 'id',
    },
  ],
})
const db = new IdxDB(DB_NAME)
await db.connect()
await db?.store('t_user')?.getQuery({ values: {name: 'renzp94'} })
db.close()
```
