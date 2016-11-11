/**
 * Get parameter names from a function
 * @param {function} func: a function
 * @returns {array}: an array of strings, that represents the argument names
 */
module.exports.getArgNames = function(func) {
  var names = func.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
    .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
    .replace(/\s+/g, '').split(',');
  return names.length === 1 && !names[0] ? [] : names;
};

/**
 * Get a inherited method
 * @param {function} descendant: the method of sub-class
 * @param {function} ancestor: the method of super-class
 * @returns {function} resultFunc: a method that will invoke the descent,
 *   and still keep reference to ancestor as the first argument ($super)
 */
module.exports.getOverrideMethod = function(descendant, ancestor) {

  var resultFunc = function() {
    var resultThis = this,
        $super;

    if (ancestor !== undefined) {
      // If the ancestor is defined, need to keep its reference
      // to make the inheritance chain
      $super = function() {
        return ancestor.apply(resultThis, arguments);
      };
    } else {
      // Otherwise the result method does not have ancestor
      $super = undefined;
    }

    // Make sure the arguments is exteneded even when $super is undefined
    Array.prototype.unshift.call(arguments, $super);

    // Finally invoke the descendant with new arguments
    return descendant.apply(this, arguments);
  }

  // Complete the camouflage, make all of the world to believe
  // the result function is descendant method itself
  resultFunc.valueOf = function() {
    return descendant.valueOf();
  };

  resultFunc.toString = function() {
    return descendant.toString();
  };

  // It's ok, just enjoy the result
  return resultFunc;
};
