'use strict';

const { Broadcast: B, Heal, SkillType } = require('ranvier');
const Combat = require('../../combat/lib/Combat');

const manaCost = 65;

function getAttr1(player) {
  let addDamage = 0;
  if (player.hasAttribute('earth_damage')) {
    addDamage += player.getAttribute('earth_damage');
  }
  addDamage = 1+addDamage*0.05;
  return addDamage;
}

function getAttr2(player) {
  let addDamage = 0;
  if (player.hasAttribute('intellect')) {
      addDamage += player.getAttribute('intellect');
  } else {
      addDamage = 20;
  }

  addDamage = 1+addDamage*0.01;
  return addDamage;
}

function getSkill(player) {
  let addDamage = 0;
  if (player.getMeta('skill_heal') > 0) {
    addDamage = player.getMeta('skill_heal')*0.01;
  }
  return 1+addDamage;
}

/**
 * Basic cleric spell
 */
module.exports = {
  aliases: ['лечение'],
  name: 'лечение',
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
    let getHeal = Math.floor(Combat.calculateWeaponDamage(player)*getAttr1(player)*getAttr2(player)*getSkill(player));

    if (player.isNpc) {
      getHeal *= 2;
    }

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
    
    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('skill_heal') < 100) {
            let skillUp = player.getMeta('skill_heal');
            player.setMeta('skill_heal', skillUp + 1);
            Broadcast.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в заклинании \'Лечение\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Призвать силы света, чтобы они исцелили раны цели в количестве зависящем от урона оружия, интеллекта, бонусного урона землей и уровня владения умением заклинателя.`;
  }
};
