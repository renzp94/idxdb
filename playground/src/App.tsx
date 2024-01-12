import React, { useState } from 'react'
import DemoPage from './DemoPage'
import { CenterSpin } from './components'
import { initDB } from './utils/db'

const App = () => {
  const [dbLoading, setDbLoading] = useState(true)

  initDB().finally(() => {
    setDbLoading(false)
  })

  return dbLoading ? <CenterSpin tip="indexedDB初始化中..." /> : <DemoPage />
}

export default App
