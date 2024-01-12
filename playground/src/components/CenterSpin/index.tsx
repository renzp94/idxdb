import { Spin, SpinProps } from 'antd'
import React from 'react'
import './index.less'

const CenterSpin = (props: SpinProps) => {
  return (
    <div className="center-spin">
      <Spin {...props} fullscreen />
    </div>
  )
}

export default CenterSpin
