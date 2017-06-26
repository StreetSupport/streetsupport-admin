var FastClick = require('fastclick')
var nav = require('./nav.js')

import 'babel-polyfill'

nav.init()
FastClick.attach(document.body)
