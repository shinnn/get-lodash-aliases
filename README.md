# get-lodash-aliases

[![NPM version](https://img.shields.io/npm/v/get-lodash-aliases.svg)](https://www.npmjs.com/package/get-lodash-aliases)
[![Build Status](https://travis-ci.org/shinnn/get-lodash-aliases.svg?branch=master)](https://travis-ci.org/shinnn/get-lodash-aliases)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/get-lodash-aliases.svg)](https://coveralls.io/github/shinnn/get-lodash-aliases?branch=master)
[![dependencies Status](https://david-dm.org/shinnn/get-lodash-aliases/status.svg)](https://david-dm.org/shinnn/get-lodash-aliases)
[![devDependencies Status](https://david-dm.org/shinnn/get-lodash-aliases/dev-status.svg)](https://david-dm.org/shinnn/get-lodash-aliases?type=dev)

A [Node](https://nodejs.org/) module to get alias names of [Lodash](https://lodash.com/) methods from [the latest API document](https://lodash.com/docs/)

```javascript
const getLodashAliases = require('get-lodash-aliases');

getLodashAliases().then(originalNameAliasNameMap => {
  originalNameAliasNameMap;
  /* => {
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
  } */
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install get-lodash-aliases
```

## API

```javascript
const getLodashAliases = require('get-lodash-aliases');
```

### getLodashAliases([*options*])

*options*: `Object` ([gh-get](https://github.com/shinnn/gh-get#ghgeturl--options) options)  
Return: [`Promise`](https://promisesaplus.com/) of `Object`

[Lodash](https://github.com/lodash/lodash) has some alias methods for backward compatibility. For exmaple `_.first` was [renamed](https://github.com/lodash/lodash/commit/e22cb5f3b32de7df85c413f2eb7c2a9e9d6ea7ef) to [`_.head`](https://lodash.com/docs/#head) in [v4.0.0](https://github.com/lodash/lodash/wiki/Changelog#v400) and at the same time re-added as an alias of `_.head`.

This module fetches the latest [Lodash API document](https://github.com/lodash/lodash/blob/master/doc/README.md) via [Github API](https://developer.github.com/v3/), parse it and extract the combination of original method names and alias ones.

The resolved object is in the following form:

```javascript
{
  "originalLodashMethodName": [
    "aliasLodashMethodName",
    // ...
  ],
  // ...
}
```

```javascript
getLodashAliases().then(result => {
  result.head; //=> ['first']
  // This means "`_.head` has one alias: `_.first`.

  result['prototype.value']; //=> ['prototype.toJSON', 'prototype.valueOf']
  // This means `_.prototype.value` has two aliases: `_.prototype.toJSON` and `_.prototype.valueOf`.
});
```

## License

Copyright (c) 2016 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
