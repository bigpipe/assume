//
// This should be out-side of the `use strict` statement so our `this` value
// is set to the global or window instead of `undefined`.
//
if ('undefined' === typeof global) global = (function that() {
  return this;
}());

describe('Assertions', function assertions() {
  'use strict';

  var assume = require('../');

  if ('stackTraceLimit' in Error) it('can configure the amount stacks to slice off', function (next) {
    Error.stackTraceLimit = 5;

    var assumption = assume('foo');
    assumption.sliceStack = 3;

    try { assumption.equals('bar'); }
    catch (e) {
      var stack = e.stack.split('\n')
        , ats = 0;

      //
      // We need to count the `ats` as in Node we also include the failing line
      // of code.
      //
      for (var i = 0; i < stack.length; i++) {
        if (stack[i].trim().indexOf('at ') === 0) {
          ats++;
        }
      }

      assume(ats).equals(3);

      //
      // Reset value again to normal level.
      //
      Error.stackTraceLimit = 10;
      next();
    }
  });

  it('throw Error instances', function (next) {
    try { assume('foo').equals('bar'); }
    catch (e) {
      assume(e).is.instanceOf(Error);
      next();
    }
  });

  describe('#csliceStacklone', function () {
    it('increases slice for each clone', function () {
      var a = assume('x')
        , b = a.clone('b');

      a.equals('x');
      b.equals('b');

      assume(b.sliceStack).to.equal(a.sliceStack + 1);
      assume(b.clone().sliceStack).to.equal(a.sliceStack + 2);
    });

    it('defaults to the same value if no clone value is provided', function () {
      var a = assume('x');

      a.clone().equals('x');
    });

    it('can clone falsy values', function () {
      var a = assume('x');

      a.clone('').equals('');
      a.clone(null).equals(null);
      a.clone(undefined).equals(undefined);
      a.clone(false).equals(false);
      a.clone(0).equals(0);
    });
  });

  describe('#a', function () {
    it('is aliased as `an`', function () {
      var x = assume('foo');

      if (x.a !== x.an) throw new Error('Incorrectly aliased');
    });

    it('classifies NaN', function (next) {
      assume(NaN).to.be.a('nan');

      try { assume('foo').to.be.a('nan'); }
      catch (e) { next(); }
    });

    it('classifies undefined', function (next) {
      assume(undefined).to.be.a('undefined');
      assume(void 0).to.be.a('undefined');

      try { assume(null).to.be.a('undefined'); }
      catch (e) { next(); }
    });

    it('classifies undefined', function (next) {
      assume(null).to.be.a('null');

      try { assume(undefined).to.be.a('null'); }
      catch (e) { next(); }
    });

    it('classifies arguments', function (next) {
      assume(arguments).to.be.a('arguments');

      try { assume(null).to.be.a('arguments'); }
      catch (e) { next(); }
    });

    it('classifies strings', function (next) {
      assume(String('foo')).to.be.a('string');
      assume('string').to.be.a('string');

      try { assume(['array']).to.be.a('string'); }
      catch (e) { next(); }
    });

    it('classifies numbers', function (next) {
      assume(Number('0.1')).to.be.a('number');
      assume(0).to.be.a('number');

      try { assume(['array']).to.be.a('number'); }
      catch (e) { next(); }
    });

    it('classifies arrays', function (next) {
      assume(new Array(99)).to.be.a('array');
      assume([]).to.be.a('array');

      try { assume(arguments).to.be.a('array'); }
      catch (e) { next(); }
    });

    it('classifies dates', function (next) {
      assume(new Date()).to.be.a('date');

      try { assume('2014/04/04').to.be.a('date'); }
      catch (e) { next(); }
    });

    it('classifies errors', function (next) {
      assume(new Error('foo')).to.be.a('error');

      try { assume('foo').to.be.a('error'); }
      catch (e) { next(); }
    });

    it('classifies regexps', function (next) {
      assume(new RegExp('foo', 'm')).to.be.a('regexp');
      assume(/foo/).to.be.a('regexp');

      try { assume('/regexp/').to.be.a('regexp'); }
      catch (e) { next(); }
    });

    it('classifies booleans', function (next) {
      assume(Boolean(0)).to.be.a('boolean');
      assume(Boolean(1)).to.be.a('boolean');
      assume(false).to.be.a('boolean');
      assume(true).to.be.a('boolean');

      try { assume('true').to.be.a('boolean'); }
      catch (e) { next(); }
    });

    if (global.Buffer) it('classifies buffers', function (next) {
      assume(new Buffer(0)).to.be.a('buffer');

      try { assume({}).to.be.a('buffer'); }
      catch (e) { next(); }
    });

    if (global.Float32Array) it('classifies float32arrays', function (next) {
      assume(new Float32Array(2)).to.be.a('float32array');

      try { assume([]).to.be.a('float32array'); }
      catch (e) { next(); }
    });

    if (global.Float64Array) it('classifies float64arrays', function (next) {
      assume(new Float64Array(2)).to.be.a('float64array');

      try { assume([]).to.be.a('float64array'); }
      catch (e) { next(); }
    });

    if (global.Int16Array) it('classifies int16arrays', function (next) {
      assume(new Int16Array()).to.be.a('int16array');

      try { assume([]).to.be.a('int16array'); }
      catch (e) { next(); }
    });

    if (global.Int32Array) it('classifies int32arrays', function (next) {
      assume(new Int32Array()).to.be.a('int32array');

      try { assume(new Int16Array()).to.be.a('int32array'); }
      catch (e) { next(); }
    });

    if (global.Int8Array) it('classifies int8arrays', function (next) {
      assume(new Int8Array()).to.be.a('int8array');

      try { assume([]).to.be.a('int8array'); }
      catch (e) { next(); }
    });

    if (global.Uint16Array) it('classifies uint16arrays', function (next) {
      assume(new Uint16Array()).to.be.a('uint16array');

      try { assume(new Int16Array()).to.be.a('uint16array'); }
      catch (e) { next(); }
    });

    if (global.Uint32Array) it('classifies uint32arrays', function (next) {
      assume(new Uint32Array()).to.be.a('uint32array');

      try { assume(new Uint16Array()).to.be.a('uint32array'); }
      catch (e) { next(); }
    });

    if (global.Uint8Array) it('classifies uint8arrays', function (next) {
      assume(new Uint8Array()).to.be.a('uint8array');

      try { assume([]).to.be.a('uint8array'); }
      catch (e) { next(); }
    });
  });

  describe('#instanceof', function () {
    function Foo() {}
    function Bar() {}

    it('is aliased as `instanceOf`, `inherit`, `inherits`', function () {
      var foo = new Foo()
        , x = assume(foo);

      if (
           x.instanceOf !== x.instanceof
        || x.inherit !== x.instanceof
        || x.inherits !== x.instanceof
      ) throw new Error('Incorrectly aliased');
    });

    it('correctly checks the instance', function (next) {
      assume(new Foo).is.instanceOf(Foo);

      try { assume(new Foo).is.instanceOf(Bar); }
      catch (e) { next(); }
    });
  });

  describe('#includes', function () {
    it('is aliased as `instanceOf`, `inherit`, `inherits`', function () {
      var x = assume('aaaabe');

      if (
           x.include !== x.includes
        || x.contain !== x.includes
        || x.contains !== x.includes
      ) throw new Error('Incorrectly aliased');
    });

    it('check if a key in an object', function (next) {
      var obj = { foo: 'bar' };

      assume(obj).includes('foo');

      try { assume(obj).includes('bar'); }
      catch (e) { next(); }
    });

    it('chars are in a given string', function (next) {
      var string = 'hello world i like apples AND cows';

      assume(string).includes('hello');
      assume(string).includes('AND');

      try { assume(string).includes('farts'); }
      catch (e) { next(); }
    });

    it('check array indexes', function (next) {
      var arr = [1, 3, 5, 9, 0];

      assume(arr).includes(3);
      assume(arr).includes(0);

      try { assume(arr).includes(7); }
      catch (e) { next(); }
    });
  });

  describe('#ok', function () {
    it('is aliased as `truthy`, `truly`, `okay`', function () {
      var x = assume('aaaabe');

      if (
           x.ok !== x.truthy
        || x.ok !== x.truly
        || x.ok !== x.okay
      ) throw new Error('Incorrectly aliased');
    });

    it('is ok', function (next) {
      assume(1).is.ok();
      assume(2).is.ok();
      assume('f').is.ok();
      assume([]).is.ok();
      assume(true).is.ok();

      try { assume(0).is.ok(); }
      catch (e) {
        try { assume(null).is.ok(); }
        catch (e) {
          try { assume(undefined).is.ok(); }
          catch (e) {
            try { assume('').is.ok(); }
            catch (e) {
              next();
            }
          }
        }
      }
    });
  });

  describe('#falsely', function () {
    it('is aliased as `falsey` and `falsy`', function () {
      var x = assume('aaaabe');

      if (
           x.falsely !== x.falsey
        || x.falsely !== x.falsy
      ) throw new Error('Incorrectly aliased');
    });

    it('is falsely', function (next) {
      assume(0).is.falsely();
      assume('').is.falsely();
      assume(null).is.falsely();
      assume(undefined).is.falsely();
      assume(false).is.falsely();

      try { assume(1).is.falsely(); }
      catch (e) {
        try { assume('fo').is.falsely(); }
        catch (e) {
          try { assume([]).is.falsely(); }
          catch (e) {
            try { assume(true).is.falsely(); }
            catch (e) {
              next();
            }
          }
        }
      }
    });
  });

  describe('#true', function () {
    it('only checks booleans', function (next) {
      assume(true).is.true();

      try { assume(false).is.true(); }
      catch (e) {
        try { assume(1).is.true(); }
        catch (e) {
          try { assume([]).is.true(); }
          catch (e) { next(); }
        }
      }
    });
  });

  describe('#false', function () {
    it('only checks booleans', function (next) {
      assume(false).is.false();

      try { assume(true).is.false(); }
      catch (e) {
        try { assume(0).is.false(); }
        catch (e) {
          try { assume(undefined).is.false(); }
          catch (e) { next(); }
        }
      }
    });
  });

  describe('#exists', function () {
    it('is aliased as `exist`', function () {
      var x = assume('aaaabe');

      if (x.exists !== x.exist) throw new Error('Incorrectly aliased');
    });

    it('checks if values are not null', function (next) {
      assume(1).exists();
      assume(0).exists();
      assume(false).exists();
      assume('').exists();

      try { assume(null).exists(); }
      catch (e) {
        try { assume(undefined).exists(); }
        catch (e) { next(); }
      }
    });
  });

  describe('#length', function () {
    it('is aliased as `lengthOf`, `size`', function () {
      var x = assume('aaaabe');

      if (
           x.length !== x.size
        || x.length !== x.lengthOf
      ) throw new Error('Incorrectly aliased');
    });

    it('checks the length of a string', function (next) {
      var str = 'foobar';

      assume(str).length(str.length);

      try { assume(str).length(1); }
      catch (e) { next(); }
    });

    it('checks the length of an array', function (next) {
      var arr = [1,2,3];

      assume(arr).has.length(3);

      try { assume(arr).length(1); }
      catch (e) { next(); }
    });

    it('checks the amount of keys in a object', function (next) {
      var obj = { foo: 'bar', bar: 'foo' };

      assume(obj).length(2);

      try { assume(obj).length(4); }
      catch (e) { next(); }
    });

    it('prefers a `.length` key over the size of an object', function (next) {
      function Foo() {
        this.length = 1;
        this.bar = 'hello';
      }

      var foo = new Foo();
      assume(foo).length(1);

      try { assume(foo).length(2); }
      catch (e) { next(); }
    });

    it('checks the amount of arguments in a function', function (next) {
      function test(one, two, three) {}

      assume(test).length(3);

      try { assume(test).length(4); }
      catch (e) { next(); }
    });
  });

  describe('#empty', function () {
    it('checks if strings are empty', function (next) {
      assume('').empty();

      try { assume('foo').empty(); }
      catch (e) { next(); }
    });

    it('checks if array is empty', function (next) {
      assume([]).empty();

      try { assume([1]).empty(); }
      catch (e) { next(); }
    });

    it('check if objects are empty', function (next) {
      assume({}).empty();

      try { assume({ foo: '' }).empty(); }
      catch (e) { next(); }
    });
  });

  describe('#above', function () {
    it('is aliased as `gt`, `greater`, `greaterThan`', function () {
      var x = assume('aaaabe');

      if (
           x.above !== x.gt
        || x.above !== x.greater
        || x.above !== x.greaterThan
      ) throw new Error('Incorrectly aliased');
    });

    it('accepts numbers', function (next) {
      assume(10).is.above(9);

      try { assume(10).is.above(10); }
      catch (e) {
        try { assume(100).is.above(1000); }
        catch (e) { next(); }
      }
    });

    it('accepts everything from .length', function (next) {
      assume([4,1,4,6]).is.above(3);
      assume({foo: 'bar', bar: 'foo' }).is.above(1);
      assume('string').is.above(4);

      try { assume([4,1,4,6]).is.above(10); }
      catch (e) {
        try { assume({foo: 'bar', bar: 'foo' }).is.above(3); }
        catch (e) {
          try { assume('string').is.above(49); }
          catch (e) { next(); }
        }
      }
    });
  });

  describe('#least', function () {
    it('is aliased as `gte`, `atleast`', function () {
      var x = assume('aaaabe');

      if (
           x.least !== x.gte
        || x.least !== x.atleast
      ) throw new Error('Incorrectly aliased');
    });

    it('accepts numbers', function (next) {
      assume(11).is.least(10);
      assume(10).is.least(10);

      try { assume(9).is.least(10); }
      catch (e) {
        try { assume(100).is.above(1000); }
        catch (e) { next(); }
      }
    });

    it('accepts everything from .length', function (next) {
      assume([4,1,4,6]).is.least(3);
      assume([4,1,4,6]).is.least(4);
      assume({foo: 'bar', bar: 'foo' }).is.least(1);
      assume({foo: 'bar', bar: 'foo' }).is.least(2);
      assume('string').is.least(4);
      assume('string').is.least(5);

      try { assume([4,1,4,6]).is.least(10); }
      catch (e) {
        try { assume({foo: 'bar', bar: 'foo' }).is.least(3); }
        catch (e) {
          try { assume('string').is.least(49); }
          catch (e) { next(); }
        }
      }
    });
  });

  describe('#below', function () {
    it('is aliased as `lt`, `less`, `lessThan`', function () {
      var x = assume('aaaabe');

      if (
           x.below !== x.lt
        || x.below !== x.less
        || x.below !== x.lessThan
      ) throw new Error('Incorrectly aliased');
    });

    it('accepts numbers', function (next) {
      assume(9).is.less(10);

      try { assume(10).is.less(10); }
      catch (e) {
        try { assume(1000).is.less(100); }
        catch (e) { next(); }
      }
    });

    it('accepts everything from .length', function (next) {
      assume([4,1,4,6]).is.less(5);
      assume({foo: 'bar', bar: 'foo' }).is.less(3);
      assume('string').is.less(9);

      try { assume([4,1,4,6]).is.less(3); }
      catch (e) {
        try { assume({foo: 'bar', bar: 'foo' }).is.less(2); }
        catch (e) {
          try { assume('string').is.less(3); }
          catch (e) { next(); }
        }
      }
    });
  });

  describe('#most', function () {
    it('is aliased as `lte`, `atmost`', function () {
      var x = assume('aaaabe');

      if (
           x.most !== x.lte
        || x.most !== x.atmost
      ) throw new Error('Incorrectly aliased');
    });

    it('accepts numbers', function (next) {
      assume(9).is.most(10);
      assume(10).is.most(10);

      try { assume(10).is.most(9); }
      catch (e) {
        try { assume(1000).is.most(100); }
        catch (e) { next(); }
      }
    });

    it('accepts everything from .length', function (next) {
      assume([4,1,4,6]).is.most(6);
      assume([4,1,4,6]).is.most(5);
      assume({foo: 'bar', bar: 'foo' }).is.most(3);
      assume({foo: 'bar', bar: 'foo' }).is.most(2);
      assume('string').is.most(7);
      assume('string').is.most(6);

      try { assume([4,1,4,6]).is.most(1); }
      catch (e) {
        try { assume({foo: 'bar', bar: 'foo' }).is.most(1); }
        catch (e) {
          try { assume('string').is.most(2); }
          catch (e) { next(); }
        }
      }
    });
  });

  describe('#within', function () {
    it('is aliased as `between`', function () {
      var x = assume('aaaabe');

      if (x.within !== x.between) throw new Error('Incorrectly aliased');
    });

    it('accepts numbers', function (next) {
      assume(9).is.within(2, 10);
      assume(10).is.within(9, 15);

      try { assume(10).is.within(1, 8); }
      catch (e) {
        try { assume(1000).is.within(20, 100); }
        catch (e) { next(); }
      }
    });

    it('accepts everything from .length', function (next) {
      assume([4,1,4,6]).is.within(1, 6);
      assume([4,1,4,6]).is.within(1, 5);
      assume({foo: 'bar', bar: 'foo' }).is.within(1, 100);
      assume({foo: 'bar', bar: 'foo' }).is.within(1, 2);
      assume('string').is.within(1, 7);
      assume('string').is.within(2, 100);

      try { assume([4,1,4,6]).is.within(100, 1000); }
      catch (e) {
        try { assume({foo: 'bar', bar: 'foo' }).is.within(20, 100); }
        catch (e) {
          try { assume('string').is.within(2, 4); }
          catch (e) { next(); }
        }
      }
    });
  });

  describe('#hasOwn', function () {
    it('is aliased as `own`, `ownProperty`, `haveOwnProperty`, `property`, `owns`, `hasown`', function () {
      var x = assume('aaaabe');

      if (
           x.hasOwn !== x.own
        || x.hasOwn !== x.ownProperty
        || x.hasOwn !== x.haveOwnProperty
        || x.hasOwn !== x.property
        || x.hasOwn !== x.owns
        || x.hasOwn !== x.hasown
      ) throw new Error('Incorrectly aliased');
    });

    if (Object.create) {
      it('works with object.create(null)', function () {
        var obj = Object.create(null);
        obj.foo = 'bar';

        assume(obj).hasown('foo');
      });
    }

    it('checks the property value', function () {
      var obj = { foo: 'bar' };

      // negative assertion required to make sure the 2nd argument is checked.
      assume(obj).to.not.hasown('fool', false);
      assume(obj).to.not.hasown('fool', 'bar');
      assume(obj).hasown('foo', 'bar');
    });

    it('can do deep property checks', function () {
      var obj = { foo: { deep: 'bar' }};

      assume(obj).deep.hasown('foo', { deep: 'bar' });
      assume(obj).deep.not.hasown('fool', {  different: 'deep' });
    });

    it('only accepts added properties', function (next) {
      var obj = { foo: 'br' };

      assume(obj).hasown('foo');

      try { assume(obj).hasown('toString()'); }
      catch (e) {
        try { assume(obj).hasown('unknown'); }
        catch (e) { next(); }
      }
    });

    it('can check against null values in an object', function () {
      var obj = { _foo: null, _bar: null };

      assume(obj).to.have.property('_foo', null);
      assume(obj).to.have.property('_bar', null);
    });
  });

  describe('#match', function () {
    it('is aliased as `matches`', function () {
      var x = assume('aaaabe');

      if (x.match !== x.matches) throw new Error('Incorrectly aliased');
    });

    it('accpets strings instead of regexps', function () {
      var str = 'bar';

      assume(str).matches('\\w+');
    });

    it('accepts regexp', function (next) {
      assume('cows').matches(/\w+/);
      assume('1').matches(/\d+/);

      try { assume('cows').match(/\d+/); }
      catch (e) { next(); }
    });
  });

  describe('#equal', function () {
    it('is aliased as `equals`, `eq`, `eqs`', function () {
      var x = assume('aaaabe');

      if (
           x.equal !== x.equals
        || x.equal !== x.eq
        || x.equal !== x.eqs
      ) throw new Error('Incorrectly aliased');
    });

    it('equals', function (next) {
      assume('foo').equals('foo');
      assume('bar').equals('bar');
      assume(true).equals(true);
      assume(0).equals(0);

      try { assume(true).equals(false); }
      catch (e) {
        try { assume('foo', 'bar'); }
        catch (e) {
          try { assume([]).equals([]); }
          catch (e) { next(); }
        }
      }
    });

    it('supports .deep', function (next) {
      assume([1]).deep.equals([1]);

      try { assume([1]).equals([1]); }
      catch (e) { next(); }
    });

    it('supports .not', function (next) {
      assume('foo').does.not.equal('bar');

      try { assume('foo').does.not.equal('foo'); }
      catch (e) {
        if (e.message.indexOf('not equal') < 0) {
          next(new Error('expected `@ equals` to have been replaced by `not equals`'));
        } else {
          next();
        }
      }
    });
  });

  describe('#eql', function () {
    it('is aliased as `eqls`', function () {
      var x = assume('foo');

      if (x.eql !== x.eqls) throw new Error('Incorrectly aliased');
    });

    it('deeply equals', function (next) {
      assume([1]).eqls([1]);
      assume([1, [2]]).eqls([1, [2]]);

      try { assume([1]).eqls([2]); }
      catch (e) { next(); }
    });
  });

  describe('#either', function () {
    it('equals one of the given values', function (next) {
      assume('bar').is.either(['foo', 'bar']);

      try { assume('bar').is.either([1, 2, new Date(), []]); }
      catch (e) { next(); }
    });

    it('deeply equals one of the given values', function (next) {
      assume({foo: 'bar'}).is.deep.either([{ bar: 'foo' }, { foo: 'bar' }]);

      try { assume({foo: 'bar'}).is.deep.either([{ bar: 'foo' }, { foo: 'bar', food: 'bar' }]); }
      catch (e) { next(); }
    });
  });

  describe('#throws', function () {
    function fail() { throw new Error('Oi, cow face'); }
    function pass() { }

    it('is aliased as `throw`, `fail`, `fails`', function () {
      var x = assume('foo');

      if (
           x.throws !== x.throw
        || x.throws !== x.fails
        || x.throws !== x.fail
      ) throw new Error('Incorrectly aliased');
    });

    it('captures the thrown error', function (next) {
      assume(fail).throws('cow face');
      assume(pass).does.not.throws();

      try { assume(fail).throws('your mom'); }
      catch (e) { next(); }
    });

    it('fails when nothing is thrown', function (next) {
      try { assume(pass).throws('cow-dung'); }
      catch (e) {
        try { assume(pass).throws(); }
        catch (e) { return next(); }
      }
    });

    it('fails when throw is not expected', function (next) {
      try { assume(fail).to.not.throw(); }
      catch (e) { next(); }
    });

    it('executes non throwing functions', function (next) {
      assume(fail).does.not.throw('hi');
      assume(next).does.not.throw('hi');
    });

    it('can match using regexp', function (next) {
      assume(fail).throws(/oi/i);

      try { assume(fail).throws(/waffles/); }
      catch (e) { next(); }
    });

    it('can match instances', function (next) {
      assume(fail).throws(Error);

      try { assume(fail).throws(ReferenceError); }
      catch (e) { next(); }
    });

    it('can throw non errors', function () {
      assume(function () { throw true; }).throws(true);
    });
  });

  describe('.finite', function () {
    it('is aliased as `isFinite`, `finiteness`', function () {
      var x = assume(1);

      if (
           x.finite !== x.isFinite
        || x.finite !== x.finiteness
      ) throw new Error('Incorrectly aliased');
    });

    it('is finite', function (next) {
      assume(100).is.finite();
      assume('100').is.finite();

      try { assume(NaN).is.finite(); }
      catch (e) {
        try { assume(Infinity).is.finite(); }
        catch (e) { next(); }
      }
    });

    it('support strict mode', function (next) {
      assume(1).is.strict.finite();
      assume(Infinity).is.not.strict.finite();
      assume(-Infinity).is.not.strict.finite();
      assume(NaN).is.not.strict.finite();

      try { assume('1').is.strict.finite(); }
      catch (e) { next(); }
    });
  });

  //
  // We need to `eval` this as the `*` in the generator function is seen as
  // invalid syntax in older versions of the language.
  //
  if (assume.supports.generators) (new Function('describe', 'assume', [
  "describe('#generators', function () {",
  "  it('correctly identifies a generator', function bar(next) {",
  "    function* foo() {",
  "      yield 1;",
  "    }",
  "    assume(foo).is.generator();",
  "    try { assume(bar).is.generator(); }",
  "    catch (e) { next(); }",
  "  });",
  "});"
  ].join('\n')))(describe, assume);

  describe('#approximately', function () {
    it('is aliased as `near`, `close`, `closeTo`', function () {
      var x = assume('foo');

      if (
           x.approximately !== x.near
        || x.approximately !== x.close
        || x.approximately !== x.closeTo
      ) throw new Error('Incorrectly aliased');
    });

    it('should be approximately', function (next) {
      assume(1.5).is.approximately(1.4, 0.2);
      assume(1.5).is.approximately(1.5, 10E-10);
      assume(1.5).is.not.approximately(1.4, 1E-2);

      try { assume(99.99).is.not.approximately(100, 0.1); }
      catch (e) {
        try { assume(99.99).is.approximately(105, 0.1); }
        catch (e) { next(); }
      }
    });
  });

  describe('#start', function () {
    it('is aliased as `starts`, `startsWith`, `startWith`', function () {
      var x = assume('foo');

      if (
           x.start !== x.starts
        || x.startWith !== x.start
        || x.startsWith !== x.start
      ) throw new Error('Incorrectly aliased');
    });

    it('starts with str', function (next) {
      assume('foobar').startsWith('foo');
      assume('hello multi string hello').starts('hello');

      try { assume('foobar').startsWith('bar'); }
      catch (e) { next(); }
    });
  });

  describe('#end', function () {
    it('is aliased as `ends`, `endsWith`, `endWith`', function () {
      var x = assume('foo');

      if (
           x.end !== x.ends
        || x.endsWith !== x.end
        || x.endWith !== x.end
      ) throw new Error('Incorrectly aliased');
    });

    it('ends with str', function (next) {
      assume('foobar').endsWith('bar');
      assume('hello multi string hellos').endsWith('hellos');

      try { assume('foobar').endsWith('foo'); }
      catch (e) { next(); }
    });
  });

  describe('.plan', function () {
    it('plans the amount of asserts to execute', function (next) {
      next = assume.plan(2, next);

      assume('foo').equals('foo');
      assume('bar').equals('bar');

      next();
    });

    it('errors on not enough asserts', function (done) {
      var next = assume.plan(2, function (err) {
        assume(err.message).includes('less');
        assume(err.message).includes('1');
        assume(err.message).includes('2');

        done();
      });

      assume('foo').equals('foo');
      next();
    });

    it('errors on not enough asserts', function (done) {
      var next = assume.plan(2, function (err) {
        assume(err.message).includes('more');
        assume(err.message).includes('1');
        assume(err.message).includes('2');

        done();
      });

      assume('foo').equals('foo');
      assume('foo').equals('foo');
      assume('foo').equals('foo');

      next();
    });

    it('still allows error in the callback', function (done) {
      var next = assume.plan(2, function (err) {
        assume(err.message).includes('shit');

        done();
      });

      next(new Error('shit'));
    });

    it('throws when not supplied with a callback', function () {
      var next = assume.plan(2);

      assume('foo').equals('foo');
      assume('foo').equals('foo');
      assume('foo').equals('foo');
      assume('foo').equals('foo');
      assume('foo').equals('foo');

      try { next(); }
      catch (err) {
        assume(err.message).includes('more');
        assume(err.message).includes('3');
        assume(err.message).includes('2');
      }
    });
  });

  describe('type checks', function () {
    it('.nan', function (next) {
      assume(NaN).is.nan();

      try { assume(undefined).is.nan(); }
      catch (e) { next(); }
    });

    it('.undefined', function (next) {
      assume(undefined).is.undefined();
      assume(void 0).is.undefined();

      try { assume(null).is.undefined(); }
      catch (e) { next(); }
    });

    it('.null', function (next) {
      assume(null).is.null();

      try { assume(undefined).is.null(); }
      catch (e) { next(); }
    });

    it('.arguments', function (next) {
      assume(arguments).is.arguments();

      try { assume(null).is.arguments(); }
      catch (e) { next(); }
    });

    it('.string', function (next) {
      assume(String('foo')).is.string();
      assume('string').is.string();

      try { assume(['array']).is.string(); }
      catch (e) { next(); }
    });

    it('.number', function (next) {
      assume(Number('0.1')).is.number();
      assume(0).is.number();

      try { assume(['array']).is.number(); }
      catch (e) { next(); }
    });

    it('.array', function (next) {
      assume(new Array(99)).is.array();
      assume([]).is.array();

      try { assume(arguments).is.array(); }
      catch (e) { next(); }
    });

    it('.function', function foo(next) {
      assume(foo).is.function();
      assume(new Function()).is.function();

      try { assume('2014/04/04').is.function(); }
      catch (e) { next(); }
    });

    it('.date', function (next) {
      assume(new Date()).is.date();

      try { assume('2014/04/04').is.date(); }
      catch (e) { next(); }
    });

    it('.error', function (next) {
      assume(new Error('foo')).is.error();

      try { assume('foo').is.error(); }
      catch (e) { next(); }
    });

    it('.regexp', function (next) {
      assume(new RegExp('foo', 'm')).is.regexp();
      assume(/foo/).is.regexp();

      try { assume('/regexp/').to.be.a('regexp'); }
      catch (e) { next(); }
    });

    it('.boolean', function (next) {
      assume(Boolean(0)).is.boolean();
      assume(Boolean(1)).is.boolean();
      assume(false).is.boolean();
      assume(true).is.boolean();

      try { assume('true').to.be.a('boolean'); }
      catch (e) { next(); }
    });

    if (global.Buffer) it('.buffers', function (next) {
      assume(new Buffer(0)).is.buffer();

      try { assume({}).is.buffer(); }
      catch (e) { next(); }
    });

    if (global.Float32Array) it('.float32arrays', function (next) {
      assume(new Float32Array(2)).is.float32array();

      try { assume([]).is.float32array(); }
      catch (e) { next(); }
    });

    if (global.Float64Array) it('.float64arrays', function (next) {
      assume(new Float64Array(2)).float64array();

      try { assume([]).isfloat64array(); }
      catch (e) { next(); }
    });

    if (global.Int16Array) it('.int16arrays', function (next) {
      assume(new Int16Array()).is.int16array();

      try { assume([]).is.int16array(); }
      catch (e) { next(); }
    });

    if (global.Int32Array) it('.int32arrays', function (next) {
      assume(new Int32Array()).is.int32array();

      try { assume(new Int16Array()).is.int32array(); }
      catch (e) { next(); }
    });

    if (global.Int8Array) it('.int8arrays', function (next) {
      assume(new Int8Array()).is.int8array();

      try { assume([]).is.int8array(); }
      catch (e) { next(); }
    });

    if (global.Uint16Array) it('.uint16arrays', function (next) {
      assume(new Uint16Array()).is.uint16array();

      try { assume(new Int16Array()).is.uint16array(); }
      catch (e) { next(); }
    });

    if (global.Uint32Array) it('.uint32arrays', function (next) {
      assume(new Uint32Array()).is.uint32array();

      try { assume(new Uint16Array()).is.uint32array(); }
      catch (e) { next(); }
    });

    if (global.Uint8Array) it('.uint8arrays', function (next) {
      assume(new Uint8Array()).is.uint8array();

      try { assume([]).is.uint8array(); }
      catch (e) { next(); }
    });
  });

  describe('.use', function () {
    it('has a `use` method', function () {
      assume(assume.use).is.a('function');
    });

    it('executes the supplied function', function (next) {
      assume.use(function plugin(ass, helpers) {
        assume(ass).equals(assume);

        next();
      });
    });

    it('exposes helper functions', function (next) {
      assume.use(function plugin(ass, helpers) {
        assume(helpers).is.a('object');

        assume(helpers.string).is.a('function');
        assume(helpers.nodejs).is.a('boolean');
        assume(helpers.deep).is.a('function');
        assume(helpers.each).is.a('function');
        assume(helpers.name).is.a('function');
        assume(helpers.size).is.a('function');
        assume(helpers.type).is.a('function');
        assume(helpers.get).is.a('function');

        next();
      });
    });

    describe('.each', function () {
      it('iterates over arrays', function (next) {
        next = assume.plan(10, next);

        assume.use(function (ass, helper) {
          helper.each([1,2,3,4,5,6,7,8,9,10], function (nr, i) {
            assume(nr).is.a('number');
          });

          next();
        });
      });

      it('can break out of a array#each', function (next) {
        next = assume.plan(1, next);

        assume.use(function (ass, helper) {
          helper.each([1,2,3,4,5,6,7,8,9,10], function (nr, i) {
            assume(nr).is.a('number');

            return false;
          });

          next();
        });
      });

      it('iterates over objects', function (next) {
        next = assume.plan(2, next);

        assume.use(function (ass, helper) {
          helper.each({foo: 'bar'}, function (value, key) {
            assume(value).equals('bar');
            assume(key).equals('foo');
          });

          next();
        });
      });

      it('can break out of a object#each', function (next) {
        next = assume.plan(2, next);

        assume.use(function (ass, helper) {
          helper.each({foo: 'bar', hello: 'world'}, function (value, key) {
            assume(value).equals('bar');
            assume(key).equals('foo');

            return false;
          });

          next();
        });
      });
    });

    describe('.format', function () {
      it('returns a function', function (next) {
        assume.use(function (ass, helper) {
          var fn = helper.format('foo');

          assume(fn).is.a('function');
          assume(fn()).equals('foo');

          next();
        });
      });

      it('it replaces the @ with not', function (next) {
        assume.use(function (ass, helper) {
          var fn = helper.format('i am @ an idiot')
            , fnn = helper.format('i am @ an idiot');

          assume(fn(false)).equals('i am an idiot');
          assume(fnn(true)).equals('i am not an idiot');

          next();
        });
      });

      it('understands the patterns', function (next) {
        assume.use(function foo(ass, helper) {
          assume(helper.format('hi %d', 1)()).equals('hi 1');
          assume(helper.format('hi %% %d', 1)()).equals('hi % 1');
          assume(helper.format('hi %s', 'foo')()).equals('hi foo');
          assume(helper.format('hi %f', foo)()).equals('hi foo');
          assume(helper.format('hi %f')()).equals('hi %f');
          assume(helper.format('hi %a')(1)).equals('hi %a');

          var obj = { hello: 1 };
          assume(helper.format('hi %j', obj)()).equals('hi { hello: 1 }');

          if (Object.defineProperty) {
            Object.defineProperty(obj, 'throws', {
              get: function () {
                throw new Error('pew pew');
              },
              enumerable: true, configurable: true,
              set: function () {}
            });

            assume(helper.format('hi %j', obj)()).equals('hi <error was thrown: pew pew>');
          }

          next();
        });
      });
    });
  });
});

describe('i', function () {
  'use strict';

  var i = require('../');

  describe('.hope', function () {
    describe('.that', function () {
      it('works', function () {
        i.hope.that('foo').is.a('string');
      });
    });
  });

  describe('.expect', function () {
    describe('.that', function () {
      it('works', function () {
        i.expect.that('foo').is.a('string');
      });
    });
  });

  describe('.sincerely', function () {
    describe('.hope', function () {
      describe('.that', function () {
        it('works', function () {
          i.sincerely.hope.that('foo').is.a('string');
        });
      });
    });
  });
});

describe('github issues', function () {
  'use strict';

  var assume = require('../');

  if (Object.defineProperty) describe('#2', function () {
    it('does not throw errors when unspecified properties are accessed', function (next) {
      var foo = { bar: 'bar' };

      Object.defineProperty(foo, 'oops', {
        configurable: true, enumerable: true,
        get: function () {
          throw new Error('I should not be accessed');
        },
        set: function () {
          throw new Error('Double WTF, this should never happen');
        }
      });

      try { assume(foo).equals(foo); }
      catch (e) { return next(e); }

      //
      // This _should_ still not throw.
      //
      try { assume(foo).deep.equals(foo); }
      catch (e) { next(e); }

      next();
    });
  });
});
