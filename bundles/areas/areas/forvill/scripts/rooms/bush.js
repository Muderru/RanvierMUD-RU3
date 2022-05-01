const { Broadcast, Damage } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName !== 'заползти') {
        return;
      }

      if (args !== 'за куст') {
        return Broadcast.sayAt(player, 'Куда вы хотите заползти?');
      }

      Broadcast.sayAt(player, 'Вы начали осторожно заползать за куст.');
      let ending = '';
      if (player.gender === 'male') {
        ending = '';
      } else if (player.gender === 'female') {
        ending = 'а';
      } else if (player.gender === 'plural') {
        ending = 'и';
      } else {
        ending = 'о';
      }
      Broadcast.sayAtExcept(player.room, `${player.Name} начал${ending} аккуратно заползать за куст.`, player);

      let nextRoom = null;
      const look = state.CommandManager.get('look');
      nextRoom = state.RoomManager.getRoom('forvill:70532');
      player.moveTo(nextRoom);
      look.execute(null, player, null);
      const rndDmg = Math.floor((Math.random() * 100) + 1);
      const damage = new Damage('health', rndDmg, null, this);
      damage.commit(player);
      Broadcast.sayAt(player, '<bold><red>Ой! Вы сильно поцарапались о колючки.</red></bold>');
      Broadcast.sayAtExcept(nextRoom, `${player.Name} начал${ending} выползать из дыры в заборе.`, player);
    },
  },
};
