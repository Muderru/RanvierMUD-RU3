const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    enterRoom: (state) => function () {
      let room = null;
      let target = null;
      if (this.room.id === 66742) {
        room = state.RoomManager.getRoom('spdfor:66709');
        Broadcast.sayAt(room, 'Сверху послышался подозрительный шум.');
        if (room.players.size > 0) {
          target = Array.from(room.players)[Math.floor(Math.random() * room.players.size)];
          if (target.isInCombat()) {
            return;
          }
          Broadcast.sayAt(target, 'Вас что-то потащило вверх!');
          Broadcast.sayAtExcept(room, `${target.Vname} что-то потащило вверх.`, target);
          target.moveTo(this.room);
          this.initiateCombat(target);
        }
      } else if (this.room.id === 66743) {
        room = state.RoomManager.getRoom('spdfor:66710');
        Broadcast.sayAt(room, 'Сверху послышался подозрительный шум.');
        if (room.players.size > 0) {
          target = Array.from(room.players)[Math.floor(Math.random() * room.players.size)];
          if (target.isInCombat()) {
            return;
          }
          Broadcast.sayAt(target, 'Вас что-то потащило вверх!');
          Broadcast.sayAtExcept(room, `${target.Vname} что-то потащило вверх.`, target);
          target.moveTo(this.room);
          this.initiateCombat(target);
        }
      } else if (this.room.id === 66744) {
        room = state.RoomManager.getRoom('spdfor:66712');
        Broadcast.sayAt(room, 'Сверху послышался подозрительный шум.');
        if (room.players.size > 0) {
          target = Array.from(room.players)[Math.floor(Math.random() * room.players.size)];
          if (target.isInCombat()) {
            return;
          }
          Broadcast.sayAt(target, 'Вас что-то потащило вверх!');
          Broadcast.sayAtExcept(room, `${target.Vname} что-то потащило вверх.`, target);
          target.moveTo(this.room);
          this.initiateCombat(target);
        }
      } else if (this.room.id === 66745) {
        room = state.RoomManager.getRoom('spdfor:66737');
        Broadcast.sayAt(room, 'Сверху послышался подозрительный шум.');
        if (room.players.size > 0) {
          target = Array.from(room.players)[Math.floor(Math.random() * room.players.size)];
          if (target.isInCombat()) {
            return;
          }
          Broadcast.sayAt(target, 'Вас что-то потащило вверх!');
          Broadcast.sayAtExcept(room, `${target.Vname} что-то потащило вверх.`, target);
          target.moveTo(this.room);
          this.initiateCombat(target);
        }
      }
    },
  },
};
