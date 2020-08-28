const { Broadcast, Damage, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const manaCost = 65;
const ddMod = 0.8; // direct damage coefficient
const stabBonus = 2; // бонус из невидимости или хайда

/**
 * Наносит увеличенный урон, если противник не видит вас
 */
module.exports = {
  aliases: ['заколоть', 'закалывание'],
  name: 'закалывание',
  gender: 'neuter',
  damageVerb: 'травмирует',
  type: SkillType.SKILL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 7,

  run: (state) => function (args, player, target) {
    if (!player.isNpc) {
      if (!player.equipment.has('оружие')) {
        return Broadcast.sayAt(player, 'Вы не вооружены.');
      }
      const weapon = player.equipment.get('оружие');
      const { requirements } = weapon.metadata;
      if (!requirements) {
        return Broadcast.sayAt(player, 'Вы должны быть вооружены кинжалом.');
      }
      const requiredSkills = weapon.metadata.requirements.skills;
      if (!requiredSkills.includes('daggers')) {
        return Broadcast.sayAt(player, 'Вы должны быть вооружены кинжалом.');
      }
    }

    let getDamage = Math.floor(SkillUtil.directSkillDamage(player, target, 'piercing', 'stab') * ddMod);

    if (player.getAttribute('hide') > target.getAttribute('detect_hide')) {
      getDamage *= stabBonus;
      Broadcast.sayAt(player, `<red><bold>Вы вонзаете свой кинжал в уязвимое место ${target.rname}!</bold></red>`);
      Broadcast.sayAtExcept(player.room, `<red><bold>${player.Name} вонзает свой кинжал в уязвимое место ${target.rname}!</bold></red>`, [player, target]);
      if (!target.isNpc) {
        Broadcast.sayAt(target, `<red><bold>${player.Name} вонзает свой кинжал в ваше уязвимое место!</bold></red>`);
      }
    } else if (player.getAttribute('invisibility') > target.getAttribute('detect_invisibility')) {
      getDamage *= stabBonus;
      Broadcast.sayAt(player, `<red><bold>Вы вонзаете свой кинжал в уязвимое место ${target.rname}!</bold></red>`);
      Broadcast.sayAtExcept(player.room, `<red><bold>${player.Name} вонзает свой кинжал в уязвимое место ${target.rname}!</bold></red>`, [player, target]);
      if (!target.isNpc) {
        Broadcast.sayAt(target, `<red><bold>${player.Name} вонзает свой кинжал в ваше уязвимое место!</bold></red>`);
      }
    } else {
      Broadcast.sayAt(player, `<red><bold>Вы вонзаете свой кинжал в ${target.vname}!</bold></red>`);
      Broadcast.sayAtExcept(player.room, `<red><bold>${player.Name} вонзает свой кинжал в ${target.vname}!</bold></red>`, [player, target]);
      if (!target.isNpc) {
        Broadcast.sayAt(target, `<red><bold>${player.Name} вонзает в вас свой кинжал!</bold></red>`);
      }
    }

    const damage = new Damage('health', getDamage, player, this);

    
    damage.commit(target);

    SkillUtil.skillUp(state, player, 'skill_stab');
  },

  info: (player) => 'Вы вонзаете свой кинжал в противника и наносите ему урон зависящий от урона вашего оружия, силы, вашего бонусного пронзающего урона, уровня владения умением и сопротивляемости пронзающему урону цели. Если противник не видит вас, то урон увеличен. Требуется кинжал.',
};
