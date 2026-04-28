function myPromise(cb) {
  const isFulfilled = false;
  const isCalled = false;
  const isRejected = false;
  const onResolved = null;
  const onRejected = null;
  let value = null;
  let error = null;
  const resolve = function (val) {
    value = val;
    isFulfilled = true;
    if (typeof onResolved === "function" && !isCalled) {
      isCalled = true;
      onResolved(val);
    }
  };
  const reject = function (err) {
    error = err;
    isRejected = true;
    if (typeof onRejected === "function" && !isCalled) {
      onRejected(err);
      isCalled = true;
    }
  };

  this.then = function (thenHandler) {
    onResolved = thenHandler;
    if (!isCalled && isFulfilled) {
      isCalled = true;
      onResolved(value);
    }
    return this;
  };
  this.catch = function (catchHandler) {
    onRejected = catchHandler;
    if (!isCalled && isRejected) {
      isCalled = true;
      onRejected(value);
    }
    return this;
  };

  cb(resolve, reject);
}

Promise.prototype.myPromiseAll = function (promises) {
  return new Promise((res, rej) => {
    if (!Array.isArray(promises)) throw new Error("promises must be an array");

    if (!promises.length) return res([]);
    const result = Array(promises.length).fill(null);
    let cnt = 0;
    promises.forEach((pro, i) => {
      Promise.resolve(pro)
        .then((d) => {
          cnt++;
          result[i] = d;
          if (cnt === promises.length) {
            res(result);
          }
        })
        .catch(rej);
    });
  });
};


