function all () {
  return [
    'Charity',
    'No Wrong Door',
    'Coalition of Relief',
    'Big Change'
  ]
}
function urlEncoded (t) {
  return t.replace(/ /g, '-').toLowerCase()
}
function isTagged (selectedTags, t) {
  return selectedTags !== undefined &&
  selectedTags.indexOf(urlEncoded(t)) >= 0
}

module.exports = {
  all: all,
  isTagged: isTagged,
  urlEncoded: urlEncoded
}
