'use strict';

/**
 * Representation of a stack trace.
 *
 * @constructor
 * @param {Array} trace Array of traces.
 * @api private
 */
function Stack(trace) {
  this.traces = this.parse(trace);
}

/**
 * Create a normalised stacktrace that we're used in browsers.
 *
 * @returns {String}
 * @api private
 */
Stack.prototype.toString = function toString() {
  var traces = [];

  for (var i = 0, length = this.traces.length; i < length; i++) {
    var trace = this.traces[i];
    traces.push(
      '    at '+ trace.name +' ('+ trace.file+ ':'+ trace.line +':'+ trace.column +')'
    );
  }

  return traces.join('\n\r');
};

/**
 * Parse the stacktrace's normalized stacktrace to a human readable object.
 *
 * @param {Array} trace Array of stack fragments
 * @returns {Array} Human readable objects
 * @api private
 */
Stack.prototype.parse = function parse(trace) {
  var stack = [];

  for (var i = 0, length = trace.length; i < length; i++) {
    var location = trace[i].split(':')
      , script = location[0].split('@');

    stack.push({
      column: location[2],
      line: location[1],
      name: script[0],
      file: script[1]
    });
  }

  return stack;
};

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

  this.message = msg || 'Unexpected assertation failure';
  this._stacktrace = 'stacktrace' in options ? options.stacktrace : true;
  this._expectation = 'expectation' in options ? options.expectation : '';

  Error.call(this, this.message);

  this.stack = new Stack(options.stack);
  console.log(options.stack);
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
    stack: this.stack.traces
  };
};

//
// Expose the Failure.
//
module.exports = Failure;
