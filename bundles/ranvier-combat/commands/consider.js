'use strict';

const Combat = require('../lib/Combat');
const CombatErrors = require('../lib/CombatErrors');

module.exports = srcPath => {
  const B = require(srcPath + 'Broadcast');
  const Logger = require(srcPath + 'Logger');

  return {
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

      if (!target) {
        return B.sayAt(player, 'Его здесь нет.');
      }

      let description = '';
      switch (true) {
        case (player.level  - target.level > 4):
          description = 'Цель намного слабее вас. Вы можете победить нескольких таких.';
          break;
        case (target.level - player.level > 9):
          description = 'Цель <b>намного</b> сильнее вас. Он убьет вас и изнасилует ваш труп.';
          break;
        case (target.level - player.level > 5):
          description = 'Цель немного сильнее вас. Вам понадобится удача в сражении с ним.';
          break;
        case (target.level - player.level > 3):
          description = 'Цель чуть сильнее вас. Вы сможете выжить, но победить вряд ли.';
          break;
        default:
          description = 'Ваши силы примерно равны. Сложно предсказать результат битвы.';
          break;
      }

      B.sayAt(player, description);
    }
  };
};
