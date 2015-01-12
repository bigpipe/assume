'use strict';

var pretty = require('prettify-error')
  , string = require('object-inspect')
  , displayName = require('fn.name')
  , pathval = require('pathval')
  , nodejs = require('is-node')
  , deep = require('deep-eql');

var called = 0
  , toString = Object.prototype.toString
  , hasOwn = Object.prototype.hasOwnProperty;

/**
 * Get class information for a given type.
 *
 * @param {Mixed} of Type to check.
 * @returns {String} The name of the type.
 * @api private
 */
function type(of) {
  if (Buffer.isBuffer(of)) return 'buffer';
  return toString.call(of).slice(8, -1).toLowerCase();
}

/**
 * Determine the size of a collection.
 *
 * @param {Mixed} collection The object we want to know the size of.
 * @returns {Number} The size of the collection.
 * @api private
 */
function size(collection) {
  var x, i = 0;

  if ('object' === type(collection)) {
    if ('number' === type(collection.length)) return collection.length;

    for (x in collection) {
      if (hasOwn.call(collection, x)) i++;
    }

    return i;
  }

  try { return +collection.length || 0; }
  catch (e) { return 0; }
}

/**
 * Iterate over each item in an array.
 *
 * @param {Array} arr Array to iterate over.
 * @param {Function} fn Callback for each item.
 * @private
 */
function each(arr, fn) {
  for (var i = 0, length = arr.length; i < length; i++) {
    fn(arr[i], i, arr);
  }
}

/**
 * Assert values.
 *
 * Flags:
 *
 * - **untrue**: Assert for a false instead of true.
 * - **deeply**:  Ensure a deep match of the given object.
 * - **stacktrace**: Include stacktrace in the assertion.
 * - **diff**: Attempt to show the difference in object/values so we know why
 *   the assertion failed.
 *
 * @constructor
 * @param {Mixed} value Value we need to assert.
 * @param {Object} flags Assertion flags.
 * @api public
 */
function Assert(value, flags) {
  if (!(this instanceof Assert)) return new Assert(value, flags);
  flags = flags || {};

  this.stacktrace = 'stacktrace' in flags ? flags.stacktrace : Assert.config.includeStack;
  this.diff = 'diff' in flags ? flags.diff : Assert.config.showDiff;

  //
  // These flags are by the alias function so we can generate .not and .deep
  // properties which are basically new Assert instances with these flags set.
  //
  this.untrue = 'untrue' in flags ? flags.untrue : false;
  this.deeply = 'deeply' in flags ? flags.deeply : false;
  this.value = value;

  Assert.assign(this)('to, be, been, is, and, has, have, with, that, at, of, same, does, itself, which');
  Assert.alias(value, this);
}

/**
 * Attempt to mimic the configuration API of chai.js so it's dead simple to
 * migrate from chai.js to assume.
 *
 * @type {Object}
 * @public
 */
Assert.config = {
  includeStack: true,     // mapped to `stacktrace` as default value.
  showDiff: true          // mapped to `diff` as default value.
};

/**
 * Assign values to a given thing.
 *
 * @param {Mixed} where Where do the new properties need to be assigned on.
 * @returns {Function}
 * @api public
 */
Assert.assign = function assign(where) {
  return function assigns(aliases, value) {
    if ('string' === typeof aliases) {
      if (~aliases.indexOf(',')) aliases = aliases.split(/[\s|\,]+/);
      else aliases = [aliases];
    }

    for (var i = 0, length = aliases.length; i < length; i++) {
      where[aliases[i]] = value || where;
    }

    return where;
  };
};

/**
 * Add aliases to the given constructed asserts. This allows us to chain
 * assertion calls together.
 *
 * @param {Mixed} value Value that we need to assert.
 * @param {Assert} assert The constructed assert instance.
 * @returns {Assert} The given assert instance.
 * @api private
 */
Assert.alias = function alias(value, assert) {
  var assign = Assert.assign(assert)
    , flags, flag, prop;

  for (prop in Assert.aliases) {
    if (!hasOwn.call(Assert.aliases, prop)) continue;

    if (!assert[prop]) {
      flags = {};

      for (flag in Assert.aliases) {
        if (!hasOwn.call(Assert.aliases, flag)) continue;
        flags[flag] = assert[flag];
      }

      //
      // Add some default values to the flags.
      //
      flags.stacktrace = assert.stacktrace;
      flags.diff = assert.diff;
      flags[prop] = true;

      assign(Assert.aliases[prop], new Assert(value, flags));
    } else assign(Assert.aliases);
  }

  return assert;
};

/**
 * List of aliases and properties that need to be created for chaining purposes.
 * Plugins could add extra properties that needed to be chained as well.
 *
 * @type {Object}
 * @public
 */
