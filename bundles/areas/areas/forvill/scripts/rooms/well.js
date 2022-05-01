const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName === 'прыгнуть') {
        if (args !== 'в колодец') {
          return Broadcast.sayAt(player, 'Куда вы хотите прыгнуть?');
        }
        Broadcast.sayAt(player, 'Колодец кажется очень глубоким. Вы точно разобьетесь, если спрыгнете.');
      } else if (commandName === 'спуститься') {
        if (args !== 'в колодец') {
          return Broadcast.sayAt(player, 'Куда вы хотите спуститься?');
        }
        Broadcast.sayAt(player, 'Вы аккуратно спустились в колодец по веревке.');
        let ending = '';
        if (player.gender === 'male') {
          ending = 'ся';
        } else if (player.gender === 'female') {
          ending = 'ась';
        } else if (player.gender === 'plural') {
          ending = 'ись';
        } else {
          ending = 'ось';
        }
        Broadcast.sayAtExcept(player.room, `${player.name} аккуратно спустил${ending} в колодец по веревке.`, player);
        let nextRoom = null;
        const look = state.CommandManager.get('look');
        nextRoom = state.RoomManager.getRoom('forvill:70529');
        player.moveTo(nextRoom);
        look.execute(null, player, null);
      } else {

      }
    },
  },
};
