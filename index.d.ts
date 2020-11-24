/*~ This declaration specifies that the function
 *~ is the exported object from the file
 */
export = Assume;

declare module 'assume';

declare function Assume(value: any, flags?: Assume.Flags): Assume.Assumption;

declare namespace Assume {
  export interface Flags {
    stacktrace?: boolean,
    diff?: boolean,
    sliceStack?: number,
    slice?: number
  }

  export const config: Config;
  export const supports: Supports;
  export const flags: Flags;

  export interface ErrCallback {
    (err?: Error | string): void
  }

  interface AssumeInstance<T = any> extends Flags {
    value: T,
    test: TestFunction
  }

  export interface AddonAssumption<T> {
    (this: AssumeInstance<T>, ...args: any): Assumption;
  }

  export interface Expectation {
    (expectation: string): string
  }

  interface TestFunction {
    (passed: boolean, msg: string, expectation: Expectation | string, slicesOfStack?: number): Assumption
  }

  export function plan(numAssertionsPlanned: number, next?: ErrCallback): ErrCallback;

  export function wait(callbackCallCount: number, numAssertionsPlanned: number, onFinished: ErrCallback): ErrCallback;
  export function wait(callbackCallCount: number, onFinished: ErrCallback): ErrCallback;

  export function use(plugin: Function): void;

  export const test: TestFunction

  export function add<T>(methods: string | string[], func: AddonAssumption<T>): void;

  export interface AssignFunction {
    (methods: string | string[], func: Function)
  }

  export function assign(assignTo: object): AssignFunction;

  export function clone(value: any): Assumption;

  export interface Config {
    includeStack: boolean,
    showDiff: boolean,
    sliceStack: number
  }

  export interface Supports {
    readonly generators: boolean,
    readonly native: boolean
  }

  export const hope: HopeAssumption;
  export const expect: HopeAssumption;
  export const assume: HopeAssumption;
  export const sincerely: HopeAssumption;

  export interface HopeAssumption {
    readonly hope: HopeAssumption,
    readonly expect: HopeAssumption,
    readonly assume: HopeAssumption,
    readonly sincerely: HopeAssumption,
    that(value: any, flags?: Flags): Assumption,
  }

  export interface Assumption {
    readonly to: Assumption,
    readonly be: Assumption,
    readonly been: Assumption,
    readonly is: Assumption,
    readonly was: Assumption,
    readonly and: Assumption,
    readonly has: Assumption,
    readonly have: Assumption,
    readonly had: Assumption,
    readonly with: Assumption,
    readonly that: Assumption,
    readonly at: Assumption,
    readonly of: Assumption,
    readonly same: Assumption,
    readonly does: Assumption,
    readonly did: Assumption,
    readonly itself: Assumption,
    readonly which: Assumption,

    readonly not: Assumption,
    readonly doesnt: Assumption,
    readonly dont: Assumption,
    readonly deep: Assumption,
    readonly deeply: Assumption,
    readonly strict: Assumption,
    readonly strictly: Assumption,

    a(type: string, msg?: string): void,
    an(type: string, msg?: string): void,
    
    eitherOfType(types: string[], msg?: string): void,
    oneOfType(types: string[], msg?: string): void,
    
    instanceOf(type: Function, msg?: string): void,
    instanceof(type: Function, msg?: string): void,
    inherits(type: Function, msg?: string): void,
    inherit(type: Function, msg?: string): void,

    include(value: any, msg?: string): void,
    includes(value: any, msg?: string): void,
    contain(value: any, msg?: string): void,
    contains(value: any, msg?: string): void,

    ok(msg?: string): void,
    okay(msg?: string): void,
    truthy(msg?: string): void,
    truely(msg?: string): void,

    falsely(msg?: string): void,
    falsey(msg?: string): void,
    falsy(msg?: string): void,

    true(msg?: string): void,

    false(msg?: string): void,

    exists(msg?: string): void,
    exist(msg?: string): void,

    length(length: number, msg?: string): void,
    lengthOf(length: number, msg?: string): void,
    size(length: number, msg?: string): void,

    empty(msg?: string): void,

    above(value: number, msg?: string): void,
    gt(value: number, msg?: string): void,
    greater(value: number, msg?: string): void,
    greaterThan(value: number, msg?: string): void,

    least(value: number, msg?: string): void,
    gte(value: number, msg?: string): void,
    atleast(value: number, msg?: string): void,

    below(value: number, msg?: string): void,
    lt(value: number, msg?: string): void,
    less(value: number, msg?: string): void,
    lessThan(value: number, msg?: string): void,

    most(value: number, msg?: string): void,
    lte(value: number, msg?: string): void,
    atmost(value: number, msg?: string): void,

    within(lowerBound: number, upperBound: number, msg?: string): void,
    between(lowerBound: number, upperBound: number, msg?: string): void,

    hasOwn(key: string, value?: any, msg?: string): void,
    own(key: string, value?: any, msg?: string): void,
    ownProperty(key: string, value?: any, msg?: string): void,
    haveOwnProperty(key: string, value?: any, msg?: string): void,
    property(key: string, value?: any, msg?: string): void,
    owns(key: string, value?: any, msg?: string): void,
    hasown(key: string, value?: any, msg?: string): void,

    match(regExp: RegExp | string, msg?: string): void,
    matches(regExp: RegExp | string, msg?: string): void,

    equal(value: any, msg?: string): void,
    equals(value: any, msg?: string): void,
    eq(value: any, msg?: string): void,
    eqs(value: any, msg?: string): void,
    exactly(value: any, msg?: string): void,

    eql(value: any, msg?: string): void,
    eqls(value: any, msg?: string): void,

    either(values: any[], msg?: string): void,

    throw(err?: RegExp | string | Function, msg?: string): void,
    throws(err?: RegExp | string | Function, msg?: string): void,
    fail(err?: RegExp | string | Function, msg?: string): void,
    fails(err?: RegExp | string | Function, msg?: string): void,

    finite(msg?: string): void,
    isFinite(msg?: string): void,
    finiteness(msg?: string): void,

    generator(msg?: string): void,

    optimisation(msg?: string): void,
    optimization(msg?: string): void,

    optimised(msg?: string): void,
    optimized(msg?: string): void,

    start(str: string, msg?: string): void,
    starts(str: string, msg?: string): void,
    startsWith(str: string, msg?: string): void,
    startWith(str: string, msg?: string): void,

    end(str: string, msg?: string): void,
    ends(str: string, msg?: string): void,
    endsWith(str: string, msg?: string): void,
    endWith(str: string, msg?: string): void,

    closeTo(value: number, deltaMargin: number, msg?: string): void,
    close(value: number, deltaMargin: number, msg?: string): void,
    approximately(value: number, deltaMargin: number, msg?: string): void,
    near(value: number, deltaMargin: number, msg?: string): void,

    rejected(msg?: string): void,
    rejects(msg?: string): void,
    throwAsync(msg?: string): void,
    throwsAsync(msg?: string): void,
    failAsync(msg?: string): void,
    failsAsync(msg?: string): void,

    resolveSync(msg?: string): void,
    resolvesSync(msg?: string): void,
    resolvedSync(msg?: string): void,
    completeSync(msg?: string): void,
    completesSync(msg?: string): void,
    completedSync(msg?: string): void,
  }
}
