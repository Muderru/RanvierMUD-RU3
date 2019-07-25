'use strict';

const humanize = (sec) => { return require('humanize-duration')(sec, { round: true }); };
/**
 * Command for items with `usable` behavior. See bundles/ranvier-areas/areas/limbo/items.yml for
 * example behavior implementation
 */
module.exports = (srcPath, bundlePath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Logger = require(srcPath + 'Logger');
  const { CommandParser } = require(srcPath + 'CommandParser');
  const ItemUtil = require(bundlePath + 'ranvier-lib/lib/ItemUtil');
  const SkillErrors = require(srcPath + 'SkillErrors');

  return {
    aliases: [ 'осушить', 'зачитать', 'использовать' ],
    command: state => (args, player) => {
      const say = message => Broadcast.sayAt(player, message);

      if (!args.length) {
        return say("Что вы хотите использовать?");
      }

      const item = CommandParser.parseDot(args, player.inventory);

      if (!item) {
        return say("У вас ничего такого нет.");
      }

      const usable = item.getBehavior('usable');
      if (!usable) {
        return say("Вы не можете использовать это.");
      }

      if ('charges' in usable && usable.charges <= 0) {
        return say(`Вы израсходовали всю магию в ${ItemUtil.display(item)}.`);
      }

      if (usable.spell) {
        const useSpell = state.SpellManager.get(usable.spell);

        if (!useSpell) {
          Logger.error(`Предмет: ${item.entityReference} имеет недопустимую конфигурацию использования.`);
          return say("Вы не можете использовать это.");
        }

        useSpell.options = usable.options;
        if (usable.cooldown) {
          useSpell.cooldownLength = usable.cooldown;
        }

        try {
          useSpell.execute(/* args */ null, player);
        } catch (e) {
          if (e instanceof SkillErrors.CooldownError) {
            return say(`${useSpell.name} задержка не прошла. ${humanize(e.effect.remaining)} осталось.`);
          }

          if (e instanceof SkillErrors.PassiveError) {
            return say(`Это пассивное умение.`);
          }

          if (e instanceof SkillErrors.NotEnoughResourcesError) {
            return say(`У вас недостаточно ресурсов.`);
          }

          Logger.error(e.message);
          B.sayAt(this, 'Как?');
        }
      }

      if (usable.effect) {
        const effectConfig = Object.assign({
          name: item.name
        }, usable.config || {});
        const effectState = usable.state || {};

        let useEffect = state.EffectFactory.create(usable.effect, player, effectConfig, effectState);
        if (!useEffect) {
          Logger.error(`Предмет: ${item.entityReference} имеет недопустимую конфигурацию использования.`);
          return say("Вы не можете использовать это.");
        }

        if (!player.addEffect(useEffect)) {
          return say("Ничего не случилось.");
        }
      }

      if (!('charges' in usable)) {
        return;
      }

      usable.charges--;

      if (usable.destroyOnDepleted && usable.charges <= 0) {
         if (item.gender === 'male') {
           say(`Вы израсходовали всю магию в ${ItemUtil.display(item)} и он исчез в облаке дыма.`);
         } else if (item.gender === 'female') {
           say(`Вы израсходовали всю магию в ${ItemUtil.display(item)} и она исчезла в облаке дыма.`);
         } else if (item.gender === 'plural') {
           say(`Вы израсходовали всю магию в ${ItemUtil.display(item)} и они исчезли в облаке дыма.`);
         } else {
           say(`Вы израсходовали всю магию в ${ItemUtil.display(item)} и оно исчезло в облаке дыма.`);
         }

        state.ItemManager.remove(item);
      }
    }
  };
};
