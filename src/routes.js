import React from 'react'

const User = React.lazy(() => import('./views/user'));
const Marathon = React.lazy(() => import('./views/marathon'));

const routes = [
  { path: '/', exact: true, name: 'User', component: User },
  { path: '/users', name: 'Users', component: User },
  { path: '/marathon', name: 'Marathon', component: Marathon },
]

export default routes
