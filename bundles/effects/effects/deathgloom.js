'use strict';

const { Broadcast } = require('ranvier');

/**
 * Аффект снижения характеристик после смерти
 */
module.exports = {
  config: {
    name: 'Слабость после смерти',
    description: 'После смерти игрока, его характеристики снижены.',
    duration: 1000 * 60 * 10,
    unique: false,
    persists: true,
    type: 'death_debuff',
    maxStacks: 5,
    tickInterval: 1,
  },
  modifiers: {
    attributes: {
      cutting_resistance: function (current) {
        return current - this.state.quantity;
      },
      crushing_resistance: function (current) {
        return current - this.state.quantity;
      },
      piercing_resistance: function (current) {
        return current - this.state.quantity;
      },
      fire_resistance: function (current) {
        return current - this.state.quantity;
      },
      cold_resistance: function (current) {
        return current - this.state.quantity;
      },
      lightning_resistance: function (current) {
        return current - this.state.quantity;
      },
      earth_resistance: function (current) {
        return current - this.state.quantity;
      },
      acid_resistance: function (current) {
        return current - this.state.quantity;
      },
      chaos_resistance: function (current) {
        return current - this.state.quantity;
      },
      ether_resistance: function (current) {
        return current - this.state.quantity;
      },
      cutting_damage: function (current) {
        return current - this.state.quantity;
      },
      crushing_damage: function (current) {
        return current - this.state.quantity;
      },
      piercing_damage: function (current) {
        return current - this.state.quantity;
      },
      fire_damage: function (current) {
        return current - this.state.quantity;
      },
      cold_damage: function (current) {
        return current - this.state.quantity;
      },
      lightning_damage: function (current) {
        return current - this.state.quantity;
      },
      earth_damage: function (current) {
        return current - this.state.quantity;
      },
      acid_damage: function (current) {
        return current - this.state.quantity;
      },
      chaos_damage: function (current) {
        return current - this.state.quantity;
      },
      ether_damage: function (current) {
        return current - this.state.quantity;
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
