import { test } from 'bun:test'
import { IdxDB } from '../src/db'

test('useDB', () => {
  IdxDB.useDB({
    name: 'test',
    version: 1,
    stores: [
      {
        name: 'user',
        indexes: ['name'],
      },
    ],
  })
})
