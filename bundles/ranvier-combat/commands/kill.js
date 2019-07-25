'use strict';

const Combat = require('../lib/Combat');
const CombatErrors = require('../lib/CombatErrors');

module.exports = (srcPath) => {
  const B = require(srcPath + 'Broadcast');
  const Parser = require(srcPath + 'CommandParser').CommandParser;
  const Logger = require(srcPath + 'Logger');

  return {
    aliases: ['убить', 'атаковать'],
    command : (state) => (args, player) => {
      args = args.trim();

      if (!args.length) {
        return B.sayAt(player, 'Убить кого?');
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

      if (!target) {
        return B.sayAt(player, "Этого здесь нет.");
      }

      B.sayAt(player, `Вы атакуете ${target.vname}.`);

      player.initiateCombat(target);
      B.sayAtExcept(player.room, `${player.name} атакует ${target.vname}!`, [player, target]);
      if (!target.isNpc) {
        B.sayAt(target, `${player.name} атакует вас!`);
      }
    }
  };
};
