'use strict';

const { Broadcast: B, Heal, SkillType } = require('ranvier');
const Combat = require('../../combat/lib/Combat');
const SkillUtil = require('../lib/SkillUtil');

const manaCost = 65;
const ddMod = 1; //direct heal coefficient

/**
 * Basic cleric spell
 */
module.exports = {
  aliases: ['лечение'],
  name: 'лечение',
  gender: 'neuter',
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
    let getHeal = Math.floor(SkillUtil.directHealAmount(player, target, 'earth', 'heal') * ddMod);

    const heal = new Heal('health', getHeal, player, this);

    if (target !== player) {
      B.sayAt(player, `<b>Вы призываете силы природы, чтобы они исцелили раны ${target.rname}.</b>`);
      B.sayAtExcept(player.room, `<b>${player.Name} призывает силы природы, чтобы они исцелили раны ${target.rname}.</b>`, [target, player]);
      B.sayAt(target, `<b>${player.Name} призывает силы природы, чтобы они исцелили ваши раны.</b>`);
    } else {
      B.sayAt(player, "<b>Вы призываете силы природы, чтобы они исцелили ваши раны.</b>");
      B.sayAtExcept(player.room, `<b>${player.Name} призывает силы природы, чтобы они исцелили его раны.</b>`, [player, target]);
    }

    heal.commit(target);

    SkillUtil.skillUp(state, player, 'spell_heal');
  },

  info: (player) => {
    return `Призвать силы света, чтобы они исцелили раны цели в количестве зависящем от урона оружия, интеллекта, бонусного урона землей и уровня владения умением заклинателя.`;
  }
};
