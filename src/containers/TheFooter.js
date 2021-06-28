import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a href="tomo.finance" target="_blank" rel="noopener noreferrer">TomoFinance</a>
        <span className="ml-1">&copy; 2021</span>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
