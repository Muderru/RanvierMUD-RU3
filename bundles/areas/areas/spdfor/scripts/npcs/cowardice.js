const { Random } = require('rando-js');
const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    killed: (state) => function (killer) {
      const exits = this.room.getExits();
      if (!exits.length) {
        return;
      }

      

      for (const npc of this.room.npcs) {
        if (npc !== this) {
          const roomExit = Random.fromArray(exits);
          const randomRoom = state.RoomManager.getRoom(roomExit.roomId);

          const door = this.room.getDoor(randomRoom) || randomRoom.getDoor(this.room);
          if (randomRoom && door && (door.locked || door.closed)) {
            return;
          }

          if (randomRoom.area !== this.area) {
            return;
          }

          if (npc.gender === 'male') {
            Broadcast.sayAtExcept(this.room, `При виде смерти ${this.rname} ${npc.name} сбежал из боя.`, this);
          } else if (npc.gender === 'female') {
            Broadcast.sayAtExcept(this.room, `При виде смерти ${this.rname} ${npc.name} сбежала из боя.`, this);
          } else if (npc.gender === 'plural') {
            Broadcast.sayAtExcept(this.room, `При виде смерти ${this.rname} ${npc.name} сбежали из боя.`, this);
          } else {
            Broadcast.sayAtExcept(this.room, `При виде смерти ${this.rname} ${npc.name} сбежало из боя.`, this);
          }

          npc.removeFromCombat();
          npc.moveTo(randomRoom);
        }
      }
    },
  },
};
