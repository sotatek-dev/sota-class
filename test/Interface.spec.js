var assert    = require('assert');
var Animal    = require('./SetupWorld').Animal;
var Cat       = require('./SetupWorld').Cat;
var Dog       = require('./SetupWorld').Dog;
var Mouse     = require('./SetupWorld').Mouse;
var Stats     = require('./SetupWorld').Stats;

describe('Interface', function() {

  describe('# Class.implements & Interface.extends', function() {
    it ('property in interface should be inherited', function() {
      var cat = new Cat('A random cat');
      assert.equal(cat.isHunter(), true);
    });
  });

});
