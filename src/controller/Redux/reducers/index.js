import * as pageReducers from './pageReducers'
import * as storageReducers from './storageReducers'

import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  ...pageReducers,
  ...storageReducers
})

export default rootReducer