Assert.aliases = {
  untrue: 'doesnt, not, dont',
  deeply: 'deep'
};

/**
 * API sugar of adding aliased prototypes to the Assert. This makes the code
 * a bit more workable and human readable.
 *
 * @param {String|Array} aliases List of methods.
 * @param {Function} fn Actual assertion function.
 * @returns {Assert}
 * @api public
 */
Assert.add = Assert.assign(Assert.prototype);

/**
 * Asserts if the given value is the correct type. We need to use
 * Object.toString here because there are some implementation bugs the `typeof`
 * operator:
 *
 * - Chrome <= 9: /Regular Expressions/ are evaluated to `function`
 *
 * As well as all common flaws like Arrays being seen as Objects etc. This
 * eliminates all these edge cases.
 *
 * @param {String} of Type of class it should equal
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('a, an', function typecheck(of, msg) {
  of = of.toString().toLowerCase();

  var value = type(this.value)
    , expect = value +' to @ be a '+ of;

  return this.test(value === of, msg, expect);
});

/**
 * Asserts that the value is instanceof the given constructor.
 *
 * @param {Function} constructor Constructur the value should inherit from.
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('instanceOf, instanceof, inherits, inherit', function of(constructor, msg) {
  var expect = displayName(this.value) +' to @ be an instanceof '+ displayName(constructor);

  return this.test(this.value instanceof constructor, msg, expect);
});

/**
 * Assert that the value includes the given value.
 *
 * @param {Mixed} val Value to match.
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('include, includes, contain, contains', function contain(val, msg) {
  var includes = false
    , of = type(this.value)
    , expect = '`'+ string(this.value) +'` to @ include '+ val;

  switch (of) {
    case 'array':
      for (var i = 0, length = this.value.length; i < length; i++) {
        if (val === this.value[i]) {
          includes = true;
          break;
        }
      }
    break;

    case 'object':
      if (val in this.value) {
        includes = true;
      }
    break;

    case 'string':
      if (~this.value.indexOf(val)) {
        includes = true;
      }
    break;
  }

  return this.test(includes === true, msg, expect);
});

/**
 * Assert that the value is truthy.
 *
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('ok, okay, truthy, truly', function ok(msg) {
  var expect = '`'+ string(this.value) +'` to @ be truthy';

  return this.test(Boolean(this.value), msg, expect);
});

/**
 * Assert that the value is falsey.
 *
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('falsely, falsey', function nope(msg) {
  var expect = '`'+ string(this.value) +'` to @ be falsely';

  return this.test(Boolean(this.value) === false, msg, expect);
});

/**
 * Assert that the value is `true`.
 *
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('true', function ok(msg) {
  var expect = '`'+ string(this.value) +'` to @ equal (===) true';

  return this.test(this.value === true, msg, expect);
});

/**
 * Assert that the value is `true`.
 *
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('false', function nope(msg) {
  var expect = '`'+ string(this.value) +'` to @ equal (===) false';

  return this.test(this.value === false, msg, expect);
});

/**
 * Assert that the value exists.
 *
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('exists, exist', function exists(msg) {
  var expect = '`'+ string(this.value) +'` to @ exist';

  return this.test(this.value != null, msg, expect);
});

/**
 * Asserts that the value's length is the given value.
 *
 * @param {Number} value Size of the value.
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('length, lengthOf, size', function length(value, msg) {
  var expect = '`'+ string(this.value) +'` to @ have a length of '+ value;

  return this.test(size(this.value) === +value, msg, expect);
});

/**
 * Asserts that the value's length is 0 or doesn't contain any enumerable keys.
 *
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('empty', function empty(msg) {
  var expect = '`'+ string(this.value) +'` to @ be empty';

  return this.test(size(this.value) === 0, msg, expect);
});

/**
 * Assert that the value is greater than the specified value.
 *
 * @param {Number} value The greater than value.
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('above, gt, greater, greaterThan', function above(value, msg) {
  var amount = type(this.value) !== 'number' ? size(this.value) : this.value
    , expect = amount +' to @ be greater than '+ value;

  return this.test(amount > value, msg, expect);
});

/**
 * Assert that the value is equal or greater than the specified value.
 *
 * @param {Number} value The specified value.
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('least, gte, atleast', function least(value, msg) {
  var amount = type(this.value) !== 'number' ? size(this.value) : this.value
    , expect = amount +' to @ be greater or equal to '+ value;

  return this.test(amount >= value, msg, expect);
});

/**
 * Assert that the value starts with the given value.
 *
 * @param {String} value String it should start with.
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('start, starts, startsWith, startWith', function start(value, msg) {
  var expect = string(this.value) +'to @ start with '+ string(value);

  return this.test(0 === this.value.indexOf(value), msg, expect);
});

/**
 * Assert that the value ends with the given value.
 *
 * @param {String} value String it should start with.
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('end, ends, endsWith, endWith', function end(value, msg) {
  var index = this.value.indexOf(value, this.value.length - value.length)
    , expect = string(this.value) +' to @ end with '+ string(value);

  return this.test(index >= 0, msg, expect);
});

/**
 * Assert a floating point number is near the give value within the delta
 * margin.
 *
 * @param {Number} value The specified value.
 * @param {Number} delta Radius.
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('closeTo, close, approximately, near', function close(value, delta, msg) {
  var expect = string(this.value) +'to @ be close to '
               + string(value) +' ±'+ string(delta);

  return this.test(Math.abs(this.value - value) <= delta, msg, expect);
});

/**
 * Assert that the value is below the specified value.
 *
 * @param {Number} value The specified value.
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('below, lt, less, lessThan', function below(value, msg) {
  var amount = type(this.value) !== 'number' ? size(this.value) : this.value
    , expect = amount +' to @ be less than '+ value;

  return this.test(amount < value, msg, expect);
});

/**
 * Assert that the value is below or equal to the specified value.
 *
 * @param {Number} value The specified value.
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('most, lte, atmost', function most(value, msg) {
  var amount = type(this.value) !== 'number' ? size(this.value) : this.value
    , expect = amount +' to @ be less or equal to '+ value;

  return this.test(amount <= value, msg, expect);
});

/**
 * Assert that that value is within the given range.
 *
 * @param {Number} start Lower bound.
 * @param {Number} finish Upper bound.
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('within, between', function within(start, finish, msg) {
  var amount = type(this.value) !== 'number' ? size(this.value) : this.value
    , expect = amount +' to @ be greater or equal to '+ start +' and @ be less or equal to'+ finish;

  return this.test(amount >= start && amount <= finish, msg, expect);
});

/**
 * Assert that the value has an own property with the given prop.
 *
 * @param {String} prop Property name.
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('hasOwn, own, ownProperty, haveOwnProperty, property, owns, hasown', function has(prop, msg) {
  var expect = 'object @ to have own property '+ prop;

  return this.test(hasOwn.call(this.value, prop), msg, expect);
});

/**
 * Asserts that the value matches a regular expression.
 *
 * @param {RegExp} regex Regular expression to match against.
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('match, matches', function test(regex, msg) {
  if ('string' === typeof regex) regex = new RegExp(regex);

  var expect = '`'+ string(this.value) +'` to @ match '+ string(regex);

  return this.test(!!regex.test(this.value), msg, expect);
});

/**
 * Assert that the value equals a given thing.
 *
 * @param {Mixed} thing Thing it should equal.
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('equal, equals, eq, eqs, exactly', function equal(thing, msg) {
  var expect = '`'+ string(this.value) +'` to @ equal (===) '+ string(thing);

  if (!this.deeply) return this.test(this.value === thing, msg, expect);
  return this.eql(thing, msg, 3);
});

/**
 * Assert that the value **deeply** equals a given thing.
 *
 * @param {Mixed} thing Thing it should equal.
 * @param {String} msg Reason of failure.
 * @param {Number} slice Amount of stack traces to slice off.
 * @returns {Assert}
 * @api public
 */
