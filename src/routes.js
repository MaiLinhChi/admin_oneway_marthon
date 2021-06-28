import React from 'react'

const Account = React.lazy(() => import('./views/account'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/account', name: 'Account', component: Account },
]

export default routes
