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
