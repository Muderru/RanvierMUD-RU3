const humanize = (sec) => require('humanize-duration')(sec, { language: 'ru', round: true });
const { Broadcast, Logger, SkillErrors } = require('ranvier');
const ArgParser = require('../../lib/lib/ArgParser');
const ItemUtil = require('../../lib/lib/ItemUtil');

/**
 * Command for items with `usable` behavior. See bundles/ranvier-areas/areas/limbo/items.yml for
 * example behavior implementation
 */
module.exports = {
  aliases: ['осушить', 'использовать'],
  command: (state) => (args, player) => {
    const say = (message) => Broadcast.sayAt(player, message);

    if (!args.length) {
      return say('Что вы хотите использовать?');
    }

    const item = ArgParser.parseDot(args, player.inventory);

    if (!item) {
      return say('У вас ничего такого нет.');
    }

    const { usable } = item.metadata;
    if (!usable) {
      return say('Вы не можете использовать это.');
    }

    if ('charges' in usable && usable.charges <= 0) {
      return say(`Вы израсходовали всю магию в ${ItemUtil.display(item, 'pname')}.`);
    }

    if (usable.spell) {
      const useSpell = state.SpellManager.get(usable.spell);

      if (!useSpell) {
        Logger.error(`Item: ${item.entityReference} has invalid usable configuration.`);
        return say('Вы не можете использовать это.');
      }

      useSpell.options = usable.options;
      if (usable.cooldown) {
        useSpell.cooldownLength = usable.cooldown;
      }

      try {
        useSpell.execute(/* args */ null, player);
      } catch (e) {
        if (e instanceof SkillErrors.CooldownError) {
          return say(`${useSpell.name} задержка ещё не прошла. Осталось ${humanize(e.effect.remaining)}.`);
        }

        if (e instanceof SkillErrors.PassiveError) {
          return say('Это пассивное умение.');
        }

        if (e instanceof SkillErrors.NotEnoughResourcesError) {
          return say('У вас недостаточно сил.');
        }

        Logger.error(e.message);
        say('Чего?');
      }
    }

    if (usable.effect) {
      const effectConfig = { name: item.name, ...usable.config || {} };
      const effectState = usable.state || {};

      const useEffect = state.EffectFactory.create(usable.effect, effectConfig, effectState);
      if (!useEffect) {
        Logger.error(`Item: ${item.entityReference} has invalid usable configuration.`);
        return say('Вы не можете использовать это.');
      }

      if (!player.addEffect(useEffect)) {
        return say('Ничего не случилось.');
      }
    }

    if (!('charges' in usable)) {
      return;
    }

    usable.charges--;

    if (usable.destroyOnDepleted && usable.charges <= 0) {
      if (item.gender === 'male') {
        say(`Вы израсходовали всю магию в ${ItemUtil.display(item, 'pname')} и он исчез в облаке дыма.`);
      } else if (item.gender === 'female') {
        say(`Вы израсходовали всю магию в ${ItemUtil.display(item, 'pname')} и она исчезла в облаке дыма.`);
      } else if (item.gender === 'plural') {
        say(`Вы израсходовали всю магию в ${ItemUtil.display(item, 'pname')} и они исчезли в облаке дыма.`);
      } else {
        say(`Вы израсходовали всю магию в ${ItemUtil.display(item, 'pname')} и оно исчезло в облаке дыма.`);
      }
      state.ItemManager.remove(item);
    }
  },
};
