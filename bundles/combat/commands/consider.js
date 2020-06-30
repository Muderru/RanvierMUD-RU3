'use strict';

const Combat = require('../lib/Combat');
const CombatErrors = require('../lib/CombatErrors');
const { Broadcast: B, Logger } = require('ranvier');

module.exports = {
  usage: 'оценить <цель>',
  aliases: ['оценить', 'сравнить'],
  command: state => (args, player) => {
    if (!args || !args.length) {
      return B.sayAt(player, 'Чью боевую мощь вы хотите оценить?');
    }

    let target = null;
    try {
      target = Combat.findCombatant(player, args);
    } catch (e) {
      if (
        e instanceof CombatErrors.CombatSelfError ||
        e instanceof CombatErrors.CombatNonPvpError ||
        e instanceof CombatErrors.CombatInvalidTargetError ||
        e instanceof CombatErrors.CombatPacifistError
      ) {
        return B.sayAt(player, e.message);
      }

      Logger.error(e.message);
    }

    if (target) {
      if (target.hasAttribute('invisibility') && target.getAttribute('invisibility') > player.getAttribute('detect_invisibility')) {
        return B.sayAt(player, "Этого здесь нет.");
      }
      if (target.hasAttribute('hide') && target.getAttribute('hide') > player.getAttribute('detect_hide')) {
        return B.sayAt(player, "Этого здесь нет.");
      }
    }


    if (!target) {
      return B.sayAt(player, "Этого здесь нет.");
    }

    if (!target.hasAttribute('health')) {
      return B.sayAt(player, "Это не противник.");
    }

    let description = '';
    let targetPower = 0;
    let playerPower = 0;
    const avg1 = (target.max_damage + target.min_damage) / 2;
    const weaponDamage = Combat.getWeaponDamage(player);
    const max = Combat.normalizeWeaponDamage(player, weaponDamage.max);
    const min = Combat.normalizeWeaponDamage(player, weaponDamage.min);
    const avg2 = (max + min) / 2;
    targetPower = target.getAttribute('health') * Math.sqrt(1 + target.getAttribute('armor')) * avg1;
    playerPower = player.getAttribute('health') * Math.sqrt(1 + player.getAttribute('armor')) * avg2;
    const ratio = targetPower/playerPower;
    if (ratio < 0.5) {
      description = 'Цель намного слабее вас. Вы должны победить без проблем.';
    } else if (ratio >= 0.5 && ratio < 0.8) {
      description = 'Цель немного слабее вас, вам нужно соблюдать осторожность.';
    } else if (ratio >= 1.2 && ratio < 1.5) {
      description = 'Цель немного сильнее вас. Вам понадобится удача в сражении с ней.';
    } else if (ratio >= 1.5) {
      description = 'Цель намного сильнее вас. Вам не победить в одиночку.';
    } else {
      description = 'Ваши силы примерно равны. Сложно предсказать результат битвы.';
    }

//    B.sayAt(player, `${ratio}`);
    B.sayAt(player, description);
  }
};