Assert.add('eql, eqls', function eqls(thing, msg, slice) {
  var expect = '`'+ string(this.value) +'` to deeply equal '+ thing;

  return this.test(deep(this.value, thing), msg, expect, slice);
});

/**
 * Assert that the value is either one of the given values.
 *
 * @param {Arguments} .. All the values it can match
 * @returns {Assert}
 * @api public
 */
Assert.add('either', function either() {
  var args = Array.prototype.slice.call(arguments, 0)
    , i = args.length
    , result = false
    , expect = [];

  while (i-- || result) {
    if (!this.deeply) result = this.value === args[i];
    else result = deep(this.value, args[i]);
    if (result) break;

    expect.push(string(args[i]));
  }

  expect = '`'+ string(this.value) +'` to equal either `'+ expect.join('` or `') +'`';
  return this.test(result, '', expect);
});

/**
 * Assert if the given function throws.
 *
 * @param {Mixed} thing Thing it should equal.
 * @param {String} msg Reason of failure.
 * @returns {Assert}
 * @api public
 */
Assert.add('throw, throws, fails, fail', function throws(thing, msg) {
  try { this.value(); }
  catch (e) {
    var message = 'object' === typeof e ? e.message : e;

    switch (type(thing)) {
      case 'string': return this.clone(message).includes(thing, msg);
      case 'regexp': return this.clone(message).matches(thing, msg);
      case 'function': return this.clone(e).instanceOf(thing, msg);
      default: return this.clone(e).equals(thing);
    }
  }

  return this.test(false, msg, 'expected function to @ throw');
});

