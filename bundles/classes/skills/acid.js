'use strict';

const { Broadcast, Damage, SkillType } = require('ranvier');
const Combat = require('../../combat/lib/Combat');

const manaCost = 80;

function getAttr1(player, target) {
  let addDamage = 0;
  if (player.hasAttribute('acid_damage')) {
    if (target.hasAttribute('acid_resistance')) {
      if (player.getAttribute('acid_damage') > target.getAttribute('acid_resistance')) {
        addDamage += player.getAttribute('acid_damage') - target.getAttribute('acid_resistance');
      }
    } else {
        addDamage += player.getAttribute('acid_damage');
    }
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
  if (player.getMeta('spell_acid') > 0) {
    addDamage = player.getMeta('spell_acid')*0.01;
  }
  return 1+addDamage;
}

/**
 * Basic mage spell
 */
module.exports = {
  aliases: ['кислота'],
  name: 'кислота',
  gender: 'female',
  damageVerb: 'разъедает',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 15,

  run: state => function (args, player, target) {
    let getDamage = Math.floor(0.9*Combat.calculateWeaponDamage(player)*getAttr1(player, target)*getAttr2(player)*getSkill(player));

    if (player.isNpc) {
      getDamage *= 2;
    }

    const damage = new Damage('health', getDamage, player, this, {
      type: 'physical',
    });

    let duration = 0;
    if (player.hasAttribute('agility')) {
        duration += 3000*(1 + Math.floor(player.getAttribute('agility')/10));
    }

    if (target.hasAttribute('armor')) {
      const effect = state.EffectFactory.create('acid', {duration}, {spellStrength: Math.floor(getDamage/10)});
      target.addEffect(effect);
    }

    Broadcast.sayAt(player, `<bold><green>Вы извергаете поток кислоты в ${target.vname}!</green></bold>`);
    Broadcast.sayAtExcept(player.room, `<bold><green>${player.Name} извергает поток кислоты в ${target.vname}!</green></bold>`, [player, target]);
    if (!target.isNpc) {
      Broadcast.sayAt(target, `<bold><green>${player.Name} извергает поток кислоты в ВАС!</green></bold>`);
    }
    damage.commit(target);
    
    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('spell_acid') < 100) {
            let skillUp = player.getMeta('spell_acid');
            player.setMeta('spell_acid', skillUp + 1);
            Broadcast.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в заклинании \'Кислота\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Создает поток кислоты, наносящую урон зависящий от урона вашего оружия, интеллекта, вашего бонусного урона кислотой, уровня владения умением и сопротивляемости кислоте цели. Уменьшает броню противника.`;
  }
};
