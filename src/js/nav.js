'use strict'
var cookies = require('./cookies')

var openElement = '.js-nav-open'
var closeElement = '.js-nav-close'
var overlayElement = '.js-nav-overlay'
var activeClass = 'is-active'
var el = document.querySelectorAll('.js-nav-container, .js-nav-push, .js-nav-overlay, html, body')

let disableForbiddenLinks = () => {
  let claims = cookies.get('auth-claims')

  if (claims === undefined) claims = ''

  claims = claims.toLowerCase()

  if (claims !== 'superadmin') {
    let navLinks = document.querySelectorAll('.nav__item a')

    for (let i = 0; i < navLinks.length; ++i) {
      let requiredClaims = navLinks[i].getAttribute('data-claims')
      if (requiredClaims !== null) {
        requiredClaims = requiredClaims.split(',')
        for (let j = 0; j < requiredClaims.length; ++j) {
          if (claims.indexOf(requiredClaims[j]) < 0) navLinks[i].parentNode.classList += ' hide'
        }
      }
    }
  }
}

let initEventListeners = () => {
  document.querySelector(openElement).addEventListener('click', function (e) {
    open()
  })

  document.querySelector(closeElement).addEventListener('click', function (e) {
    close()
  })

  document.querySelector(overlayElement).addEventListener('click', function (e) {
    close()
  })
}

var init = function () {
  initEventListeners()
  disableForbiddenLinks()
}

var open = function () {
  for (let i = 0; i < el.length; ++i) {
    el[i].classList.add(activeClass)
  }
}

var close = function () {
  for (let i = 0; i < el.length; ++i) {
    el[i].classList.remove(activeClass)
  }
}

module.exports = {
  init: init,
  open: open,
  close: close
}
