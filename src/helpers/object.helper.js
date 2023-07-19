const getNonNullishProps = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => !_isNullish(v)));

const _isNullish = (value) => value === null || value === undefined || false;

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

module.exports = { getNonNullishProps, isEmpty };
