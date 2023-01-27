const humanize = (sec) => require('humanize-duration')(sec, { language: 'ru', round: true });
const {
  Broadcast, Logger, SkillErrors, ItemType,
} = require('ranvier');
const ArgParser = require('../../lib/lib/ArgParser');
const ItemUtil = require('../../lib/lib/ItemUtil');
const CombatErrors = require('../../combat/lib/CombatErrors');

const dot = ArgParser.parseDot;

/**
 * Команда для использования свитка
 */
module.exports = {
  aliases: ['зачитать'],
  command: (state) => (args, player) => {
    const say = (message) => Broadcast.sayAt(player, message);

    if (!args.length) {
      return say('Что вы хотите зачитать?');
    }

    const [targetItem, spellTarget] = args.split(' ');
    const item = ArgParser.parseDot(targetItem, player.inventory);

    if (!item) {
      return say('У вас ничего такого нет.');
    }

    if (item.type !== ItemType.SCROLL) {
      return say('Вы не можете использовать это.');
    }

    if (player.hasEffectType('silence')) {
      return say('<b>Вы сейчас не можете зачитывать свитки!</b>');
    }

    if (!item.getMeta('spell')) {
      return say('Вы не можете прочитать заклинание на этом свитке.');
    }

    if (item.getMeta('level') && player.level < item.getMeta('level')) {
      return say('Вы пока не можете прочитать заклинание на этом свитке, поднаберитесь опыта.');
    }

    const spell = state.SpellManager.find(item.getMeta('spell'));
    if (!spell) {
      return say('Такого заклинания не существует.');
    }

    let target = null;
    if (spell.requiresTarget) {
      if (!spellTarget) {
        if (spell.targetSelf) {
          target = player;
        } else if (player.isInCombat()) {
          target = [...player.combatants][0];
        } else {
          target = null;
        }
      } else {
        try {
          target = dot(spellTarget, player.room.players);
          if (!target) {
            target = dot(spellTarget, player.room.npcs);
          }
          if (target && target.hasAttribute('invisibility') && target.getAttribute('invisibility') > player.getAttribute('detect_invisibility')) {
            return say(`Использовать заклинание ${spell.name} на ком?`);
          }
          if (target && target.hasAttribute('hide') && target.getAttribute('hide') > player.getAttribute('detect_hide')) {
            return say(`Использовать заклинание ${spell.name} на ком?`);
          }
        } catch (e) {
          if (
            e instanceof CombatErrors.CombatSelfError
            || e instanceof CombatErrors.CombatNonPvpError
            || e instanceof CombatErrors.CombatInvalidTargetError
            || e instanceof CombatErrors.CombatPacifistError
          ) {
            return say(e.message);
          }

          Logger.error(e.message);
        }
      }

      if (!target) {
        return say(`Использовать заклинание ${spell.name} на ком?`);
      }
    }

    try {
      spell.execute(args, player, target);
    } catch (e) {
      if (e instanceof SkillErrors.CooldownError) {
        if (spell.cooldownGroup) {
          return say(`Нельзя использовать заклинание ${spell.name} пока действует задержка ${e.effect.skill.name}.`);
        }
        return say(`Вы еще не можете использовать \'${spell.name}\'. ${humanize(e.effect.remaining)} осталось.`);
      }

      if (e instanceof SkillErrors.PassiveError) {
        return say('Это пассивное умение.');
      }

      if (e instanceof SkillErrors.NotEnoughResourcesError) {
        return say('Недостаточно энергии.');
      }

      Logger.error(e.message);
      say('Как?');
    }

    state.ItemManager.remove(item);
    say('Ваш свиток исчезает в облаке дыма.');
  },
};
