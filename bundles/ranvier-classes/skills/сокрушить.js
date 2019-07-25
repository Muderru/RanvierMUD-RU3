'use strict';

const Combat = require('../../ranvier-combat/lib/Combat');

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const SkillType = require(srcPath + 'SkillType');
  const Damage = require(srcPath + 'Damage');
  const Heal = require(srcPath + 'Heal');

  // config placed here just for easy copy/paste of this skill later on
  const cooldown = 10;
  const damagePercent = 350;
  const favorAmount = 5;

  return {
    name: 'Сокрушить',
    requiresTarget: true,
    initiatesCombat: true,
    resource: {
      attribute: 'favor',
      cost: favorAmount
    },
    cooldown,

    run: state => function (args, player, target) {
      if (!player.equipment.has('правая рука')) {
        return Broadcast.sayAt(player, "Вы не вооружены.");
      }

      const damage = new Damage({
        attribute: 'health',
        amount: Combat.calculateWeaponDamage(player) * (damagePercent / 100),
        attacker: player,
        type: 'holy',
        source: this
      });

      Broadcast.sayAt(player, `<b><yellow>Вы наполнили ваше оружие святой энергией и сокрушили им ${target.vname}!</yellow></b>`);
      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `<b><yellow>${player.name} наполнил свое оружие святой энергией и сокрушил им ${target.vname}!</yellow></b>`, [target, player]);
        Broadcast.sayAt(target, `<b><yellow>${player.name} наполнил свое оружие святой энергией и сокрушил им вас!</yellow></b>`);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `<b><yellow>${player.name} наполнила свое оружие святой энергией и сокрушила им ${target.vname}!</yellow></b>`, [target, player]);
        Broadcast.sayAt(target, `<b><yellow>${player.name} наполнила свое оружие святой энергией и сокрушила им вас!</yellow></b>`);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `<b><yellow>${player.name} наполнили свои оружия святой энергией и сокрушили им ${target.vname}!</yellow></b>`, [target, player]);
        Broadcast.sayAt(target, `<b><yellow>${player.name} наполнили свои оружия святой энергией и сокрушили им вас!</yellow></b>`);
      } else {
        Broadcast.sayAtExcept(player.room, `<b><yellow>${player.name} наполнило свое оружие святой энергией и сокрушило им ${target.vname}!</yellow></b>`, [target, player]);
        Broadcast.sayAt(target, `<b><yellow>${player.name} наполнило свое оружие святой энергией и сокрушило им вас!</yellow></b>`);
      }

      damage.commit(target);
    },

    info: (player) => {
      return `Усильте ваше оружие святой энергией и бейте врага, нанося <b>${damagePercent}%</b> оружейного урона. Требует оружие.`;
    }
  };
};
