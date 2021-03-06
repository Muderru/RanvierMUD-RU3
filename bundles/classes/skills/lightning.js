const { Broadcast, Damage, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const cooldown = 6;
const manaCost = 60;
const ddMod = 0.95; // direct damage coefficient
const dbMod = 0.1; // debaff coefficient

/**
 * Basic mage spell
 */
module.exports = {
  aliases: ['молния'],
  name: 'молния',
  gender: 'female',
  damageVerb: 'поразила',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown,

  run: (state) => function (args, player, target) {
    const getDamage = Math.floor(SkillUtil.directSpellDamage(player, target, 'lightning', 'lightning') * ddMod);
    const damageHealth = ddMod * getDamage;
    const damageMana = dbMod * getDamage;

    const damage1 = new Damage('health', damageHealth, player, this);

    Broadcast.sayAt(player, `<bold><cyan>Ваши руки заискрились и выпустили мощную молнию в ${target.vname}!</cyan></bold>`);
    Broadcast.sayAtExcept(player.room, `<bold><cyan>Руки ${player.rname} заискрились и выпустили мощную молнию в ${target.vname}!</cyan></bold>`, [player, target]);
    if (!target.isNpc) {
      Broadcast.sayAt(target, `<bold><cyan>Руки ${player.rname} заискрились и выпустили мощную молнию в ВАС!</cyan></bold>`);
    }

    damage1.commit(target);
    if (target.hasAttribute('mana') && target.hasAttribute('mana') > 0) {
      const damage2 = new Damage('mana', damageMana, player, this, {
        hidden: true,
      });
      damage2.commit(target);
    }

    SkillUtil.skillUp(state, player, 'spell_lightning');
  },

  info: (player) => 'Создает мощную молнию, наносящий урон зависящий от урона вашего оружия, интеллекта, вашего бонусного урона молнией, уровня владения умением и сопротивляемости молнии цели. Сжигает часть маны противника.',
};
