const { Broadcast, Damage, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const manaCost = 60;
const ddMod = 1; // direct damage coefficient

/**
 * Basic mage spell
 */
module.exports = {
  aliases: ['огненный шар'],
  name: 'огненный шар',
  gender: 'male',
  damageVerb: 'опалил',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 5,

  run: (state) => function (args, player, target) {
    const getDamage = Math.floor(SkillUtil.directSpellDamage(player, target, 'fire', 'fireball') * ddMod);

    const damage = new Damage('health', getDamage, player, this);

    Broadcast.sayAt(player, `<bold><red>Огненная волна из ваших рук породила шар, устремившийся к ${target.dname}!</red></bold>`);
    Broadcast.sayAtExcept(player.room, `<bold><red>Огненная волна из рук ${player.rname} породила шар, устремившийся к ${target.dname}!</red></bold>`, [player, target]);
    if (!target.isNpc) {
      Broadcast.sayAt(target, `<bold><red>Огненная волна из рук ${player.rname} породила шар, устремившийся к Вам!</red></bold>`);
    }
    damage.commit(target);

    SkillUtil.skillUp(state, player, 'spell_fireball');
  },

  info: (player) => 'Создает огненный шар, наносящий урон зависящий от урона вашего оружия, интеллекта, вашего бонусного урона огнем, уровня владения умением и сопротивляемости огню цели.',
};
