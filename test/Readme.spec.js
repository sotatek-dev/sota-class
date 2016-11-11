var assert = require('assert');
var Class = require('../src/Class');
var Animal = Class.extends({
  classname: 'Animal',

  // The properties start with '$' are the static/class property
  $HABITAT: 'various',

  // The others will become the private properties of class instance
  age: 0,

  initialize: function(name) {
    this._name = name;
  },

  getName: function() {
    return this._name;
  },

  helloWorld: function() {
    throw new Error('Implement me in derived class');
  },

  destroy: function() {
    delete this._name;
  },

});

var foo = new Animal('Foo');
// Classname is defined in properties
assert.equal(Animal.classname, 'Animal');

// Class instance has the same classname value
assert.equal(foo.classname, 'Animal');

// Both class and class instance contain the static properties
assert.equal(Animal.HABITAT, 'various');
assert.equal(foo.HABITAT, 'various');

// Only the class instance has non-static properties
assert.equal(Animal.age, undefined);
assert.equal(foo.age, 0);

// Initialize method acts the constructor role
// and it's called automatically, then the name is set
assert.equal(foo.getName(), 'Foo');

var Cat = Animal.extends({
  classname: 'Cat',

  $HABITAT: 'kitchen',

  helloWorld: function() {
    return 'Meow';
  },
});

var cat = new Cat('Kitty');

// `initialize` and `getName` methods are inherited from Animal class
assert.equal(cat.getName(), 'Kitty');

// `helloWorld` is overrided
assert.equal(cat.helloWorld(), 'Meow');

// Defined property is overrided as well
assert.equal(Cat.HABITAT, 'kitchen');

var Lion = Cat.extends({
  classname: 'Lion',

  // If the first parameter of a method is `$super`
  // It's the reference to the ancestor method
  getName: function($super) {
    return $super() + '-Lion';
  },
});

var lion = new Lion('Simba');
// Yeah, the name has the '-Lion' suffix
assert.equal(lion.getName(), 'Simba-Lion');

var Duck = Animal.extends({
  classname: 'Duck',

  initialize: function(name) {
    // Do nothing, don't call the ancestor explicitly
  },

  destroy: function() {
    // Also do nothing
  },
});

var duck = new Duck('Donald');
// The name is still set, because Animal's initialize was called automatically
assert.equal(duck.getName(), 'Donald');

// And after the destroy, the name is deleted
duck.destroy();
assert.equal(duck.getName(), undefined);

var Weirdo = Animal.extends({
  initialize: function($super, name) {
    // I don't want a name
  },
});

var weirdo = new Weirdo('Awesome name');
// Since the initialize was not called, the weirdo's name was not set as well
assert.equal(weirdo.getName(), undefined);

var Tom = Cat.singleton({
  // initialize method will be called automatically in hidden scope

  initialize: function($super) {
    // Of course, Tom is an unique creature
    // and doesn't need to pass his name from outside
    $super('Tom');
  },

  confess: function() {
    return 'ILoveJerry';
  },

});

assert.equal(Tom.getName(), 'Tom');
assert.equal(Tom.confess(), 'ILoveJerry');

