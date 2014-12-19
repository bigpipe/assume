# Assume

[![Version npm][version]](http://browsenpm.org/package/assume)[![Build Status][build]](https://travis-ci.org/bigpipe/assume)[![Dependencies][david]](https://david-dm.org/bigpipe/assume)[![Coverage Status][cover]](https://coveralls.io/r/bigpipe/assume?branch=master)

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

```
npm install --save-dev assume
```

The `--save-dev` flag tells `npm` to automatically add this package and it's
installed version to the `devDependencies` of your module. It's not advised to
install this as an regular dependency as it was only designed to run in test and
`throw` errors when assertions fail.

If you're writing tests for browsers, you should still use `npm` to install this
library as it's compatible with `browserify`.

## Syntax


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
