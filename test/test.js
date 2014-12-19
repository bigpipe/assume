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
