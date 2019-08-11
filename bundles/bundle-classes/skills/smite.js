'use strict';

const { Broadcast, Damage } = require('ranvier');
const Combat = require('../../bundle-combat/lib/Combat');

const cooldown = 10;
const damagePercent = 350;
const manaCost = 5;

module.exports = {
  aliases: ['сокрушить', 'сокрушение'],
  name: 'Сокрушение',
  gender: 'neither',
  damageVerb: 'травмирует',
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown,

  run: state => function (args, player, target) {
    if (!player.equipment.has('оружие')) {
      return Broadcast.sayAt(player, "Вы не вооружены.");
    }

    const amount = Combat.calculateWeaponDamage(player) * (damagePercent / 100);

    const damage = new Damage('health', amount, player, this, {
      type: 'holy',
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
