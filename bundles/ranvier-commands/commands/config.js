'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Parser = require(srcPath + 'CommandParser').CommandParser;
  const Data = require(srcPath + 'Data');

  return {
    usage: 'конфиг <установить/список> [настройки] [значение]',
    aliases: ['настройки', 'опции', 'конфиг'],
    command: (state) => (args, player) => {
      if (!args.length) {
        Broadcast.sayAt(player, 'Настроить что?');
        return state.CommandManager.get('help').execute('config', player);
      }

      const possibleCommands = ['установить', 'список'];

      const [command, configToSet, valueToSet ] = args.split(' ');

      if (!possibleCommands.includes(command)) {
        Broadcast.sayAt(player, `<red>Неправильная команда: ${command}</red>`);
        return state.CommandManager.get('help').execute('config', player);
      }

      if (command === 'список') {
        Broadcast.sayAt(player, 'Текущие настройки:');
        for (const key in player.metadata.config) {
          const val = player.metadata.config[key] ? 'вкл' : 'выкл';
          Broadcast.sayAt(player, `  ${key}: ${val}`);
        }
        return;
      }

      if (!configToSet) {
        Broadcast.sayAt(player, 'Установить что?');
        return state.CommandManager.get('help').execute('config', player);
      }

      const possibleSettings = ['краткий', 'autoloot', 'миникарта'];

      if (!possibleSettings.includes(configToSet)) {
        Broadcast.sayAt(player, `<red>Недопустимые настройки: ${configToSet}. Возможные настройки: ${possibleSettings.join(', ')}`);
        return state.CommandManager.get('help').execute('config', player);
      }

      if (!valueToSet) {
        Broadcast.sayAt(player, `<red>Какое значение вы хотите установить для ${configToSet}?</red>`);
        return state.CommandManager.get('help').execute('config', player);
      }

      const possibleValues = {
        вкл: true,
        выкл: false
      };

      if (possibleValues[valueToSet] === undefined) {
        return Broadcast.sayAt(player, `<red>Значения должны быть: вкл / выкл.</red>`);
      }

      if (!player.getMeta('config')) {
        player.setMeta('config', {});
      }

      player.setMeta(`config.${configToSet}`, possibleValues[valueToSet]);

      Broadcast.sayAt(player, 'Настройки сохранены.');

      function listCurrentConfiguration() {
      }
    }
  };
};

