import { useEffect, useState } from 'react'
import { IdxDB } from '../../../src'

export const DB_NAME = 'test'

export const useIdxDB = () => {
  const [idxDB, setIdxDB] = useState<IdxDB>()

  useEffect(() => {
    const db = new IdxDB(DB_NAME)
    db.connect().then(() => setIdxDB(db))

    return () => db.close()
  }, [])

  return idxDB
}

export const initDB = async () => {
  await IdxDB.useDB({
    name: DB_NAME,
    version: 3,
    stores: [
      {
        name: 't_user',
        indexes: ['name', 'age'],
        keyPath: 'id',
      },
    ],
  })
}
