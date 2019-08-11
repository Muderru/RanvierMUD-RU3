'use strict';

const { Broadcast: B, Heal, SkillType } = require('ranvier');

const healPercent = 300;
const manaCost = 40;

function getHeal(player) {
  return player.getAttribute('intellect') * (healPercent / 100);
}

/**
 * Basic cleric spell
 */
module.exports = {
  aliases: ['лечение'],
  name: 'Лечение',
  gender: 'neither',
  damageVerb: 'исцеляет',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: false,
  targetSelf: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 10,

  run: state => function (args, player, target) {
    const heal = new Heal('health', getHeal(player), player, this);

    if (target !== player) {
      B.sayAt(player, `<b>Вы призываете силы света, чтобы они исцелили раны ${target.rname}.</b>`);
      B.sayAtExcept(player.room, `<b>${player.name} призывает силы света, чтобы они исцелили раны ${target.rname}.</b>`, [target, player]);
      B.sayAt(target, `<b>${player.name} призывает силы света, чтобы они исцелили ваши раны.</b>`);
    } else {
      B.sayAt(player, "<b>Вы призываете силы света, чтобы они исцелили ваши раны.</b>");
      B.sayAtExcept(player.room, `<b>${player.name} призывает силы света, чтобы они исцелили его раны.</b>`, [player, target]);
    }

    heal.commit(target);
  },

  info: (player) => {
    return `Призвать силы света, чтобы они исцелили раны цели в количестве ${healPercent}% процентов от вашего интеллекта.`;
  }
};
