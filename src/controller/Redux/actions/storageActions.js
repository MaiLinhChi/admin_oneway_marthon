import { KEY_STORE } from 'src/common/constants'
import { saveDataLocal } from 'src/common/function'

export default class StorageActions {
  static setLocale (payload) {
    saveDataLocal(KEY_STORE.SET_LOCALE, payload)
    return {
      type: KEY_STORE.SET_LOCALE,
      payload
    }
  }

  static setUserData (payload) {
    saveDataLocal(KEY_STORE.SET_USER, payload)
    return {
      type: KEY_STORE.SET_USER,
      payload
    }
  }

  static setSetting (payload) {
    saveDataLocal(KEY_STORE.SET_SETTING, payload)
    return {
      type: KEY_STORE.SET_SETTING,
      payload
    }
  }
}
