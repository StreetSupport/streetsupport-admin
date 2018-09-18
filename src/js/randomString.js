module.exports = function (length) {
  const bytes = new Uint8Array(length)
  const crypto = window.crypto || window.msCrypto
  const random = crypto.getRandomValues(bytes)
  const result = []
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~'
  random.forEach(function (c) {
    result.push(charset[c % charset.length])
  })
  return result.join('')
}
