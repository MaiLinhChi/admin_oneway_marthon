var events = require('events')
var eventEmitter = new events.EventEmitter()

class Observer {
  constructor () {
    this.listObserver = []
  }

  on (key, func) {
    eventEmitter.on(key, func)
  }

  emit (key, object) {
    eventEmitter.emit(key, object)
  }

  removeListener (key, func) {
    eventEmitter.removeListener(key, func)
  }
}

const instance = new Observer()
Object.freeze(instance)

export default instance
