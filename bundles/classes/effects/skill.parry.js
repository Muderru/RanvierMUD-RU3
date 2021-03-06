const {
  Broadcast, EffectFlag, Heal, Player,
} = require('ranvier');

module.exports = {
  config: {
    name: 'парирование',
    gender: 'neuter',
    damageVerb: 'защищает',
    description: 'Снижает получаемый урон.',
    type: 'skill:parry',
    unique: true,
    persists: false,
    refreshes: true,
  },
  flags: [EffectFlag.BUFF],
  state: {
    magnitude: 1,
    type: 'physical',
  },
  modifiers: {
    outgoingDamage: (damage, current) => current,
    incomingDamage(damage, currentAmount) {
      if (damage instanceof Heal || damage.attribute !== 'health') {
        return currentAmount;
      }

      const absorbed = Math.min(this.state.remaining, currentAmount);
      const partial = this.state.remaining < currentAmount ? ' частично' : '';
      this.state.remaining -= absorbed;
      currentAmount -= absorbed;

      Broadcast.sayAt(this.target, `Вы${partial} парировали атаку, поглощая <bold>${absorbed}</bold> урона!`);
      if (!this.state.remaining) {
        this.remove();
      }

      return currentAmount;
    },
  },
  listeners: {
    effectActivated() {
      this.state.remaining = this.state.magnitude;

      if (this.target instanceof Player) {
        this.target.addPrompt('parry', () => {
          const width = 60 - 'Щит '.length;
          const remaining = `<b>${this.state.remaining}/${this.state.magnitude}</b>`;
          return `<b>Щит</b> ${Broadcast.progress(width, (this.state.remaining / this.state.magnitude) * 100, 'white')} ${remaining}`;
        });
      }
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, 'Вы больше не парируете атаки.');
      if (this.target instanceof Player) {
        this.target.removePrompt('parry');
      }
    },
  },
};
