const { Broadcast, EffectFlag } = require('ranvier');

module.exports = {
  config: {
    name: 'Увеличение силы',
    description: 'Вы чувствуете прилив сил!',
    duration: 30 * 1000,
    type: 'buff.strength',
  },
  flags: [EffectFlag.BUFF],
  state: {
    magnitude: 5,
  },
  modifiers: {
    attributes: {
      strength(current) {
        return current + this.state.magnitude;
      },
    },
  },
  listeners: {
    effectActivated() {
      Broadcast.sayAt(this.target, 'Ваши мышцы увеличиваются в размерах!');
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, 'Вы чувствуете себя слабее.');
    },
  },
};
