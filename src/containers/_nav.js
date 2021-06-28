import React from 'react'
import ReduxServices from 'src/common/redux'
import { removeDataLocal } from 'src/common/function'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>
  },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'CDP',
  //   to: '/cdp',
  //   icon: <CIcon name="cil-pencil" customClasses="c-sidebar-nav-icon"/>,
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Vaults',
  //       to: '/cdp/vaults',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Liquidating',
  //       to: '/cdp/liquidating',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Liquidated',
  //       to: '/cdp/liquidated',
  //     }
  //   ]
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'History',
  //   to: '/history',
  //   icon: <CIcon name="cil-spreadsheet" customClasses="c-sidebar-nav-icon"/>,
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Create CDP / Deposit',
  //       to: '/history/deposit',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Generate',
  //       to: '/history/generate',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Payback',
  //       to: '/history/payback',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Withdraw',
  //       to: '/history/withdraw',
  //     },
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Announcement',
  //   to: '/announcement',
  //   icon: <CIcon name="cil-bell" customClasses="c-sidebar-nav-icon"/>,
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'List announcement',
  //       to: '/announcement',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Add new announcement',
  //       to: '/announcement/add',
  //     },
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Voting',
  //   to: '/voting',
  //   icon: <CIcon name="cil-list" customClasses="c-sidebar-nav-icon"/>,
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'List Voting',
  //       to: '/voting/list-voting',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Creating Vote',
  //       to: '/voting/create-voting',
  //     }
  //   ]
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Staking',
  //   to: '/staking',
  //   icon: <CIcon name="cil-star" customClasses="c-sidebar-nav-icon"/>,
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'History',
  //       to: '/staking/history',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Send reward',
  //       to: '/staking/reward',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Setting minimum stake',
  //       to: '/staking/setting',
  //     },
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Setting',
  //   route: '/setting',
  //   icon: <CIcon name="cil-settings" customClasses="c-sidebar-nav-icon"/>,
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Voter',
  //       to: '/setting/voting',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'CDP',
  //       to: '/setting/cdp',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Logs',
  //       to: '/setting/history',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Mint TAI',
  //       to: '/setting/mint',
  //     },
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Lock system',
  //   to: '/lock',
  //   icon: <CIcon name="cil-warning" customClasses="c-sidebar-nav-icon"/>
  // },
  // {
  //   _tag: 'CSidebarNavDivider'
  // },
  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Extras'],
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Documents',
  //   to: '/documents',
  //   icon: <CIcon name="cil-print" customClasses="c-sidebar-nav-icon"/>
  // },
  {
    _tag: 'CSidebarNavItem',
    name: 'Account',
    to: '/account',
    icon: <CIcon name="cil-star" customClasses="c-sidebar-nav-icon"/>
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
