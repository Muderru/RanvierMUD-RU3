const { Broadcast, EffectFlag } = require('ranvier');

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
  flags: [EffectFlag.DEBUFF],
  modifiers: {
    attributes: {
      cutting_resistance(current) {
        return current - this.state.quantity;
      },
      crushing_resistance(current) {
        return current - this.state.quantity;
      },
      piercing_resistance(current) {
        return current - this.state.quantity;
      },
      fire_resistance(current) {
        return current - this.state.quantity;
      },
      cold_resistance(current) {
        return current - this.state.quantity;
      },
      lightning_resistance(current) {
        return current - this.state.quantity;
      },
      earth_resistance(current) {
        return current - this.state.quantity;
      },
      acid_resistance(current) {
        return current - this.state.quantity;
      },
      chaos_resistance(current) {
        return current - this.state.quantity;
      },
      ether_resistance(current) {
        return current - this.state.quantity;
      },
      cutting_damage(current) {
        return current - this.state.quantity;
      },
      crushing_damage(current) {
        return current - this.state.quantity;
      },
      piercing_damage(current) {
        return current - this.state.quantity;
      },
      fire_damage(current) {
        return current - this.state.quantity;
      },
      cold_damage(current) {
        return current - this.state.quantity;
      },
      lightning_damage(current) {
        return current - this.state.quantity;
      },
      earth_damage(current) {
        return current - this.state.quantity;
      },
      acid_damage(current) {
        return current - this.state.quantity;
      },
      chaos_damage(current) {
        return current - this.state.quantity;
      },
      ether_damage(current) {
        return current - this.state.quantity;
      },
    },
  },
  listeners: {
    effectActivated() {
      Broadcast.sayAt(this.target, '<bold><red>Вы чувствуете слабость после смерти.</red></bold>');
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, 'Вы больше не чувствуете слабость после смерти.');
    },

  },
};
