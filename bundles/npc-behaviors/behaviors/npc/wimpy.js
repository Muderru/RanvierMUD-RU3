'use strict';

const { Random } = require('rando-js');
const { Broadcast, Logger } = require('ranvier');

module.exports = {
  listeners: {
    updateTick: state => function () {
      if (!this.isInCombat()) {
        return;
      }

      if (Random.inRange(0, 100) <=97) {
        return;
      }

      let healthCurrent = this.getAttribute('health');
      let healthMax = this.getMaxAttribute('health');

      if ((healthCurrent/healthMax) < 0.35) {
        const exits = this.room.getExits();
        if (!exits.length) {
          return;
        }

        const roomExit = Random.fromArray(exits);
        const randomRoom = state.RoomManager.getRoom(roomExit.roomId);

        const door = this.room.getDoor(randomRoom) || randomRoom.getDoor(this.room);
        if (randomRoom && door && (door.locked || door.closed)) {
          return;
        }

        //Надо добавить проверку на ограничение комнат, по которым может перемещаться моб
        if (randomRoom.area !== this.area) {
            return;
        }

        if (this.gender === 'male') {
           Broadcast.sayAtExcept(this.room, `${this.name} сбежал из боя.`, this);
        } else if (this.gender === 'female') {
           Broadcast.sayAtExcept(this.room, `${this.name} сбежала из боя.`, this);
        } else if (this.gender === 'plural') {
           Broadcast.sayAtExcept(this.room, `${this.name} сбежали из боя.`, this);
        } else {
           Broadcast.sayAtExcept(this.room, `${this.name} сбежало из боя.`, this);
        }
    
        this.removeFromCombat();
        this.moveTo(randomRoom);
      }
    }
  }
};
