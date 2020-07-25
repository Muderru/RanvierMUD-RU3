const Ranvier = require('ranvier');

const { Broadcast, Logger } = Ranvier;
const { EquipSlotTakenError } = Ranvier.EquipErrors;
const say = Broadcast.sayAt;
const ItemUtil = require('../../lib/lib/ItemUtil');
const ArgParser = require('../../lib/lib/ArgParser');

module.exports = {
  aliases: ['одеть', 'надеть', 'вооружиться'],
  usage: 'надеть <предмет>',
  command: (state) => (arg, player) => {
    arg = arg.trim();

    if (player.equipment.size >= 10) {
      return Broadcast.sayAt(player, 'На вас больше нет свободного места.');
    }

    if (!arg.length) {
      return say(player, 'Надеть что?');
    }

    const item = ArgParser.parseDot(arg, player.inventory);

    if (!item) {
      return say(player, 'У вас ничего такого нет.');
    }

    // Начало проверок requirements
    const { requirements } = item.metadata;
    if (requirements) {
      if (!requirements.strength) {
      } else if (player.hasAttribute('strength')) {
        if (player.getAttribute('strength') < requirements.strength) {
          const diff = requirements.strength - player.getAttribute('strength');
          return say(player, `Вам не хватает ${diff} силы.`);
        }
      } else {
        return Logger.verbose('${player.name}: ошибка в атрибутах игрока.');
      }
      if (!requirements.agility) {
      } else if (player.hasAttribute('agility')) {
        if (player.getAttribute('agility') < requirements.agility) {
          const diff = requirements.agility - player.getAttribute('agility');
          return say(player, `Вам не хватает ${diff} ловкости.`);
        }
      } else {
        return Logger.verbose('${player.name}: ошибка в атрибутах игрока.');
      }
      if (!requirements.intellect) {
      } else if (player.hasAttribute('intellect')) {
        if (player.getAttribute('intellect') < requirements.intellect) {
          const diff = requirements.intellect - player.getAttribute('intellect');
          return say(player, `Вам не хватает ${diff} интеллекта.`);
        }
      } else {
        return Logger.verbose('${player.name}: ошибка в атрибутах игрока.');
      }
      if (!requirements.stamina) {
      } else if (player.hasAttribute('stamina')) {
        if (player.getAttribute('stamina') < requirements.stamina) {
          const diff = requirements.stamina - player.getAttribute('stamina');
          return say(player, `Вам не хватает ${diff} выносливости.`);
        }
      } else {
        return Logger.verbose('${player.name}: ошибка в атрибутах игрока.');
      }

      const requiredSkills = item.metadata.requirements.skills;
      for (const requiredSkill of requiredSkills) {
        const requirement = `skill_${requiredSkill}`;
        if (!player.getMeta(requirement)) {
          const skill = state.SkillManager.find(requiredSkill, true);
          return say(player, `Вам необходимо владеть умением: '${skill.name}'.`);
        }
      }
    }

    if (!item.metadata.slot) {
      return say(player, `Вы не можете надеть ${ItemUtil.display(item, 'vname')}.`);
    }

    if (item.metadata.level > player.level) {
      return say(player, `Вы пока не можете использовать ${ItemUtil.display(item, 'vname')}.`);
    }

    try {
      player.equip(item, item.metadata.slot);
    } catch (err) {
      if (err instanceof EquipSlotTakenError) {
        const conflict = player.equipment.get(item.metadata.slot);
        return say(player, `Вам нужно сначала снять ${ItemUtil.display(conflict, 'vname')}.`);
      }

      return Logger.error(err);
    }

    say(player, `<green>Вы надели</green> ${ItemUtil.display(item, 'vname')}<green>.</green>`);
    if (item.getMeta('forSell') > 0) {
      item.setMeta('forSell', 0);
    }
  },
};
