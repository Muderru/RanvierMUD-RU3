'use strict';

/**
 * Health potion item spell
 */
module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Heal = require(srcPath + 'Heal');
  const SkillType = require(srcPath + 'SkillType');

  return {
    name: 'Зелье',
    type: SkillType.SPELL,
    requiresTarget: true,
    targetSelf: true,

    run: state => function (args, player) {
      const restorePercent = this.options.restore || 0;
      const stat = this.options.stat || 'health';
      const heal = new Heal({
        attribute: stat,
        amount: Math.round(player.getMaxAttribute('health') * (this.options.restores / 100)),
        attacker: player,
        source: this
      });

      Broadcast.sayAt(player, `<bold>Вы выпиваете зелье и теплое чувство заполняет ваше тело.</bold>`);
      heal.commit(player);
    },

    info: function (player) {
      return `Восстанавливает <b>${this.options.restores}%</b> от вашего ${this.options.stat}.`;
    }
  };
};
