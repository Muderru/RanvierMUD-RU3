'use strict';

const { Broadcast: B } = require('ranvier');

module.exports = {
  usage: 'конфиг <установить/список> [настройки] [значение]',
  aliases: ['настройки', 'опции', 'конфиг'],
  command: (state) => (args, player) => {
    if (!args.length) {
      B.sayAt(player, 'Настроить что?');
      return state.CommandManager.get('help').execute('config', player);
    }

    const possibleCommands = ['установить', 'список'];

    const [command, configToSet, valueToSet ] = args.split(' ');

    if (!possibleCommands.includes(command)) {
      B.sayAt(player, `<red>Неправильная команда: ${command}</red>`);
      return state.CommandManager.get('help').execute('config', player);
    }

    if (command === 'список') {
      B.sayAt(player, 'Текущие настройки:');
      for (const key in player.metadata.config) {
        const val = player.metadata.config[key] ? 'вкл' : 'выкл';
        B.sayAt(player, `  ${key}: ${val}`);
      }
      return;
    }

    if (!configToSet) {
      B.sayAt(player, 'Установить что?');
      return state.CommandManager.get('help').execute('config', player);
    }

    const possibleSettings = ['краткий', 'autoloot', 'миникарта'];

    if (!possibleSettings.includes(configToSet)) {
      B.sayAt(player, `<red>Недопустимые настройки: ${configToSet}. Возможные настройки: ${possibleSettings.join(', ')}</red>`);
      return state.CommandManager.get('help').execute('config', player);
    }

    if (!valueToSet) {
      B.sayAt(player, `<red>Какое значение вы хотите установить для ${configToSet}?</red>`);
      return state.CommandManager.get('help').execute('config', player);
    }

    const possibleValues = {
      вкл: true,
      выкл: false
    };

    if (possibleValues[valueToSet] === undefined) {
      return B.sayAt(player, `<red>Значения должны быть: вкл / выкл.</red>`);
    }

    if (!player.getMeta('config')) {
      player.setMeta('config', {});
    }

    player.setMeta(`config.${configToSet}`, possibleValues[valueToSet]);

    B.sayAt(player, 'Настройки сохранены.');
  }
};

