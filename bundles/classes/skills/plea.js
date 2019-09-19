'use strict';

const { Broadcast, Heal, SkillType } = require('ranvier');

const manaCost = 80;
const bonusThreshold = 30;
const cooldown = 10;

function getAttr1(player) {
  let addDamage = 0;
  if (player.hasAttribute('ether_damage')) {
    addDamage += player.getAttribute('ether_damage');
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
  if (player.getMeta('spell_plea') > 0) {
    addDamage = player.getMeta('spell_plea')*0.01;
  }
  return 1+addDamage;
}

/**
 * Basic cleric spell
 */
module.exports = {
  aliases: ['милость света'],
  name: 'Милость Света',
  gender: 'female',
  damageVerb: 'окутывает',
  type: SkillType.SPELL,
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
    let amount = Math.floor(0.8*Combat.calculateWeaponDamage(player)*getAttr1(player)*getAttr2(player)*getSkill(player));

    if (player.isNpc) {
      amount *= 2;
    }

    if (target.getAttribute('health') < (maxHealth * (bonusThreshold / 100))) {
      amount *= 2;
    }

    const heal = new Heal('health', amount, player, this);

    if (target !== player) {
      Broadcast.sayAt(player, `<b>Вы взываете к силам Света и лечите раны ${target.rname}.</b>`);
      Broadcast.sayAtExcept(player.room, `<b>${player.Name} взывает к силам Света и лечит раны ${target.rname}.</b>`, [target, player]);
      Broadcast.sayAt(target, `<b>${player.Name} взывает к силам Света и лечит ваши раны.</b>`);
    } else {
      Broadcast.sayAt(player, "<b>Вы взываете к силам Света и лечите ваши раны.</b>");
      Broadcast.sayAtExcept(player.room, `<b>${player.Name} взывает к силам Света и лечит свои раны.</b>`, [player, target]);
    }

    heal.commit(target);

    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('spell_plea') < 100) {
            let skillUp = player.getMeta('spell_plea');
            player.setMeta('spell_plea', skillUp + 1);
            Broadcast.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в заклинании \'Милость Света\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Воззвать к силам Света и восстановить жизнь цели в количестве зависящем от урона оружия, интеллекта, бонусного урона эфиром и уровня владения умением заклинателя. Если здоровье цели меньше ${bonusThreshold}%, Милость Света излечивает в два раза больше.`;
  }
};
