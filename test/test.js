if ('undefined' === typeof global) global = (function that() {
  return this;
}());

describe('Assertions', function assertions() {
  'use strict';

  var assume = require('../');

  describe('#a', function () {
    if (global.String) it('classifies strings', function (next) {
      assume(String('foo')).to.be.a('string');
      assume('string').to.be.a('string');

      try { assume(['array']).to.be.a('string'); }
      catch (e) { next(); }
    });

    if (global.Number) it('classifies numbers', function (next) {
      assume(Number('0.1')).to.be.a('number');
      assume(0).to.be.a('number');

      try { assume(['array']).to.be.a('number'); }
      catch (e) { next(); }
    });

    if (global.Array) it('classifies arrays', function (next) {
      assume(new Array(99)).to.be.a('array');
      assume([]).to.be.a('array');

      try { assume(arguments).to.be.a('array'); }
      catch (e) { next(); }
    });

    if (global.Date) it('classifies dates', function (next) {
      assume(new Date()).to.be.a('date');

      try { assume('2014/04/04').to.be.a('date'); }
      catch (e) { next(); }
    });

    if (global.Error) it('classifies errors', function (next) {
      assume(new Error('foo')).to.be.a('error');

      try { assume('foo').to.be.a('error'); }
      catch (e) { next(); }
    });

    if (global.RegExp) it('classifies regexps', function (next) {
      assume(new RegExp('foo', 'm')).to.be.a('regexp');
      assume(/foo/).to.be.a('regexp');

      try { assume('/regexp/').to.be.a('regexp'); }
      catch (e) { next(); }
    });

    if (global.Boolean) it('classifies booleans', function (next) {
      assume(Boolean(0)).to.be.a('boolean');
      assume(Boolean(1)).to.be.a('boolean');
      assume(false).to.be.a('boolean');
      assume(true).to.be.a('boolean');

      try { assume('true').to.be.a('boolean'); }
      catch (e) { next(); }
    });

    if (global.Float32Array) it('classifies float32arrays');
    if (global.Float64Array) it('classifies float64arrays');
    if (global.int16Array) it('classifies int16arrays');
    if (global.int32Array) it('classifies int32arrays');

    it('is aliased as `an`', function () {
      var x = assume('foo');

      if (x.a !== x.an) throw new Error('Incorrectly aliased');
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
    it('is aliased as `falsey`', function () {
      var x = assume('aaaabe');

      if (x.falsely !== x.falsey) throw new Error('Incorrectly aliased');
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