/**
 * Create a clone of the current assertion instance which has the same
 * configuration but a different value.
 *
 * @param {Mixed} value The new value
 * @returns {Assert}
 * @api private
 */
Assert.add('clone', function clone(value) {
  return new Assert(value || this.value, {
    stacktrace: this.stacktrace,
    untrue: this.untrue,
    deeply: this.deeply,
    diff: this.diff
  });
});

/**
 * Validate the assertion.
 *
 * @param {Boolean} passed Didn't the test pass or fail.
 * @param {String} msg Custom message provided by users.
 * @param {String} expectation What the assertion expected.
 * @param {Number} slice The amount of stack traces we need to remove.
 * @returns {Assert}
 * @api private
 */
Assert.add('test', function test(passed, msg, expectation, slice) {
  called++; // Needed for tracking the amount of executed assertions.

  if (this.untrue) passed = !passed;
  if (passed) return this;

  if (expectation && expectation.indexOf('@')) {
    if (this.untrue) expectation = expectation.replace(/\@\s/g, 'not');
    else expectation = expectation.replace(/\@\s/g, '');
  }

  msg = msg || 'Unknown assertation failure occured';
  slice = slice || 2;

  if (expectation) msg += ', assumed ' + expectation;

  var failure = new Error(msg)
    , err = { message: failure.message, stack: '' };

  if (this.stacktrace) err.stack = failure.stack || err.stack;

  //
  // Clean up the stack by slicing off the parts that are pointless to most
  // people. (Like where it enters this assertion library).
  //
  err.stack = err.stack.split('\n').slice(slice).join('\n') || err.stack;
  err.stack = pretty(err);

  if (nodejs) throw err;

  if ('object' === typeof console && 'function' === typeof console.error) {
    console.error(err.stack);
  }

  throw failure;
});

/**
 * Plan for the amount of assertions that needed to run. This is great way to
 * figure out if you have edge cases in your code which prevented an assertion or
 * callback from running.
 *
 * ```js
 * it('run a lot of assertions', function (next) {
 *   next = assume.run(10, next);
 * });
 * ```
 *
 * @param {Number} tests The amount of assertions you expect to run.
 * @param {Function} fn Optional completion callback which receives the error.
 * @returns {Function} Completion callback.
 * @api public
 */
Assert.plan = function plan(tests, fn) {
  fn = fn || function next(err) {
    if (err) throw err;
  };

  var atm = called;

  return function validate(err) {
    var ran = called - atm
      , msg;

    if (err) return fn(err);
    if (tests === ran) return fn();

    msg = [
      'We ran',
      ran - tests,
      ran > tests ? 'more' : 'less',
      'assertations than the expected',
      tests
    ];

    fn(new Error(msg.join(' ')));
  };
};

//
// Create type checks for all build-in JavaScript classes.
//
each(('new String,new Number,new Array,new Date,new Error,new RegExp,new Boolean,'
  + 'new Float32Array,new Float64Array,new Int16Array,new Int32Array,new Int8Array,'
  + 'new Uint16Array,new Uint32Array,new Uint8Array,new Uint8ClampedArray,'
  + 'new ParallelArray,new Map,new Set,new WeakMap,new WeakSet,'
  + 'new DataView(new ArrayBuffer(1)),new ArrayBuffer(1),new Promise(function(){}),'
  + 'new Blob,arguments,null,undefined,new Buffer(1)').split(','), function iterate(code) {
  var name, arg;

  //
  // Not all of these constructors are supported in the browser, we're going to
  // compile dedicated functions that returns a new instance of the given
  // constructor. If it's not supported the code will throw and we will simply
  // return.
  //
  try { arg = (new Function('return '+ code))(); }
  catch (e) { return; }

  name = type(arg);

  Assert.add(name, function typecheck(msg) {
    var of = type(this.value)
      , expect = of +' to @ be an '+ name;

    return this.test(of === name, msg, expect, 3);
  });
});

//
// Introduce an alternate API:
//
// ```js
// var i = require('assume');
//
// i.assume.that('foo').equals('bar');
// i.sincerely.hope.that('foo').equals('bar');
// i.expect.that('foo').equals('bar');
// ```
//
Assert.hope = { that: Assert };
Assert.assign(Assert)('sincerely, expect');
Assert.assign(Assert)('assume, expect', Assert.hope);

//
// Expose the module.
//
module.exports = Assert;
