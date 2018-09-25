import test from 'tape'
import { match, matchDocument } from './'

test('utils.match', assert => {
  assert.plan(3)

  assert.equal(
    match('foo')('bar')({ object: 'foo', type: 'bar' }),
    true,
    'returns true if both object and type of the passed object match the premise'
  )

  assert.equal(
    match('foo')('bar')({ object: 'bar', type: 'bar' }),
    false,
    'returns false if object doesn\'t match the premise'
  )

  assert.equal(
    match('foo')('bar')({ object: 'foo', type: 'foo' }),
    false,
    'returns false if type doesn\'t match the premise'
  )
})

test('utils.matchDocument', assert => {
  assert.plan(2)

  assert.equal(
    matchDocument({ object: 'document' }),
    true,
    'returns true if object is `document`'
  )

  assert.equal(
    matchDocument({ object: 'foo' }),
    false,
    'returns false if object is not `document`'
  )
})
