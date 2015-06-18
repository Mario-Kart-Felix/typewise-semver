var semver = require('semver')

exports.parse = function (s) {
  var v = typeof s === 'string' ? semver.parse(s) : s
  var a = [ v.major, v.minor, v.patch ].concat(v.prerelease)

  // if prerelease tag without associated version, sort first amonst tags
  if (a[3] !== undefined && a[4] === undefined) {
    a[4] = null
  }
  return a
}

exports.stringify = function (a) {
  var v = a.slice(0, 3).join('.')
  if (a[3] != null) {
    v += '-' + a[3]
    if (a[4] != null) {
      v += '.' + a[4]
    }
  }
  return v
}
