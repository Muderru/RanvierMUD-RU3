const { Broadcast: B } = require('ranvier');

module.exports = {
  usage: 'конфиг <установить/список> [настройки] [значение]',
  aliases: ['настройки', 'опции', 'конфиг'],
  command: (state) => (args, player) => {
    if (!args.length) {
      B.sayAt(player, 'Настроить что?');
      return state.CommandManager.get('help').execute('настройки', player);
    }

    const possibleCommands = ['установить', 'список'];

    const [command, configToSet, valueToSet] = args.split(' ');

    if (!possibleCommands.includes(command)) {
      B.sayAt(player, `<red>Неправильная команда: ${command}</red>`);
      return state.CommandManager.get('help').execute('настройки', player);
    }

    if (command === 'список') {
      B.sayAt(player, 'Текущие настройки:');
      for (const key in player.metadata.config) {
        let val = '';
        if (key !== 'магсимвол') {
          val = player.metadata.config[key] ? 'вкл' : 'выкл';
        } else {
          val = player.metadata.config[key];
        }
        B.sayAt(player, `  ${key}: ${val}`);
      }
      return;
    }

    if (!configToSet) {
      B.sayAt(player, 'Установить что?');
      return state.CommandManager.get('help').execute('настройки', player);
    }

    const possibleSettings = ['краткий', 'автосбор', 'миникарта', 'магсимвол'];

    if (!possibleSettings.includes(configToSet)) {
      B.sayAt(player, `<red>Недопустимые настройки: ${configToSet}. Возможные настройки: ${possibleSettings.join(', ')}</red>`);
      return state.CommandManager.get('help').execute('настройки', player);
    }

    if (!valueToSet) {
      B.sayAt(player, `<red>Какое значение вы хотите установить для ${configToSet}?</red>`);
      return state.CommandManager.get('help').execute('настройки', player);
    }

    const possibleValues = {
      вкл: true,
      выкл: false,
    };

    if (configToSet !== 'магсимвол') {
      if (possibleValues[valueToSet] === undefined) {
        return B.sayAt(player, '<red>Значения должны быть: вкл / выкл.</red>');
      }
    } else if (valueToSet.length > 1) {
      return B.sayAt(player, '<red>Символ должен быть только один.</red>');
    }

    if (!player.getMeta('config')) {
      player.setMeta('config', {});
    }

    if (configToSet !== 'магсимвол') {
      player.setMeta(`config.${configToSet}`, possibleValues[valueToSet]);
    } else {
      player.setMeta(`config.${configToSet}`, valueToSet);
    }

    B.sayAt(player, 'Настройки сохранены.');
  },
};
