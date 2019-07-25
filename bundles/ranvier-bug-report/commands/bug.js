'use strict';

module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');

  return {
    usage: 'ошибка <описание>',
    aliases: ['баг', 'ошибка', 'предложение'],
    command: state => (args, player, arg0) => {
      if (!args) {
        return Broadcast.sayAt(player, '<b><yellow>Пожалуйста, опишите здесь обнаруженный баг.</yellow></b>');
      }

      // TODO: There's absolutely no reason for this to be an event, just move the event code into the command
      player.emit('bugReport', {
        description: args,
        type: arg0
      });

      Broadcast.sayAt(player, `<b>Ваше ${arg0} сообщение было представлено как:</b>\n${args}`);
      Broadcast.sayAt(player, '<b>Спасибо!</b>');
    }
  };
};
