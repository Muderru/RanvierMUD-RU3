'use strict';

const { Broadcast } = require('ranvier');

/**
 * Накладываем эффект на моба с именем обидчика, если видим его, то атакуем
 */
module.exports = {
  config: {
    name: 'Слабость после смерти',
    description: 'После смерти игрока, его характеристики снижены.',
    duration: 1000 * 60 * 1,
    unique: false,
    persists: false,
    maxStacks: 5,
    tickInterval: 1,
  },
  modifiers: {
    attributes: {
      cutting_resistance: function (current) {
        return current - this.quantity;
      },
      crushing_resistance: function (current) {
        return current - this.quantity;
      },
      piercing_resistance: function (current) {
        return current - this.quantity;
      },
      fire_resistance: function (current) {
        return current - this.quantity;
      },
      cold_resistance: function (current) {
        return current - this.quantity;
      },
      lightning_resistance: function (current) {
        return current - this.quantity;
      },
      earth_resistance: function (current) {
        return current - this.quantity;
      },
      acid_resistance: function (current) {
        return current - this.quantity;
      },
      chaos_resistance: function (current) {
        return current - this.quantity;
      },
      ether_resistance: function (current) {
        return current - this.quantity;
      },
      cutting_damage: function (current) {
        return current - this.quantity;
      },
      crushing_damage: function (current) {
        return current - this.quantity;
      },
      piercing_damage: function (current) {
        return current - this.quantity;
      },
      fire_damage: function (current) {
        return current - this.quantity;
      },
      cold_damage: function (current) {
        return current - this.quantity;
      },
      lightning_damage: function (current) {
        return current - this.quantity;
      },
      earth_damage: function (current) {
        return current - this.quantity;
      },
      acid_damage: function (current) {
        return current - this.quantity;
      },
      chaos_damage: function (current) {
        return current - this.quantity;
      },
      ether_damage: function (current) {
        return current - this.quantity;
      }
    }
  },
  listeners: {
    effectActivated: function () {
      Broadcast.sayAt(this.target, "<bold><red>Вы чувствуете слабость после смерти.</red></bold>");
    },

    effectDeactivated: function () {
      Broadcast.sayAt(this.target, "Вы больше не чувствуете слабость после смерти.");
    },

  }
};
