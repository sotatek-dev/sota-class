var assert    = require('assert');
var Animal    = require('./SetupWorld').Animal;
var Cat       = require('./SetupWorld').Cat;
var Dog       = require('./SetupWorld').Dog;
var Mouse     = require('./SetupWorld').Mouse;
var Stats     = require('./SetupWorld').Stats;

describe('Singleton', function() {

  describe('# Class.singleton', function() {
    it ('Meet Tom cat', function() {
      var Tom = Cat.singleton({
        classname: 'TomCat',

        initialize: function($super) {
          $super('Tom', new Stats(4, 10, 7));
        },

      });

      assert.equal(typeof Cat, 'function');
      assert.equal(typeof Tom, 'object');
      assert.equal(Tom.getStats().STR, 4);
      assert.equal(Tom.getName(), 'Tom');
      assert.equal(Tom.getStats().STR, 4);
      assert.equal(Tom.getStats().AGI, 10);
      assert.equal(Tom.getStats().WIS, 7);

    });
  });

});
