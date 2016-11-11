var assert    = require('assert');
var Animal    = require('./SetupWorld').Animal;
var Cat       = require('./SetupWorld').Cat;
var Dog       = require('./SetupWorld').Dog;
var Mouse     = require('./SetupWorld').Mouse;
var Stats     = require('./SetupWorld').Stats;

describe('Class', function() {

  describe('# Class.extends', function() {
    it ('classname will be inherited always', function() {
      var dog = new Dog('A good puppy');
      assert.equal(Dog.classname, 'Dog');
      assert.equal(dog.classname, 'Dog');
    });

    it('initialize should be inherited inherited automatically', function() {
      var randomName = 'A random cat',
          cat = new Cat(randomName, new Stats(1, 5, 2)),
          stats = cat.getStats();

      assert.equal(cat.getName(), randomName);
      assert.equal(stats.STR, 1);
      assert.equal(stats.AGI, 5);
      assert.equal(stats.WIS, 2);
    });

    it('initialize of superclass can be ignored', function() {
      var Weirdo = Animal.extends({
        initialize: function($super, name, stats) {
          // Nobody can name me
        },
      });

      var weirdo = new Weirdo();

      assert.equal(Weirdo.classname, 'Animal');
      assert.equal(weirdo.getName(), undefined);
      assert.equal(weirdo.getStats(), undefined);
    });

    it('initialize of superclass can be invoked manually', function() {
      var Weirdo = Animal.extends({
        initialize: function($super, name, stats) {
          $super('Weirdo', stats);
        },
      });

      var weirdo = new Weirdo('Random Name'),
          stats = weirdo.getStats();

      assert.equal(weirdo.getName(), 'Weirdo');
    });

  });

});