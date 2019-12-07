export default function(foo) {
  return function(obj) {
    return new Promise((resolve, reject) => {
      foo({
        ...obj,
        success: resolve,
        fail: reject
      });
    });
  };
}
