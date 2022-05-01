const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    channelReceive: (state) => function (channel, sender, message) {
      if (channel.name !== 'say') {
        return;
      }

      if (!message.toLowerCase().match('друг')) {
        return;
      }

      const downExit = this.getExits().find((exit) => exit.direction === 'вниз');
      const downRoom = state.RoomManager.getRoom(downExit.roomId);

      Broadcast.sayAt(sender, "Вы произнесли 'друг', теперь вы можете войти. Секретная дверь открылась с *щелчком*.");
      downRoom.unlockDoor(this);
      downRoom.openDoor(this);
    },
  },
};
