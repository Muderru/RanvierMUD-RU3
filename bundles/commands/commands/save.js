const { Broadcast } = require('ranvier');

module.exports = {
  usage: 'сохранить',
  aliases: ['сохранить'],
  command: (state) => (args, player) => {
    player.save(() => {
      Broadcast.sayAt(player, 'Сохранено.');
    });
  },
};
