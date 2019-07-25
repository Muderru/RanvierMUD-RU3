'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');

  return  {
    listeners: {
      command: state => function (player, commandName, args) {
        Broadcast.sayAt(player, `Вы сейчас набрали специфичную для этой комнаты команду '${commandName}' с аргументом ${args}`);
      }
    }
  };
};
