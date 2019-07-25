'use strict';

module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Heal = require(srcPath + 'Heal');
  const Player = require(srcPath + 'Player');
  const Flag = require(srcPath + 'EffectFlag');

  return {
    config: {
      name: 'Блокирование щитом',
      description: "Вы блокируете щитом физические атаки!",
      type: 'skill:shieldblock',
    },
    flags: [Flag.BUFF],
    state: {
      magnitude: 1,
      type: "physical"
    },
    modifiers: {
      outgoingDamage: (damage, current) => current,
      incomingDamage: function (damage, currentAmount) {
        if (damage instanceof Heal || damage.attribute !== 'health') {
          return currentAmount;
        }

        const absorbed = Math.min(this.state.remaining, currentAmount);
        const partial = this.state.remaining < currentAmount ? ' частично' : '';
        this.state.remaining -= absorbed;
        currentAmount -= absorbed;

        Broadcast.sayAt(this.target, `Вы${partial} блокировали атаку, избегая <bold>${absorbed}</bold> урона!`);
        if (!this.state.remaining) {
          this.remove();
        }

        return currentAmount;
      }
    },
    listeners: {
      effectActivated: function () {
        this.state.remaining = this.state.magnitude;

        if (this.target instanceof Player) {
          this.target.addPrompt('shieldblock', () => {
            const width = 60 - "Щит ".length;
            const remaining = `<b>${this.state.remaining}/${this.state.magnitude}</b>`;
            return "<b>Щит</b> " + Broadcast.progress(width, (this.state.remaining / this.state.magnitude) * 100, "white") + ` ${remaining}`;
          });
        }
      },

      effectDeactivated: function () {
        Broadcast.sayAt(this.target, 'Вы опустили ваш щит, вы теперь не можете блокировать атаки.');
        if (this.target instanceof Player) {
          this.target.removePrompt('shieldblock');
        }
      }
    }
  };
};
