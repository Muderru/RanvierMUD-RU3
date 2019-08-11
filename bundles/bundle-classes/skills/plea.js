'use strict';

const { Broadcast, Heal } = require('ranvier');

const healPercent = 20;
const manaCost = 5;
const bonusThreshold = 30;
const cooldown = 20;

/**
 * Basic cleric spell
 */
module.exports = {
  aliases: ['милость света'],
  name: 'Милость Света',
  gender: 'female',
  damageVerb: 'окутывает',
  initiatesCombat: false,
  requiresTarget: true,
  targetSelf: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown,

  run: state => function (args, player, target) {
    const maxHealth = target.getMaxAttribute('health');
    let amount = Math.round(maxHealth * (healPercent / 100));
    if (target.getAttribute('health') < (maxHealth *  (bonusThreshold / 100))) {
      amount *= 2;
    }

    const heal = new Heal('health', amount, player, this);

    if (target !== player) {
      Broadcast.sayAt(player, `<b>Вы взываете к силам Света и лечите раны ${target.rname}.</b>`);
      Broadcast.sayAtExcept(player.room, `<b>${player.name} взывает к силам Света и лечит раны ${target.rname}.</b>`, [target, player]);
      Broadcast.sayAt(target, `<b>${player.name} взывает к силам Света и лечит ваши раны.</b>`);
    } else {
      Broadcast.sayAt(player, "<b>Вы взываете к силам Света и лечите ваши раны.</b>");
      Broadcast.sayAtExcept(player.room, `<b>${player.name} взывает к силам Света и лечит свои раны.</b>`, [player, target]);
    }

    heal.commit(target);
  },

  info: (player) => {
    return `Воззвать к силам Света и вылечить <b>${healPercent}%</b> от максимального здоровья цели. Если здоровье цели меньше ${bonusThreshold}%, Милость Света излечивает в два раза больше.`;
  }
};
