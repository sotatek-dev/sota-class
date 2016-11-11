# Sota-Class.js
This is package for javascript developers that cannot forget OOP.  
In Node.js, we have `util.inherits` to do the inheritance stuffs, but it's not available in browser environment and also discouraged now.  
New ES6 with language-level inheritance support is still not popular enough, and we have to use old syntax in many cases.  
Then let's try **Sota-Class**. This module will bring you the familar OOP features with Java language. It's written in pure javscript, no dependency, works well on Node.js/browsers or any javascript environment.

## Installation

#### Node.js
```
  npm install sota-class
```

#### Browser
The easiest way to use the library is with [webpack](http://webpack.github.io) or [browserify](http://browserify.org)

## Usage

### Make sub-class by `Class.extends(properties)`

**Let's create the first class**

```js
var assert = require('assert');
var Class = require('sota-class').Class;
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
```

**And here's how to extends a existed class**

```js
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
```

**How to call the `super` method**

```js
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
```

**By default, the ancestor of methods `initialize` and `destroy` are called in their subclass' methods automatically, even if you don't do it explicitly**

```js
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
```

If you don't want `initialize` or `destroy` are called automatically, put the `$super` as the first method's argument and don't invoke it

```js
var Weirdo = Animal.extends({
  initialize: function($super, name) {
    // I don't want a name
  },
});

var weirdo = new Weirdo('Awesome name');
// Since the initialize was not called, the weirdo's name was not set as well
assert.equal(weirdo.getName(), undefined);
```

### Make the singleton by `Class.singleton(properties)`

**The argument is similar with `extends` method. But the result is an object instead of Class**
```js
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
```

### Make multi-inheritance by `Class.implements(interfaces)`
It's implemented, but documentation is still in proces...

```js
// TODO

```










