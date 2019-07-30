'use strict';

const { Broadcast: B, PlayerRoles } = require('ranvier');

/**
 * Command to allow you to reload a command's definition from disk without restarting the server
 */
module.exports = {
  requiredRole: PlayerRoles.ADMIN,
  usage: 'hotfix <command name>',
  aliases: ['исправить'],
  command: state => (commandName, player) => {
    if (!commandName || !commandName.length) {
      return B.sayAt(player, 'Какую команду вы хотите исправить?');
    }

    const command = state.CommandManager.get(commandName);
    if (!command) {
      return B.sayAt(player, 'Такой команды нет, для добавления новой команды перезагрузите сервер.');
    }

    delete require.cache[require.resolve(command.file)];
    B.sayAt(player, `<b><red>ИСПРАВЛЕНИЕ</red></b>: [${commandName}]...`);

    const newCommand = state.BundleManager.createCommand(command.file, command.name, command.bundle);
    state.CommandManager.add(newCommand);
    B.sayAt(player, `<b><red>ИСПРАВЛЕНИЕ</red></b>: Выполнено!`);
  }
};
