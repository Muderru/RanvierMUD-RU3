'use strict';

const { Broadcast, Heal, SkillType } = require('ranvier');

/**
 * Health potion item spell
 */
module.exports = {
  name: 'Зелье',
  gender: 'neither',
  damageVerb: 'восстанавливает',
  type: SkillType.SPELL,
  requiresTarget: true,
  targetSelf: true,

  run: state => function (args, player) {
    const stat = this.options.stat || 'health';
    const amount = Math.round(player.getMaxAttribute('health') * (this.options.restores / 100));
    const heal = new Heal(stat, amount, player, this);

    Broadcast.sayAt(player, `<bold>Вы выпиваете зелье и теплое чувство заполняет ваше тело.</bold>`);
    heal.commit(player);
  },

  info: function (player) {
    return `Восстанавливает <b>${this.options.restores}%</b> от вашего ${this.options.stat}.`;
  }
};
