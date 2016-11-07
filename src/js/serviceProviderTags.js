function all () {
  return [
    { id: 'charity', name: 'Charity' },
    { id: 'no-wrong-door', name: 'No Wrong Door' },
    { id: 'coalition-of-relief', name: 'Coalition of Relief (mcr only)' },
    { id: 'big-change', name: 'Big Change (mcr only)' }
  ]
}

function isTagged (selectedTags, t) {
  return selectedTags !== undefined &&
  selectedTags.indexOf(t.id) >= 0
}

module.exports = {
  all: all,
  isTagged: isTagged
}
