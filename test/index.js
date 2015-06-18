var bytewise = require('bytewise-core')
var test = require('tape')

var serialization = require('../')
var parse = serialization.parse
var stringify = serialization.stringify

// Fisher–Yates shuffle
// TODO: add typewise-core dep, get from there
function shuffle(o) {
  for (var j, x, i = o.length; i; j = parseInt(Math.random() * i, 10), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};


var values = {
  '0.0.0': [ 0, 0, 0, undefined ],
  '0.0.1': [ 0, 0, 1, undefined ],
  '0.0.2': [ 0, 0, 2, undefined ],
  '0.0.10': [ 0, 0, 10, undefined ],
  '0.0.100': [ 0, 0, 100, undefined ],
  '0.1.0': [ 0, 1, 0, undefined ],
  '0.1.1': [ 0, 1, 1, undefined ],
  '0.1.2': [ 0, 1, 2, undefined ],
  '0.1.10': [ 0, 1, 10, undefined ],
  '0.1.100': [ 0, 1, 100, undefined ],
  '0.2.0': [ 0, 2, 0, undefined ],
  '0.2.1': [ 0, 2, 1, undefined ],
  '0.2.2': [ 0, 2, 2, undefined ],
  '0.2.10': [ 0, 2, 10, undefined ],
  '0.2.100': [ 0, 2, 100, undefined ],
  '0.9.0': [ 0, 9, 0, undefined ],
  '0.9.1': [ 0, 9, 1, undefined ],
  '0.9.2': [ 0, 9, 2, undefined ],
  '0.9.10': [ 0, 9, 10, undefined ],
  '0.9.100': [ 0, 9, 100, undefined ],
  '0.10.0': [ 0, 10, 0, undefined ],
  '0.10.1': [ 0, 10, 1, undefined ],
  '0.10.2': [ 0, 10, 2, undefined ],
  '0.10.10': [ 0, 10, 10, undefined ],
  '0.10.100': [ 0, 10, 100, undefined ],
  '1.0.0': [ 1, 0, 0, undefined ],
  '1.0.1': [ 1, 0, 1, undefined ],
  '1.0.2': [ 1, 0, 2, undefined ],
  '1.0.10': [ 1, 0, 10, undefined ],
  '1.0.100': [ 1, 0, 100, undefined ],
  '1.1.0': [ 1, 1, 0, undefined ],
  '1.1.1': [ 1, 1, 1, undefined ],
  '1.1.2': [ 1, 1, 2, undefined ],
  '1.1.10': [ 1, 1, 10, undefined ],
  '1.1.100': [ 1, 1, 100, undefined ],
  '1.2.0': [ 1, 2, 0, undefined ],
  '1.2.1': [ 1, 2, 1, undefined ],
  '1.2.2': [ 1, 2, 2, undefined ],
  '1.2.3-0': [ 1, 2, 3, 0, null ],
  '1.2.3-0.0': [ 1, 2, 3, 0, 0 ],
  '1.2.3-0.1': [ 1, 2, 3, 0, 1 ],
  '1.2.3-0.2': [ 1, 2, 3, 0, 2 ],
  '1.2.3-0.10': [ 1, 2, 3, 0, 10 ],
  '1.2.3-0.100': [ 1, 2, 3, 0, 100 ],
  '1.2.3-1': [ 1, 2, 3, 1, null ],
  '1.2.3-1.0': [ 1, 2, 3, 1, 0 ],
  '1.2.3-1.1': [ 1, 2, 3, 1, 1 ],
  '1.2.3-1.2': [ 1, 2, 3, 1, 2 ],
  '1.2.3-1.10': [ 1, 2, 3, 1, 10 ],
  '1.2.3-1.100': [ 1, 2, 3, 1, 100 ],
  '1.2.3-2': [ 1, 2, 3, 2, null ],
  '1.2.3-2.0': [ 1, 2, 3, 2, 0 ],
  '1.2.3-2.1': [ 1, 2, 3, 2, 1 ],
  '1.2.3-2.2': [ 1, 2, 3, 2, 2 ],
  '1.2.3-2.10': [ 1, 2, 3, 2, 10 ],
  '1.2.3-2.100': [ 1, 2, 3, 2, 100 ],
  '1.2.3-10': [ 1, 2, 3, 10, null ],
  '1.2.3-10.0': [ 1, 2, 3, 10, 0 ],
  '1.2.3-10.1': [ 1, 2, 3, 10, 1 ],
  '1.2.3-10.2': [ 1, 2, 3, 10, 2 ],
  '1.2.3-10.10': [ 1, 2, 3, 10, 10 ],
  '1.2.3-10.100': [ 1, 2, 3, 10, 100 ],
  '1.2.3-100': [ 1, 2, 3, 100, null ],
  '1.2.3-100.0': [ 1, 2, 3, 100, 0 ],
  '1.2.3-100.1': [ 1, 2, 3, 100, 1 ],
  '1.2.3-100.2': [ 1, 2, 3, 100, 2 ],
  '1.2.3-100.10': [ 1, 2, 3, 100, 10 ],
  '1.2.3-100.100': [ 1, 2, 3, 100, 100 ],
  '1.2.3-alpha': [ 1, 2, 3, 'alpha', null ],
  '1.2.3-alpha.0': [ 1, 2, 3, 'alpha', 0 ],
  '1.2.3-alpha.1': [ 1, 2, 3, 'alpha', 1 ],
  '1.2.3-alpha.2': [ 1, 2, 3, 'alpha', 2 ],
  '1.2.3-alpha.10': [ 1, 2, 3, 'alpha', 10 ],
  '1.2.3-alpha.100': [ 1, 2, 3, 'alpha', 100 ],
  '1.2.3-beta': [ 1, 2, 3, 'beta', null ],
  '1.2.3-beta.0': [ 1, 2, 3, 'beta', 0 ],
  '1.2.3-beta.1': [ 1, 2, 3, 'beta', 1 ],
  '1.2.3-beta.2': [ 1, 2, 3, 'beta', 2 ],
  '1.2.3-beta.10': [ 1, 2, 3, 'beta', 10 ],
  '1.2.3-beta.100': [ 1, 2, 3, 'beta', 100 ],
  '1.2.3-pr': [ 1, 2, 3, 'pr', null ],
  '1.2.3-pr.0': [ 1, 2, 3, 'pr', 0 ],
  '1.2.3-pr.1': [ 1, 2, 3, 'pr', 1 ],
  '1.2.3-pr.2': [ 1, 2, 3, 'pr', 2 ],
  '1.2.3-pr.9': [ 1, 2, 3, 'pr', 9 ],
  '1.2.3-pr.10': [ 1, 2, 3, 'pr', 10 ],
  '1.2.3-pr.100': [ 1, 2, 3, 'pr', 100 ],
  '1.2.3-pre': [ 1, 2, 3, 'pre', null ],
  '1.2.3-pre.0': [ 1, 2, 3, 'pre', 0 ],
  '1.2.3-pre.1': [ 1, 2, 3, 'pre', 1 ],
  '1.2.3-pre.2': [ 1, 2, 3, 'pre', 2 ],
  '1.2.3-pre.9': [ 1, 2, 3, 'pre', 9 ],
  '1.2.3-pre.10': [ 1, 2, 3, 'pre', 10 ],
  '1.2.3-pre.100': [ 1, 2, 3, 'pre', 100 ],
  '1.2.3': [ 1, 2, 3, undefined ],
  '1.2.4': [ 1, 2, 4, undefined ],
  '1.2.9': [ 1, 2, 9, undefined ],
  '1.2.10': [ 1, 2, 10, undefined ],
  '1.2.100': [ 1, 2, 100, undefined ],
  '1.3.0': [ 1, 3, 0, undefined ],
  '1.3.1': [ 1, 3, 1, undefined ],
  '1.3.2': [ 1, 3, 2, undefined ],
  '1.3.10': [ 1, 3, 10, undefined ],
  '1.3.100': [ 1, 3, 100, undefined ],
  '1.9.0': [ 1, 9, 0, undefined ],
  '1.10.0': [ 1, 10, 0, undefined ],
  '1.100.0': [ 1, 100, 0, undefined ],
  '2.0.0': [ 2, 0, 0, undefined ],
  '2.1.0': [ 2, 1, 0, undefined ],
  '2.2.0': [ 2, 2, 0, undefined ],
  '2.10.0': [ 2, 10, 0, undefined ],
  '2.100.0': [ 2, 100, 0, undefined ],
  '10.0.0': [ 10, 0, 0, undefined ],
  '10.1.0': [ 10, 1, 0, undefined ],
  '10.2.0': [ 10, 2, 0, undefined ],
  '10.10.0': [ 10, 10, 0, undefined ],
  '10.100.0': [ 10, 100, 0, undefined ],
  '100.0.0': [ 100, 0, 0, undefined ],
  '100.1.0': [ 100, 1, 0, undefined ],
  '100.2.0': [ 100, 2, 0, undefined ],
  '100.10.0': [ 100, 10, 0, undefined ],
  '100.100.0': [ 100, 100, 0, undefined ],
}

var expected = Object.keys(values)
var shuffled = shuffle(expected.slice())

test('round tripping', function (t) {
  expected.forEach(function (key) {
    t.equal(stringify(parse(key)), key, 'equal')
  })
  t.end()
})

test('shuffled and sorted', function (t) {
  shuffled
    .map(function (key) { return values[key] })
    .map(bytewise.encode)
    .sort(bytewise.compare)
    .map(bytewise.decode)
    .forEach(function (v, i) {
      var key = expected[i]
      t.deepEqual(v, values[key])
      t.equal(stringify(v), key)
    })
  t.end()
})





