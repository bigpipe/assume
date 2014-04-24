if (typeof global === 'undefined') global = (function that() {
  return this;
}());

describe('Assertions', function assertions() {
  'use strict';

  describe('#a', function () {
    if (global.String) it('classifies strings');
    if (global.Number) it('classifies numbers');
    if (global.Array) it('classifies arrays');
    if (global.Date) it('classifies dates');
    if (global.Error) it('classifies errors');
    if (global.RegExp) it('classifies regexps');
    if (global.Boolean) it('classifies regexps');
    if (global.Float32Array) it('classifies float32arrays');
    if (global.Float64Array) it('classifies float64arrays');
    if (global.int16Array) it('classifies int16arrays');
    if (global.int32Array) it('classifies int32arrays');
  });
});
