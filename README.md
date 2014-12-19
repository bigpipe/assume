# Assume

[![From bigpipe.io][from]](http://bigpipe.io)[![Version npm][version]](http://browsenpm.org/package/assume)[![Build Status][build]](https://travis-ci.org/bigpipe/assume)[![Dependencies][david]](https://david-dm.org/bigpipe/assume)[![Coverage Status][cover]](https://coveralls.io/r/bigpipe/assume?branch=master)

[from]: https://img.shields.io/badge/from-bigpipe.io-9d8dff.svg?style=flat-square
[version]: http://img.shields.io/npm/v/assume.svg?style=flat-square
[build]: http://img.shields.io/travis/bigpipe/assume/master.svg?style=flat-square
[david]: https://img.shields.io/david/bigpipe/assume.svg?style=flat-square
[cover]: http://img.shields.io/coveralls/bigpipe/assume/master.svg?style=flat-square

Assume is an `expect` inspired assertion library who's sole purpose is to create
a working and human readable assert library for browsers and node. The library
is designed to work with different assertion styles.

I've been trying out a lot of libraries over the last couple of years and none
of the assertion libraries that I found "tickled my fancy". They either only
worked in node or had really bad browser support. I wanted something that I can
use starting from Internet Explorer 5 to the latest version while maintaining
the `expect` like API that we all know an love. Writing tests should be dead
simple and not cause any annoyances. This library attempts to achieve all of
this.

## Installation

The module is written with browserify and Node.js in mind and can be installed
using:

```
npm install --save-dev assume
```

The `--save-dev` flag tells `npm` to automatically add this package and it's
installed version to the `devDependencies` of your module. It's not advised to
install this as an regular dependency as it was only designed to run in test and
`throw` errors when assertions fail.

## Syntax

We support a lot of different syntaxes and assertion styles. The only thing we
will no (read never) support is the `should` syntax as we will never extend
build-in objects/primitives of JavaScript.

The default syntax that we support is modeled after `expect` so you can replace
any assertion library which implements this API by simply changing the require
to:

```js
var expect = require('assume');

expect('foo').equals('foo');
expect('foo').is.a('string');
```

As you can see in the example above the `is` property is used to make the
assertion more readable. We support the following aliases which allow these kind
of chains:

- `to`
- `be`
- `been`
- `is`
- `and`
- `has`
- `with`
- `that`
- `at`
- `of`
- `some`
- `does`
- `itself`

So you can just write

```js
assume(100).is.at.most(100);
```

### Configuration

The module can be configured globally be changing the properties on the `config`
object:

```js
var assume = require('assume');
assume.config.includeStack = false;
```

Or locally for each assertions by supplying the `assume` function with an
optional configuration object:

```js
assume('foo', { includeStack: false }).is.a('buffer');
```

The following options can be configured:

- **`includeStack`** Should we output a stack trace. Defaults to `true`.
- **`showDIff`** Show difference between the given and expected values. Defaults
  to `true`.

### Assertion

The following assertion are supported in the library:

### i.hope

The asserts we write are assumptions that we receive a given value. While you're
writing tests you hope that they all pass. We could write these tests using an
`i.hope.that(value)` syntax:

```js
var i = require('assume');

i.hope.that('foo').is.a('string');
i.expect.that('foo').is.a('string');
i.assume.that('foo').equals('bar');
i.sincerely.hope.that('foo').is.a('string');
```

## License

MIT
