'use strict';

function Failure(msg, options) {
  if (!(this instanceof Failure)) return new Failure(msg, options);

  options = options || {};
}

//
// Expose the Failure.
//
module.exports = Failure;
