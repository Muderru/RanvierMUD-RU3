'use strict';

const { Broadcast: B, CommandManager } = require('ranvier');
const say = B.sayAt;
const ArgParser = require('../../lib/lib/ArgParser');

const subcommands = new CommandManager();
subcommands.add({
  name: 'list',
  aliases: ['список'],
  command: state => (options, player) => {
    if (!options.length) {
      return say(player, "Чьи задания вы хотите увидеть? задания список <нпс>");
    }

    const search = options[0];
    const npc = ArgParser.parseDot(search, player.room.npcs);
    if (!npc) {
      return say(player, `Персонажа [${search}] не найдено.`);
    }

    if (!npc.quests) {
      return say(player, `${npc.Name} не имеет для вас заданий.`);
    }

    let availableQuests = getAvailableQuests(state, player, npc);

    if (!availableQuests.length) {
      return say(player, `${npc.Name} не имеет для вас доступных заданий.`);
    }

    for (let i in availableQuests) {
      let qref = availableQuests[i];
      let quest = state.QuestFactory.get(qref);
      const displayIndex = parseInt(i, 10) + 1;
      if (state.QuestFactory.canStart(player, qref)) {
        say(player, `[<b><yellow>!</yellow></b>] - ${displayIndex}. ${quest.config.title}`);
      } else if (player.questTracker.isActive(qref)) {
        quest = player.questTracker.get(qref);
        const symbol = quest.getProgress().percent >= 100 ? '?' : '%';
        say(player, `[<b><yellow>${symbol}</yellow></b>] - ${displayIndex}. ${quest.config.title}`);
      }
    }
  }
});

subcommands.add({
  name: 'start',
  aliases: [ 'принять', 'начать' ],
  command: state => (options, player) => {
    if (options.length < 2) {
      return say(player, "Какое задание вы хотите начать выполнять? 'задание начать <нпс> <номер>'");
    }

    let [search, questIndex] = options;
    questIndex = parseInt(questIndex, 10);

    const npc = ArgParser.parseDot(search, player.room.npcs);
    if (!npc) {
      return say(player, `Персонажа [${search}] не найдено.`);
    }

    if (!npc.quests || !npc.quests.length) {
      return say(player, `У ${npc.rname} нет заданий.`);
    }

    if (isNaN(questIndex) || questIndex < 0 || questIndex > npc.quests.length) {
      return say(player, `Недопустимое задание, наберите 'задания список ${фраза}', чтобы увидеть доступные квесты.`);
    }

    let availableQuests = getAvailableQuests(state, player, npc);

    const targetQuest = availableQuests[questIndex - 1];

    if (player.questTracker.isActive(targetQuest)) {
      return say(player, "Вы уже начали выполнять это задание. Наберите 'задания журнал', чтобы увидеть активные квесты.");
    }

    const quest = state.QuestFactory.create(state, targetQuest, player);
    player.questTracker.start(quest);
    player.save();
  }
});

subcommands.add({
  name: 'log',
  aliases: [ 'журнал', 'лог' ],
  command: state => (options, player) => {
    const active = [...player.questTracker.activeQuests];
    if (!active.length) {
      return say(player, "У вас нет активных заданий.");
    }

    for (let i in active) {
      const [, quest] = active[i];
      const progress = quest.getProgress();

      B.at(player, '<b><yellow>' + (parseInt(i, 10) + 1) + '</yellow></b>: ');
      say(player, B.progress(60, progress.percent, 'yellow') + ` ${progress.percent}%`);
      say(player, B.indent('<b><yellow>' + quest.getProgress().display + '</yellow></b>', 2));

      if (quest.config.npc) {
        const npc = state.MobFactory.getDefinition(quest.config.npc);
        say(player, `  <b><yellow>Задание дал: ${npc.name}</yellow></b>`);
      }

      say(player, '  ' + B.line(78));
      say(
        player,
        B.indent(
          B.wrap(`<b><yellow>${quest.config.description}</yellow></b>`, 78),
          2
        )
      );

      if (quest.config.rewards.length) {
        say(player);
        say(player, '<b><yellow>' + B.center(80, 'Награды') + '</yellow></b>');
        say(player, '<b><yellow>' + B.center(80, '-------') + '</yellow></b>');

        for (const reward of quest.config.rewards) {
          const rewardClass = state.QuestRewardManager.get(reward.type);
          say(player, '  ' + rewardClass.display(state, quest, reward.config, player));
        }
      }

      say(player, '  ' + B.line(78));
    }
  }
});

subcommands.add({
  name: 'complete',
  aliases: [ 'закончить', 'завершить' ],
  command: (state) => (options, player) => {
    const active = [...player.questTracker.activeQuests];
    let targetQuest = parseInt(options[0], 10);
    targetQuest = isNaN(targetQuest) ? -1 : targetQuest - 1;
    if (!active[targetQuest]) {
      return say(player, "Несуществующее задание, наберите 'задания журнал', чтобы увидеть активные квесты.");
    }

    const [, quest ] = active[targetQuest];

    if (quest.getProgress().percent < 100) {
      say(player, `${quest.config.title} еще не завершен.`);
      quest.emit('progress', quest.getProgress());
      return;
    }

    if (quest.config.npc && ![...player.room.npcs].find((npc) => npc.entityReference === quest.config.npc)) {
      const npc = state.MobFactory.getDefinition(quest.config.npc);
      return say(player, `Ваш работодатель [${npc.name}] не в этой комнате.`);
    }

    quest.complete();
    player.save();
  }
});

module.exports = {
  usage: 'задания <журнал/список/завершить/начать> [нпс] [номер]',
  aliases: [ 'задания', 'задание' ],
  command : (state) => (args, player) => {
    if (!args.length) {
      return say(player, "Отсутствует такая команда. Смотрите 'помощь задания'");
    }

    const [ command, ...options ] = args.split(' ');

    const subcommand = subcommands.find(command);
    if (!subcommand) {
      return say(player, "Недопустимая команда. Смотрите 'помощь задания'");
    }

    subcommand.command(state)(options, player);
  }
};

function getAvailableQuests(state, player, npc) {
  return npc.quests .filter(qref => {
    return state.QuestFactory.canStart(player, qref) || player.questTracker.isActive(qref);
  });
}
