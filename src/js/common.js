var FastClick = require('fastclick')
var nav = require('./../nav.js')
import webFontLoader from 'webfontloader'

let loadWebFonts = () => {
  webFontLoader.load({
    custom: ['museo_sans_rounded300', 'museo_sans_rounded500']
  })
}

nav.init()
FastClick.attach(document.body)
loadWebFonts()
