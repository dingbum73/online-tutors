module.exports = {
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  ifCondinArray: function (a, array, options) {
    return array.includes(a) ? options.fn(this) : options.inverse(this)
  }
}
