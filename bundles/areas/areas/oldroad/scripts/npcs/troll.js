const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    enterRoom: (state) => function () {
      for (const exit of this.room.exits) {
        const room = state.RoomManager.getRoom(exit.roomId);
        Broadcast.sayAt(room, 'Поблизости послышался сильный шум.');
      }
    },
  },
};
