'use strict';

module.exports = [
  { name: 'health', base: 100 },
  { name: 'mana', base: 100 },
  { name: 'strength', base: 0 },
  { name: 'agility', base: 0 },
  { name: 'intellect', base: 0 },
  { name: 'stamina', base: 0 },
  { name: 'armor', base: 0 },
  { 
     name: 'critical', 
     base: 0,
     formula: {
      requires: ['agility'],
      fn: function (character, critical, agility) {
        return critical + Math.floor((agility - 20) / 10);
      },
    },
  },
  { name: 'cutting_resistance', base: 0 },
  { name: 'crushing_resistance', base: 0 },
  { name: 'piercing_resistance', base: 0 },
  { name: 'fire_resistance', base: 0 },
  { name: 'cold_resistance', base: 0 },
  { name: 'lightning_resistance', base: 0 },
  { name: 'earth_resistance', base: 0 },
  { name: 'acid_resistance', base: 0 },
  { name: 'chaos_resistance', base: 0 },
  { name: 'ether_resistance', base: 0 },
  { name: 'cutting_damage', base: 0 },
  { name: 'crushing_damage', base: 0 },
  { name: 'piercing_damage', base: 0 },
  { name: 'fire_damage', base: 0 },
  { name: 'cold_damage', base: 0 },
  { name: 'lightning_damage', base: 0 },
  { name: 'earth_damage', base: 0 },
  { name: 'acid_damage', base: 0 },
  { name: 'chaos_damage', base: 0 },
  { name: 'ether_damage', base: 0 },
];
