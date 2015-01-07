# assume

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

## Table of Contents

- [Syntax](#syntax)
- [Configuration](#configuration)
- [Assertion](#assertion)
  - [a, an](#a-an)
  - [instanceOf, instanceof, inherits, inherit](#instanceof-instanceof-inherits-inherit)
  - [include, includes, contain, contains](#include-includes-contain-contains)
  - [ok, okay, truthy, truely](#ok-okay-truthy-truely)
  - [falsely, falsey](#falsely-falsey)
  - [true](#true)
  - [false](#false)
  - [exists, exist](#exists-exist)
  - [length, lengthOf, size](#length-lengthof-size)
  - [empty](#empty)
  - [above, gt, greater, greaterThan](#above-gt-greater-greaterthan)
  - [least, gte, atleast](#least-gte-atleast)
  - [below, lt, less, lessThan](#below-lt-less-lessthan)
  - [most, lte, atmost](#most-lte-atmost)
  - [within, between](#within-between)
  - [hasOwn, own, ownProperty, haveOwnProperty, property, owns, hasown](#hasown-own-ownproperty-haveownproperty-property-owns-hasown)
  - [match, matches](#match-matches)
  - [equal, equals, eq, eqs, exactly](#equal-equals-eq-eqs-exactly)
  - [eql, eqls](#eql-eqls)
  - [either](#either)
  - [throw, throws, fail, fails](#throw-throws-fail-fails)
  - [start, starts, startsWith, startWith](#start-stats-startswith-startwith)
  - [end, ends, endsWith, endWith](#end-ends-endswith-endwith)
  - [closeTo, close, approximately, near](#closeto-close-approximately-near)
- [i.hope](#ihope)

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
- `which`

So you can just write:

```js
assume(100).is.at.most(100);
```

But do note that these aliases are **optionally** so the above example can also
be written as:

```js
assume(100).most(1000);
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

There are various of assertions available. If you want the failed assertion to
include a custom message or reason you can always add this as last argument of
the assertion function.

```js
assume(true).is.false('how odd, true is not a false');
```

The following assertions are available:

#### a, an
 
Asserts if the given value is the correct type. We need to use Object.toString
here because there are some implementation bugs the `typeof` operator:

- Chrome <= 9: /Regular Expressions/ are evaluated to `function`

As well as all common flaws like Arrays being seen as Objects etc. This
eliminates all these edge cases.

```js
assume([]).is.a('array');
```

#### instanceOf, instanceof, inherits, inherit

Asserts that the value is instanceof the given constructor.

```js
function Classy() {}

var classes = new Classy();

assume(classes).is.an.instanceOf(Classy);
```

#### include, includes, contain, contains

Assert that value includes a given value. I know this sounds vague but an
example might be more useful here. It can check this for strings, objects and
arrays.

```js
assume({foo: 'bar'}).contains('foo');
assume('hello world').includes('world');
assume([1,3,4]).contains(1);
```

#### ok, okay, truthy, truely

Assert that the value is truthy.

```js
assume(1).is.ok();
assume(0).is.not.ok();
assume(true).is.ok();
```

#### falsely, falsey

Assert that the value is falsey.

```js
assume(0).is.falsely();
assume(true).is.not.falsey();
assume(null).is.falsely;
```

#### true

Explicitly check that the value is the boolean `true`.

```js
assume(true).true();
```

#### false

Explicitly check that the value is the boolean `false`.

```js
assume(true).true();
```

#### exists, exist

Check if the value not not `null`.

```js
assume('hello').exists();
assume(undefined).exists(); // throws
```

#### length, lengthOf, size

Assert if the given value has the given length. It accepts arrays, strings,
functions, object and anything else that has a `.length` property.

```js
assume({ foo: 'bar' }).has.length(1);
assume([1,2,3,4,5,6]).is.size(6)
```

#### empty

Short hand function for `assume(val).length(0)` so it can check if objects,
arrays, strings are empty.

```js
assume([]).empty();
assume('').empty();
assume({}).empty();

//
// Also works against everything that has a `.length` property
//
localStorage.clear();
assume(localStorage).is.empty();
```

#### above, gt, greater, greaterThan

Assert if the value is above the given value. If you need greater or equal check
out the `least` method. If value to assert is not a number we automatically
extract the length out of it so you can use it check the length of arrays etc.

```js
assume(100).is.above(10);
```

#### least, gte, atleast

Assert if the value is above or equal to the given value. If you just need
greater check out the `above` method. If value to assert is not a number we
automatically extract the length out of it so you can use it check the length of
arrays etc.

```js
assume(100).is.least(10);
assume(100).is.least(100);
```

#### below, lt, less, lessThan

Assert if the value is less than the given value. If you need less or equal
check out the `most` method. If value to assert is not a number we automatically
extract the length out of it so you can use it check the length of arrays etc.

```js
assume(10).is.below(100);
```

#### most, lte, atmost

Assert if the value is less or equal to the given value. If you just need less,
check out the `less` method. If value to assert is not a number we automatically
extract the length out of it so you can use it check the length of arrays etc.

```js
assume(10).is.most(100);
assume(100).is.most(100);
```

#### within, between

Check if the value is between or equal to a given range. If value to assert is
not a number we automatically extract the length out of it so you can use it
check the length of arrays etc.

```js
assume(100).is.between(90, 100);
assume([1, 213, 13, 94, 5, 6, 7]).is.between(2, 10);
```

#### hasOwn, own, ownProperty, haveOwnProperty, property, owns, hasown

Assert that the value has the specified property.

```js
assume({foo: bar}).owns('foo');
```

#### match, matches

Matches the value against a given Regular Expression. If a string is given
instead of an actual Regular Expression we automatically transform it to an `new
RegExp`.

```js
assume('hello world').matches(/world$/);
```

#### equal, equals, eq, eqs, exactly

Assert that given value is strictly (===) equal to the supplied value.

```js
assume('foo').equals('foo');
assume(13424).equals(13424);
```

#### eql, eqls

Assert that the given value deeply equals the supplied value.

```js
assume([1,2]).equals([1,2]);
```

#### either

Assert that the value is either one of the given values. It can be prefixed with
`.deep` for deep assertions.

```js
assume('foo').is.either('bar', 'banana', 'foo');
assume({ foo: 'bar' }).is.either('bar', 'banana', { foo: 'bar' });
```

#### throw, throws, fail, fails

Assert that the given function throws an error. The error can match a string,
regexp or function instance.

```js
function arrow() { throw new Error('you have failed this city'); }

assume(arrow).throws(/failed this city/);
assume(arrow).throws('failed this city');
assume(arrow).does.not.throw('your mom');
assume(function(){}).does.not.throw();
```

#### start, starts, startsWith, startWith

Assert that the value starts with the given string.

```js
assume('foobar').startWith('foo');
```

#### end, ends, endsWith, endWith

Assert that the value ends with the given string.

```js
assume('foor bar, banana').endsWith('ana');
```

#### closeTo, close, approximately, near

Assert a float point number is near a given value within a delta margin.

```js
assume(1.5).is.approximately(1.4, 0.2);
```

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
