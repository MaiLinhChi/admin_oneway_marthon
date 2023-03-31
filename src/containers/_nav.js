import React from 'react'
import ReduxServices from 'src/common/redux'
import { removeDataLocal } from 'src/common/function'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Users',
    to: '/users',
    icon: <CIcon name="cil-user" customClasses="c-sidebar-nav-icon"/>
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Marathon',
    to: '/marathon',
    icon: <CIcon name='cil-running' customClasses="c-sidebar-nav-icon"/>
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Logout',
    to: '/login',
    onClick: () => {
      removeDataLocal('userAuth')
      ReduxServices.resetUser()
    },
    icon: <CIcon name={'cil-x'} customClasses="c-sidebar-nav-icon"/>
  }
]

export default _nav
