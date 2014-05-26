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
 * @param {String} message The reason of failure.
 * @param {Object} options Failure configuration.
 * @api private
 */
function Failure(message, options) {
  if (!(this instanceof Failure)) return new Failure(message, options);

  options = options || {};
  this.message = message || 'Unknown assertation failure occured';

  //
  // Private variables.
  //
  this._stacktrace = 'stacktrace' in options ? options.stacktrace : true;
  this._expectation = 'expectation' in options ? options.expectation : '';
  this._stack = options.stack;

  if (this._expectation) this._expectation = ', assumed '+ this._expectation;
  this.message += this._expectation;

  //
  // The actual message that displays in your console.
  //
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
