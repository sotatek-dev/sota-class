var Class       = require('../src/Class');
var Interface   = require('../src/Interface');

var Animal = Class.extends({
  classname: 'Animal',

  initialize: function(name, stats) {
    if (!name || typeof name !== 'string') {
      throw new Error('Everyone must have a name.');
    }

    this._name = name;
    this._stats = stats;
  },

  getName: function() {
    return this._name;
  },

  getStats: function() {
    return this._stats;
  },

});

var IHunter = Interface.extends({

  _isHunter: true,

  isHunter: function() {
    return this._isHunter;
  },

});

var Cat = Animal.extends({
  classname: 'Cat',
}).implements([IHunter]);

var Mouse = Animal.extends({
  classname: 'Mouse',
});

var Dog = Animal.extends({
  classname: 'Dog',
});

var Stats = Class.extends({
  classname: 'Stats',

  initialize: function(str, agi, wis) {
    this.STR = str || 0;
    this.AGI = agi || 0;
    this.WIS = wis || 0;
  },

  STR: 0,
  AGI: 0,
  WIS: 0,

});

module.exports.Animal = Animal;
module.exports.Cat = Cat;
module.exports.Dog = Dog;
module.exports.Mouse = Mouse;
module.exports.Stats = Stats;
