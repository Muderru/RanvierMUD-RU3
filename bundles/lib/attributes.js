'use strict';

module.exports = [
  { //каждая дополнительная единица выносливости дает 50 жизни
    name: 'health', 
    base: 100,
    formula: {
      requires: [ 'stamina', 'health_percent' ],
      fn: function (character, health, stamina, health_percent) {
        if (!character.isNpc) {
          const modifier = (1 + (health_percent / 100));
          return Math.floor((health + ((stamina - 20) * 50)) * modifier); 
        } else {
          return health;
        }
      },
    },
  },
  { //каждая дополнительная единица интеллекта дает 25 маны
    name: 'mana',
    base: 100,
    formula: {
      requires: [ 'intellect', 'mana_percent' ],
      fn: function (character, mana, intellect, mana_percent) {
        if (!character.isNpc) {
          const modifier = (1 + (mana_percent / 100));
          return Math.floor((mana + ((intellect - 20) * 25)) * modifier); 
        } else {
          return mana;
        }
      },
    },
  },
  { name: 'strength', base: 0 },
  { name: 'agility', base: 0 },
  { name: 'intellect', base: 0 },
  { name: 'stamina', base: 0 },
  { name: 'armor',
    base: 0, 
    formula: {
      requires: [ 'armor_percent' ],
      fn: function (character, armor, armor_percent) {
        if (!character.isNpc) {
          const modifier = (1 + (armor_percent / 100));
          return Math.floor(armor * modifier); 
        } else {
          return armor;
        }
      },
    },
  },
  { 
     name: 'critical', 
     base: 0,
     formula: {
      requires: [ 'agility', 'critical_percent' ],
      fn: function (character, critical, agility, critical_percent) {
        if (!character.isNpc) {
          const modifier = (1 + (critical_percent / 100));
          return Math.floor((critical + ((agility - 20) / 10)) * modifier);
        } else {
          return critical;
        }
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
  { name: 'light', base: 0 },
  { name: 'invisibility', base: 0 },
  { name: 'detect_invisibility', base: 0 },
  { name: 'hide', base: 0 },
  { name: 'detect_hide', base: 0 },
  { name: 'freedom', base: 0 },
  { 
     name: 'health_regeneration', 
     base: 0,
     formula: {
      requires: ['stamina'],
      fn: function (character, health_regeneration, stamina) {
        if (!character.isNpc) {
          return health_regeneration + Math.floor((stamina - 10) / 10);
        } else {
          return health_regeneration;
        }
      },
    },
  },
  { 
     name: 'mana_regeneration', 
     base: 0,
     formula: {
      requires: ['intellect'],
      fn: function (character, mana_regeneration, intellect) {
        if (!character.isNpc) {
          return mana_regeneration + Math.floor((intellect - 10) / 10);
        } else {
          return mana_regeneration;
        }
      },
    },
  },
  //атрибуты для умений и сетовых наборов
  { name: 'health_percent', base: 0 }, //увеличение здоровья на %
  { name: 'mana_percent', base: 0 }, //увеличение маны на %
  { name: 'armor_percent', base: 0 }, //увеличение брони на %
  { name: 'critical_percent', base: 0 }, //увеличение крит.шанса на %
  { name: 'critical_damage_percent', base: 0 }, //увеличение крит.урона на %
  { name: 'critical_damage_reduction_percent', base: 0 }, //уменьшение крит.урона на %
  { name: 'skill_damage_percent', base: 0 }, //увеличение урона от умений на %
  { name: 'spell_damage_percent', base: 0 }, //увеличение урона от заклинаний на %
  { name: 'out_heal_percent', base: 0 }, //увеличение эффективности исходящего лечения на %
  { name: 'in_heal_percent', base: 0 }, //увеличение эффективности входящего лечения на %
  { name: 'dot_damage_percent', base: 0 }, //увеличение урона от периодического урона на %
  { name: 'dot_duration_percent', base: 0 }, //увеличение длительности периодического урона на %
  { name: 'dot_duration_reduction_percent', //уменьшение длительности периодического урона на %
    base: 0,
    formula: {
      requires: [],
      fn: function (character, dot_duration_reduction_percent) {
        if (dot_duration_reduction_percent > 95) {
          return 95;
        } else {
          return dot_duration_reduction_percent;
        }
      },
    },
  },
  { name: 'effect_duration_percent', base: 0 }, //увеличение длительности вызываемых эффектов на %
  { name: 'unfreedom_duration_reduction_percent', base: 0 }, //уменьшение длительности обездвиживания на %
  { name: 'swift', base: 0 }, //увеличение скорости атаки на %
];
