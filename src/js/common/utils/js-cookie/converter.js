/* eslint-disable comma-dangle */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable no-var */
/* eslint-disable object-shorthand */
/* eslint-disable semi */

export default {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1)
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    );
  }
}
/* eslint-enable no-var */
