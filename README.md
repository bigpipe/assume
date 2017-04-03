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
the `expect` like API that we all know and love. Writing tests should be dead
simple and not cause any annoyances. This library attempts to achieve all of
this.

## Installation

Assume is written with client and server-side JavaScript in mind and uses the
commonjs module system to export it self. The library is released in the public
npm registry and can be installed using:

```
npm install --save-dev assume
```

The `--save-dev` flag tells `npm` to automatically add this `package.json` and it's
installed version to the `devDependencies` of your module.

As code is written against the commonjs module system we also ship a standalone
version in the module which introduces an `assume` global. The standalone
version can be found in the `dist` folder after installation. The dist file is
not commited to GitHub.

## Table of Contents

- [Installation](#installation)
- [Syntax](#syntax)
- [Configuration](#configuration)
- [Feature Detection](#feature-detection)
- [Performance Testing](#performance-testing)
- [Assertion](#assertion)
  - [Keywords](#keywords)
- [API](#api)
  - [a, an](#a-an)
  - [eitherOfType, oneOfType](#eitheroftype-oneoftype)
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
  - [finite, isFinite, finiteness](#finite-isfinite-finiteness)
  - [generator](#generator)
  - [optimisation, optimization](#optimisation-optimization)
  - [optimised, optimized](#optimised-optimized)
  - [start, starts, startsWith, startWith](#start-stats-startswith-startwith)
  - [end, ends, endsWith, endWith](#end-ends-endswith-endwith)
  - [closeTo, close, approximately, near](#closeto-close-approximately-near)
- [i.hope](#ihope)
- [Planning](#planning)
- [Waiting](#waiting)
- [Plugins](#plugins)
  - [Publishing](#publishing)
  - [use](#use)
  - [add](#add)
  - [test](#test)
  - [assign](#assign)
  - [clone](#clone)

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

### Feature Detection

Certain assertions only work in certain JavaScript/EcmaScript environments.
Things like the `generator` assertions only work in ES6 as the `function *` is
invalid syntax. The results of the feature detection is publicly stored in the
`assume.supports` object. You can use this object to add some conditional tests
to your test suite. The following features are currently detected:

- **generators** Are generators supported in the host environment.
- **native** Is V8 native syntax supported.

```js
if (assume.supports.native) {
  it('does things', function () {
    ..
  });
}
```

If you are a plugin author, feel free to add your own feature detections to this
object (as long as you do not override any pre-existing values).

### Performance Testing

The performance testing is only available for environments that use V8 and more
specifically the `--allow-natives-syntax` flags. These flags can be supplied in
[chrome before you start browser][flags]. These flags are necessary to get
access to the V8 internals which expose optimization and de-optimization
information.

If you are running `iojs` or `node` on the server, you can pass in these flags
directly:

```
iojs --allow-natives-syntax
```

#### Mocha

If you are using `mocha` as test runner you usually add `mocha` as executable.
But unfortunately, the `mocha` binary doesn't allow you to pass V8 flags. So
instead of using the `mocha` binary directly you can use the `node` and call the
`_mocha` binary instead:

```
node --allow-natives-syntax --harmony ./node_modules/mocha/bin/_mocha test/test.js
```

You can check if your host environment supports these performance tests by
checking the `assume.supports.native` variable.

### Assertion

There are various of assertions available in assume. If you want the failed
assertion to include a custom message or reason you can **always** add this as last
argument of the assertion function.

```js
assume(true).is.false('how odd, true is not a false');
```

The behaviours of the assertions can be chained using special "flags" or
"prefixes". We currently support the following prefixes.

- `.not`, `.doesnt`, `.dont` Instead of assuming that your assertions assert to
  `true` they will now assert for `false`.
- `.deep`, `.deeply`, `.strict` `.strictly` Instructs the assertions to do a
  **deep** equal, so it checks if the contents match instead of an `object` it
  self matches.

For example:

```js
assume(false).is.not.true();
assume({foo:'bar'}).deep.equals({foo:'bar'});
```

#### Keywords

Now, a special word of caution for those of you who are using this library to
write cross browser tests. Internet Explorer has issues when you use
**keywords** as functions. Using the `true()`, `instanceof()` etc. functions to
assert you will run in to issues. So the rule of thumb here is that if you need
to do cross browser support do not assert with the keyword based names.

## API

Let's take a closer look to all assertions that we're supporting:

#### a, an

Asserts if the given value is the correct type. We need to use Object.toString
here because there are some implementation bugs the `typeof` operator:

- Chrome <= 9: /Regular Expressions/ are evaluated to `function`

As well as all common flaws like Arrays being seen as Objects etc. This
eliminates all these edge cases.

```js
assume([]).is.a('array');
```

[`instanceof` is a keyword and might cause cross browser issues](#keywords)

#### eitherOfType, oneOfType

Asserts if the given value is one of the acceptable types.

The same caveats regarding `typeof` apply as described in [a, an](#a-an).

```js
assume([]).is.oneOfType(['array', 'string']);
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

[`true` is a keyword and might cause cross browser issues](#keywords)

#### false

Explicitly check that the value is the boolean `false`.

```js
assume(false).false();
```

[`false` is a keyword and might cause cross browser issues](#keywords)

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

Assert that the value has the specified property and optionally
deeply check its value.

```js
assume({foo: 'bar'}).owns('foo');
assume({foo: 'bar'}).owns('foo', 'bar');
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
assume([1,2]).eql([1,2]);
```

#### either

Assert that the value is either one of the values of the given array. It can be
prefixed with `.deep` for deep assertions.

```js
assume('foo').is.either(['bar', 'banana', 'foo']);
assume({ foo: 'bar' }).is.either(['bar', 'banana', { foo: 'bar' }]);
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

[`throw` is a keyword and might cause cross browser issues](#keywords)

#### finite, isFinite, finiteness

Assert that the given value is finite.

```js
assume(Infinity).is.finite();
```

If `deep` assertion style is used it will use the much stricter
`Number.isFinite` instead of the regular `isFinite` functionality.

#### generator

Assert that the given value is an EcmaScript 6 based generator.

```js
assume(function *() {}).is.generator();
```

**Please note that this will only work if Generators are enabled in the host
environment or you might end up with false positives**

#### optimisation, optimization

**Please see the [Performance Testing](#performance-testing) section information
to enable these assertions as they require specific V8 flags to be enabled.**

#### optimised, optimized

**Please see the [Performance Testing](#performance-testing) section information
to enable these assertions as they require specific V8 flags to be enabled.**

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

## Planning

The `assume.plan` method allows you to plan the amount of assertions that should
be executed by your test suite. This method accepts 2 arguments:

1. The amount of assertions you expect to run. This should always be an exact
   number.
2. An optional async callback that should be called with error as first argument
   on failure instead of throwing an error. This makes it ideal for async
   testing as you can just pass your continuation function.

The method will return a function that should be called at the end of your
tests. This method will still allow you to pass in an error as first argument so
the supplied callback in second argument will be called directly with it.

When the method is called we will count the amount of assertions that we're
executed. If it's less or more than the supplied amount we will throw an error.

```js
var end = assume.plan(10);

assume(10).equals(10);
end(); // This throws an error as we only executed 1 out of the 10 asserts.
```

And with optional async callback:

```js
next = assume.plan(7, next);

for (var i = 0; i < 10; i++) {
  assume(i).equqls(i);
}

next(); // Also throws an error as we've executed 10 assertions instead of 7.
```

## Waiting

Writing async tests can be hard, especially if you have to juggle with callbacks
and wait untill 2 callbacks are completed before you can continue with the test
suite. The `assume.wait` function helps you with orchestration of tests and
callbacks. The method accepts 3 arguments:

1. The amount of times the returned callback should be called before calling the
   supplied callback.
2. Optionally, the amount of assertions you expect to run. We will wrap the
   returned callback with `assume.plan` this way.
3. Completion callback which is called after the callbacks have been called.

The method will return a function that should be used as callback for your async
tests. It follows an error first callback pattern and instantly calls the
supplied callback once an error has be passed in as error argument.

```js
 it('does async things', function (next) {
   next = assume.wait(2, 4, next);

   asynctask(function (err, data) {
     assume(err).is.a('undefined');
     assume(data).equals('testing');

     next();
   });

   asynctaskfail(function (err, data) {
     assume(err).is.a('undefined');
     assume(data).equals('testing');

     next();
   });
 });
 ```

## Plugins

We've done our best to include a bunch of assertions that should make it easier
to test your code but it's always possible that we're missing assertions or you
just want to eliminate repetition in your code. So we've got a plugin interface
which allows you to extend the `assume` instance with even more assertions.

### Publishing

For the sake of discoverablity ability of your plugins on npm we suggest to either
suffix or prefix your module with `assume` and adding the `assume` keyword in to
your keywords list.

### use

Let's assume that we've want to extend the library with a method for checking
the headers of a passed in HTTP request object. If it was released in npm we
could add it as following:

```js
assume.use(require('assume-headers'));
```

The `use` method returns `assume` so it can be used to chain multiple plugin
calls together:

```js
assume
.use(require('assume-headers'))
.use(require('assume-method'));
```

The `assume-headers` plugin/module should export a function which receives the
assume instance to extend as illustrated by the example below:

```js
module.exports = function plugin(assume, util) {
  /**
   * Assert that the received HTTP request contains a given header.
   *
   * @param {String} name Name of the header that we should have received.
   * @param {String} ms Reason of failure.
   * @returns {Assume}
   * @api public
   */
  assume.add('header', function header(name, msg) {
    var expect = '`'+ util.string(this.value.header)'` to @ have header '+ util.string(name);

    return this.test(name in this.value.headers, msg, expect);
  });
}
```

The plugin receives 2 arguments:

1. A reference to the `assume` instance so it can be extended.
2. Small assertion helper library which contains all the internals we're using.

The helper library contains the following methods:

- **name**, Reference to the `fn.name` module so you extract names from
  functions.
- **get**, Reference to the `get` method of the `pathval` module.
- **string**, Inspection function which safely transforms objects, numbers,
  dates etc. to a string.
- **deep**, A deep assertion if the two argument deeply equal to each other.
- **type**, Extract the type of an object to an lowercase string. Useful for
  detecting the difference between `object`, `array`, `arguments`, `date`,
  `buffer` etc.
- **size**, A function which returns the size of given object or array.
- **each**, Simple iterator which accepts an array/object and calls the supplied
  callback with the value and key/index.
- **nodejs**, Boolean indicating if we are running on `nodejs`.

New flags can be introduced by adding properties to the `flags` object. The
`flags` object has the following structure:

- `key` This is the name of the property which will be added to the `assume`
  instance. The property is set to `false` by default and will be to `true` once
  once of the `flags` is accessed.
- `value` These are the aliases that can be used to the set the property to
  `true`.

For our `.not` flags we've set the following key/value's:

```js
Assert.flags.untrue = 'doesnt, not, dont';
```

Please do note that you should try to limit the amount of flags that you add as
they are quite expensive to process every single time.

Adding new assertions to assume can be done using the following methods:

#### add

The `assume.add` method is a convince method for adding new methods to the
assume prototype. It was created using the [`assign`](#assign) method so it can
automatically add aliases/shorthand's of the method to the prototype in one go.
The method requires 2 arguments:

1. A string which is comma or space separated or an array which contains the
   names of the methods that should be added to the prototype.
2. The function or value that is assigned for all these properties.

```js
module.exports = function (assume, util) {
  util.each(['GET', 'POST', 'PUT', 'DELETE'], function each(method) {
    assume.add(method, function () {
      var expect = '`'+ util.string(this.value.method)+'` to @ be '+ method;

      return this.test(this.value.method === method, msg, expect);
    });
  });
}
```

If you want to add more aliases for the `.function()` method you can simply do
a:

```js
assume.add('execute, executes, exec', function () {
  return this.clone().is.a('function');
});
```

The value to assert is stored in the `value` property of the instance. If the
`deep` flag is set, the `deeply` property is set to `true`.

#### test

This is the method that handles all the assertion passing and failing. It's
_the_ most important method of all. It accepts the following arguments:

- `passed`, a boolean which indicates if the assertion failed or passed.
- `msg`, a string which is the reason or message provided by the users.
- `expectation`, a compiled template which explains what the assertion expected.
- `slice`, a number which slices of stacks from the stack trace. This is keeps
  the stack trace clear of all references to our own assertion library and only
  contains the part of the test/suite where the assertion was initiated. This
  value is optional and defaults to `2` so it removes the `test` and the
  `assertion` from the stack.

If the `assertion` passes the method will return it self, or it will throw.

```js
assume.add('true', function (msg) {
  var expectation = format('value to @ be true');
  return this.test(this.value === true, msg, expectation);
});
```

In example above you might have noticed the odd `@` in the `expection` value.
This is a special character and will be replaced with `not` if the `.not` flag
was used or completely removed (including an extra whitespace at the end).

#### assign

Assign multiple values to a given thing. This method accepts one argument which
is an object or prototype on where we should assign things. It will return a
function that is responsible for the assignment on that given thing. The return
function will require 2 arguments:

1. A string which is comma or space separated or an array which contains the
   names of the methods that should be added to the prototype.
2. The function or value that is assigned for all these properties.

To create your own custom `add` method you could simply do:

```js
var add = assume.assign(assign.prototype);
```

And the `add` function would now do exactly the same as the [`assume.add`](#add)
method.

#### clone

Create an exact clone of the assume instance so it all flags and options are
identical to the current assume instance. The method accepts one optional
argument which is the value it should assert. If nothing is given it uses the
current value.

This can be helpful if you want to run assertions in your assertions so you can
assert while you assert.

```js
// Yo dawg, I herd you like assertions so I put assertions in the assertions so
// you can assert while you assert.

assume.add('something', function somethign(value, msg) {
  this.clone().is.a('string');
  this.clone().is.endsWith('thing');

  return this.test(this.value ==== 'something', msg, 'the value should be something');
});
```

## License

MIT

[flags]: http://www.chromium.org/developers/how-tos/run-chromium-with-flags
