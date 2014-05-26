'use strict';

/**
 * Representation of an Assertion failure.
 *
 * Options:
 *
 * - **stack**: Stack trace
 * - **stacktrace**: Display stack traces.
 * - **expectation**: What we expected that would happen.
 *
 * @constructor
 * @param {String} msg The reason of failure.
 * @param {Object} options Failure configuration.
 * @api private
 */
function Failure(msg, options) {
  if (!(this instanceof Failure)) return new Failure(msg, options);

  options = options || {};

  //
  // Private variables.
  //
  this._stacktrace = 'stacktrace' in options ? options.stacktrace : true;
  this._expectation = 'expectation' in options ? options.expectation : '';
  this._stack = options.stack;

  //
  // The actual message that displays in your console.
  //
  this.message = msg || 'Unexpected assertation failure';
  this.stack = this.message + (
    this._stacktrace
    ? '\n'+ options.stack.toString()
    : ''
  );

  Error.call(this, this.message);
}

//
// Old school inheritance hurts my eyes.
//
Failure.prototype = new Error;
Failure.prototype.constructor = Failure;

/**
 * Ensure that we can create JSON representation of this error.
 *
 * @returns {Object}
 * @api private
 */
Failure.prototype.toJSON = function toJSON() {
  return {
    message: this.message,
    stack: this._stacktrace
      ? this._stack.traces
      : []
  };
};

//
// Expose the Failure.
//
module.exports = Failure;
