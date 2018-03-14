var assume = require('../');

describe('#rejects', function () {
  async function throws() {
    throw new Error('I threw this!');
  }

  async function doesntThrow() {
    return 'I returned!';
  }

  function promiseResolves() {
    return new Promise(resolve => {
      setImmediate(() => resolve('I fulfilled my promise.'));
    });
  }

  function promiseRejects() {
    return new Promise((resolve, reject) => {
      setImmediate(() => reject('I reject your reality.'));
    });
  }

  it('is aliased as `rejected`, `rejects`, `throwAsync`, `throwsAsync`, `failAsync`, `failsAsync`', function () {
    var x = assume('foo');

    if (
      x.rejected !== x.rejects
      || x.throwAsync !== x.rejects
      || x.throwsAsync !== x.rejects
      || x.failAsync !== x.rejects
      || x.failsAsync !== x.rejects
    ) throw new Error('Incorrectly aliased');
  });

  it('Gives success when expected to throw', async function () {
    await assume(throws()).to.throwAsync();
  });

  it('Gives success when expected to not throw', async function () {
    await assume(doesntThrow()).to.not.throwAsync();
  });

  it('Fails expectation when not thrown and expected to throw', async function () {
    try {
      await assume(doesntThrow()).to.throwAsync();
    } catch (err) {
      return;
    }
    throw new Error('Exception wasn\'t thrown');
  });

  it('Fails expectation when thrown and not expected', async function () {
    try {
      await assume(throws()).to.not.throwAsync();
    } catch (err) {
      return;
    }

    throw new Error('Exception wasn\'t thrown');
  });

  it('allows pointer to async function', async function () {
    await assume(throws).to.throwAsync();
    await assume(doesntThrow).to.not.throwAsync();
  });

  it('works with promises', async function () {
    await assume(promiseRejects()).rejects();
  });

  it('works with successful promises', async function () {
    await assume(promiseResolves()).is.not.rejected();
  });
});

describe('#completedSync', function () {
  function synchronousThenable() {
    return {
      then(resolve) {
        resolve(1);
      }
    };
  }

  function asynchronousThenable() {
    return {
      then(resolve) {
        setImmediate(() => {
          resolve(1);
        });
      }
    };
  }

  function asyncPromise() {
    return new Promise(resolve => {
      setImmediate(() => resolve(1));
    });
  }

  function synchronousRejection() {
    return {
      then(resolve, reject) {
        reject(1);
      }
    };
  }

  function asynchronousRejection() {
    return {
      then(resole, reject) {
        setImmediate(() => {
          reject(1);
        });
      }
    };
  }

  it('is aliased as `resolveSync`, `resolvesSync`, `resolvedSync`, `completeSync`, `completesSync`, `completedSync`', function () {
    var x = assume('foo');

    if (
      x.resolveSync !== x.completedSync
      || x.resolvesSync !== x.completedSync
      || x.resolvedSync !== x.completedSync
      || x.completeSync !== x.completedSync
      || x.completesSync !== x.completedSync
    ) throw new Error('Incorrectly aliased');
  });

  it('succeeds when call is synchronous', async function () {
    assume(synchronousThenable()).completedSync();
  });

  it('succeeds when call is asynchronous and expected to be async', async function () {
    assume(asynchronousThenable()).to.not.completeSync();
  });

  it('fails when call is asynchronous and expected to be sync', async function () {
    await assume(async () => {
      await assume(asynchronousThenable()).completedSync();
    }).to.throwAsync();
  });

  it('fails when call is synchronous and expected to be async', async function () {
    await assume(async () => {
      await assume(synchronousThenable()).to.not.completeSync();
    }).to.throwAsync();
  });

  it('works with promises', async function () {
    await assume(asyncPromise()).to.not.completeSync();
  });

  it('succeed when rejecting synchronously', async function () {
    await assume(synchronousRejection()).completedSync();
  });

  it('succeed when rejecting asynchronously and expected to be async', async function () {
    await assume(asynchronousRejection()).to.not.completeSync();
  });
});
