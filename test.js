'use strict';

const getLodashAliases = require('.');
const test = require('tape');

test('getLodashAliases()', t => {
  t.plan(8);

  getLodashAliases().then(result => {
    t.deepEqual(result, {
      head: ['first'],
      forEach: ['each'],
      forEachRight: ['eachRight'],
      assignIn: ['extend'],
      assignInWith: ['extendWith'],
      toPairs: ['entries'],
      toPairsIn: ['entriesIn'],
      'prototype.value': [
        'prototype.toJSON',
        'prototype.valueOf'
      ]
    }, 'should get aliases of the latest Lodash.');
  }).catch(t.fail);

  getLodashAliases({
    qs: {},
    token: '__invalid_token__'
  }).then(t.fail, err => {
    t.strictEqual(
      err.message,
      '401 Unauthorized (Bad credentials)',
      'should fail when it cannot get the Lodash document.'
    );
  }).catch(t.fail);

  getLodashAliases({
    qs: {
      ref: 'es',
      path: 'lodash.js'
    }
  }).then(t.fail, err => {
    t.strictEqual(err.name, 'TypeError', 'should fail when it takes `ref` and `path` parameters.');
    t.ok(
      err.message.includes('doesn\'t allow to change `ref` and `path` parameter'),
      'should explain why `ref` and `path` parameters are invalid.'
    );
  }).catch(t.fail);

  getLodashAliases({
    qs: {
      ref: 'npm-packages'
    }
  }).then(t.fail, err => {
    t.strictEqual(err.name, 'TypeError', 'should fail when it takes `ref` parameter.');
    t.ok(
      err.message.includes('doesn\'t allow to change `ref` parameter'),
      'should explain why `ref` parameter is invalid.'
    );
  }).catch(t.fail);

  getLodashAliases({
    qs: {
      path: '.editorconfig'
    }
  }).then(t.fail, err => {
    t.strictEqual(err.name, 'TypeError', 'should fail when it takes `path` parameter.');
    t.ok(
      err.message.includes('doesn\'t allow to change `path` parameter'),
      'should explain why `path` parameter is invalid.'
    );
  }).catch(t.fail);
});
