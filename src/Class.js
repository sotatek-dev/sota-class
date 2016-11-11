var getArgNames         = require('./lib/utils').getArgNames;
var getOverrideMethod   = require('./lib/utils').getOverrideMethod;

function emptyFunction() {
  // Yes, an empty function does nothing...
}

var Class = function() {};
/*
 * Create a subclass
 * @param {object} properties: the extended properties of derived class
 *                             property begins with '$' is static one
 * @param {array} mixins: the interfaces that dervied class implemented
 */
Class.extends = (function() {

  /*
   * Of course javascript class is a function
   */
  return function() {

    if (arguments.length !== 1) {
      throw new Error('Invalid class arguments');
    }

    /*
     * First arguments of extends method is an object contains properties
     * that will be injected in to the derived class
     */
    var properties = arguments[0],

    /*
     * Check whether classname is defined
     * If not the classname will be Anonymous
     */
    classname = properties.classname || 'Anonymous',

    /*
     * Constructor for new class to be created.
     * They said eval is evil, but we need it here..
     */
    NewClass = eval('(function ' + classname + '(){this.initialize.apply(this, arguments)})'),

    /*
     * Prepare to traversal through all properties
     * that will be appended to the result class
     */
     property;

    /*
     * Copy static properties from superclass
     */
    for (var property in this) {
      if (!this.hasOwnProperty(property)) {
        continue;
      }

      NewClass[property] = this[property];
    }

    /*
     * Next is prototype
     */
    var ancestorPrototype = this.prototype;
    var TempClass = function() {};
    TempClass.prototype = ancestorPrototype;

    NewClass.prototype = new TempClass();
    NewClass.prototype.superclass = ancestorPrototype;
    NewClass.prototype.constructor = NewClass;

    /*
     * Here comes derived properties that were passed into extends method
     */
    for (property in properties) {
      if (!properties.hasOwnProperty(property)) {
        continue;
      }

      // getters / setters behave differently
      var getter = properties.__lookupGetter__(property),
          setter = properties.__lookupSetter__(property),
          value;

      if (getter || setter) {
        // Still don't support for now...
        // TODO: is there any case need this?
        throw new Error('Class::extends still does not support setter and getter yet...');
      }

      value = properties[property];

      /*
       * If the property is classname, or it's static
       * Just bring the original it to the derived class
       */
      if (property[0] === '$' || property === 'classname') {
        if (property[0] === '$') {
          property = property.slice(1);
        }

        NewClass[property] = value;
        NewClass.prototype[property] = value;

        // And that's all
        continue;
      }

      // Non-static properties
      if (typeof value !== 'function') {
        NewClass.prototype[property] = value;
        continue;
      }

      /*
       * And here comes the non-static methods
       */
      var descendantMethod = value,
          ancestorMethod = ancestorPrototype[property];
      if (getArgNames(descendantMethod)[0] === '$super') {
        // Create override method if the first param is $super.
        value = getOverrideMethod(descendantMethod, ancestorMethod);
      } else if (property === 'initialize') {
        // If property is `initialize`, and the first parameter is not `$super`
        // The ancestor method will be called automatically
        var ancestorInitialize = ancestorPrototype.initialize;
        if (ancestorInitialize) {
          var derivedInitialize = value;
          /*jshint loopfunc: true */
          value = function() {
            ancestorInitialize.apply(this, arguments);
            derivedInitialize.apply(this, arguments);
          };
        }
      } else if (property === 'destroy') {
        // Same for `destroy` method
        var ancestorDestroy = ancestorPrototype.destroy;
        if (ancestorDestroy) {
          var derivedDestroy = value;
          value = function() {
            derivedDestroy.apply(this, arguments);
            ancestorDestroy.apply(this, arguments);
          };
        }
      }

      // Copy method into new class prototype.
      NewClass.prototype[property] = value;
    }

    // Make sure there is an initialize function.
    if (!NewClass.prototype.initialize) {
      NewClass.prototype.initialize = emptyFunction;
    }

    // And destroy as well
    if (!NewClass.prototype.destroy) {
      NewClass.prototype.destroy = emptyFunction;
    }

    return NewClass;
  };

})();

Class.singleton = function(){
  // Behind the scene, singleton is just an instance of normal subclass
  var TempClass = this.extends.apply(this, arguments);

  // The difference is initialize method will not be exposed to outside world
  // We will backup it here and hide it from class
  var initialize = TempClass.prototype.initialize;
  TempClass.prototype.initialize = function() {};

  // Here come the real instance without initialize method
  var instance = new TempClass(),
      funcNames = [];

  // Iterate over all prototype functions.
  for (var property in instance) {
    // Yes, we didn't support getters and setters yet...
    if (instance.__lookupGetter__(property) || instance.__lookupSetter__(property)) {
      continue;
    }

    var value = instance[property];

    // We dont care about non-function property here
    if (typeof value !== 'function') {
      continue;
    }

    // Store all the function names, so that we can
    // remove them all once the singleton is instantiated
    funcNames.push(property);

    // Nest every prototype function by an instance function
    // that will invoke the instantiate
    instance[property] = function instantiate(prototypeFunc) {
      // Fully initialize the instance
      initialize.apply(instance);

      // Once the instance has been initialized
      // Delete all the instance functions we added before
      for (var i in funcNames) {
        delete instance[funcNames[i]];
      }

      // Invoke the real protoype function
      var args = Array.prototype.slice.call(arguments, 1);
      return prototypeFunc.apply(instance, args);
    }.bind(this, value);
  }

  // Enjoy the result
  return instance;
};

Class.implements = function(interfaces) {
  if (!interfaces || !interfaces.length) {
    throw new Error('Invalid interfaces to implement');
  }

  // Implements is simply interate and copy the properties...
  for (var i = 0; i < interfaces.length; i++) {
    var interface = interfaces[i];
    for (var property in interface) {
      if (this.prototype[property]) {
        continue;
      }

      if (!interface.hasOwnProperty(property)) {
        continue;
      }

      var value = interface[property];

      if (typeof value !== 'function' || property[0] === '$') {
        if (property[0] === '$') {
          property = property.slice(1);
        }

        this[property] = value;
        this.prototype[property] = value;
        continue;
      }

      this.prototype[property] = value;
    }
  }

  return this;
};

module.exports = Class;
