
import localStorage from '../../localStorage'
import { storageKeys } from './webAuth'
import nav from '../../nav'

module.exports = function () {
  Object.keys(storageKeys)
    .forEach(k => localStorage.remove(storageKeys[k]))
  nav.disableForbiddenLinks()
}
