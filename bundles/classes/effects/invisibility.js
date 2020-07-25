const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Effect invisibility.
 */
module.exports = {
  config: {
    name: 'невидимость',
    gender: 'female',
    description: 'Вы невидимы.',
    type: 'invisibility',
    unique: true,
    persists: false,
    refreshes: true,
  },
  flags: [EffectFlag.BUFF],
  modifiers: {
    attributes: {
      invisibility(current) {
        return current + this.state.spellStrength;
      },
    },
  },
  listeners: {
    effectActivated() {
      Broadcast.sayAt(this.target, '<cyan>Вы растворяетесь в воздухе.</cyan>');
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, '<cyan>Вы вновь видимы.</cyan>');
    },

  },
};
