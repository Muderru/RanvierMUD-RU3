'use strict';

const { Random } = require('rando-js');
const { Broadcast, Data, Logger } = require('ranvier');

/**
 * An example behavior that causes an NPC to wander around an area when not in combat
 * Options:
 *   areaRestricted: boolean, true to restrict the NPC's wandering to his home area. Default: false
 *   restrictTo: Array<EntityReference>, list of room entity references to restrict the NPC to. For
 *     example if you want them to wander along a set path
 *   interval: number, delay in seconds between room movements. Default: 20
 */
module.exports = {
  listeners: {
    updateTick: state => function (config) {
      if (this.isInCombat() || !this.room || this.following) {
        return;
      }

      if (this.hasAttribute('freedom') && this.getAttribute('freedom') < 0) {
        return;
      }

      let playersCount = state.PlayerManager.players.size;
      if (playersCount === 0) {
        return;
      }

      if (config === true) {
        config = {};
      }

      config = Object.assign({
        areaRestricted: false,
        restrictTo: null,
        interval: 20,
      }, config);

      if (!this._lastWanderTime) {
        this._lastWanderTime = Date.now();
      }

      if (Date.now() - this._lastWanderTime < config.interval * 1000) {
        return;
      }

      this._lastWanderTime = Date.now();

      const exits = this.room.getExits();
      if (!exits.length) {
        return;
      }

      const roomExit = Random.fromArray(exits);
      const randomRoom = state.RoomManager.getRoom(roomExit.roomId);
      let oldRoom = this.room;

      const door = this.room.getDoor(randomRoom) || (randomRoom && randomRoom.getDoor(this.room));
      if (randomRoom && door && (door.locked || door.closed)) {
        // maybe a possible feature where it could be configured that they can open doors
        // or even if they have the key they can unlock the doors
//        Logger.verbose(`NPC [${this.uuid}] wander blocked by door.`);
        return;
      }

      if (
        !randomRoom ||
        (config.restrictTo && !config.restrictTo.includes(randomRoom.entityReference)) ||
        (config.areaRestricted && randomRoom.area !== this.area)
      ) {
        return;
      }

//      Logger.verbose(`NPC [${this.uuid}] wandering from ${this.room.entityReference} to ${randomRoom.entityReference}.`);
      if (!this.travelVerbOut) {
          if (this.gender === 'male') {
              this.travelVerbOut = 'убежал';
          } else if (this.gender === 'female') {
              this.travelVerbOut = 'убежала';
          } else if (this.gender === 'plural') {
              this.travelVerbOut = 'убежали';
          } else {
              this.travelVerbOut = 'убежало';
          }
        }

      let blindPlayers = [];
      for (const pc of this.room.players) {
        let counter = 0;
        if (this.hasAttribute('invisibility') && this.getAttribute('invisibility') > pc.getAttribute('detect_invisibility')) {
          blindPlayers[counter] = pc;
          counter++;
        } else if (this.hasAttribute('hide') && this.getAttribute('hide') > pc.getAttribute('detect_hide')) {
          blindPlayers[counter] = pc;
          counter++;
        }
      }

      if (RoomLight(oldRoom) >= 50) {
        if (roomExit.direction === 'вверх' || roomExit.direction === 'вниз') {
          Broadcast.sayAtExcept(this.room, `${this.Name} ${this.travelVerbOut} ${roomExit.direction}.`, blindPlayers);
        } else {
          Broadcast.sayAtExcept(this.room, `${this.Name} ${this.travelVerbOut} на ${roomExit.direction}.`, blindPlayers);
        }
      }
      
      if (!this.travelVerbIn) {
          if (this.gender === 'male') {
              this.travelVerbIn = 'появился';
          } else if (this.gender === 'female') {
              this.travelVerbIn = 'появилась';
          } else if (this.gender === 'plural') {
              this.travelVerbIn = 'появились';
          } else {
              this.travelVerbIn = 'появилось';
          }
        }

      if (RoomLight(randomRoom) >= 50) {
        for (const pc of randomRoom.players) {
          if (this.hasAttribute('invisibility') && this.getAttribute('invisibility') > pc.getAttribute('detect_invisibility')) {
            continue;
          } else if (this.hasAttribute('hide') && this.getAttribute('hide') > pc.getAttribute('detect_hide')) {
            continue;
          } else {
            switch(roomExit.direction) {
              case 'восток':
                Broadcast.sayAt(pc, `${this.Name} ${this.travelVerbIn} с запада.`);
              break;
              case 'запад':
                Broadcast.sayAt(pc, `${this.Name} ${this.travelVerbIn} с востока.`);
              break;
              case 'юг':
                Broadcast.sayAt(pc, `${this.Name} ${this.travelVerbIn} с севера.`);
              break;
              case 'север':
                Broadcast.sayAt(pc, `${this.Name} ${this.travelVerbIn} с юга.`);
              break;
              case 'вверх':
                Broadcast.sayAt(pc, `${this.Name} ${this.travelVerbIn} снизу.`);
              break;
              case 'вниз':
                Broadcast.sayAt(pc, `${this.Name} ${this.travelVerbIn} сверху.`);
              break;
              default:
                Broadcast.sayAt(pc, `${this.Name} ${this.travelVerbIn} откуда-то.`);
             }
          }
        }
      }
      this.moveTo(randomRoom);
      for (const follower of this.followers) {
        follower.moveTo(randomRoom);
        let ending = '';
        if (RoomLight(oldRoom) >= 50) {
          if (follower.gender === 'male') {
              ending = '';
          } else if (follower.gender === 'female') {
              ending = 'а';
          } else if (follower.gender === 'plural') {
              ending = 'и';
          } else {
              ending = 'о';
          }
          for (const pc of oldRoom.players) {
            if (this.hasAttribute('invisibility') && this.getAttribute('invisibility') > pc.getAttribute('detect_invisibility')) {
              continue;
            } else if (this.hasAttribute('hide') && this.getAttribute('hide') > pc.getAttribute('detect_hide')) {
              continue;
            } else {
              Broadcast.sayAt(pc, `${follower.Name} последовал` + ending + ` за ${this.tname}.`);
            }
          }
        }
        if (RoomLight(randomRoom) >= 50) {
          if (follower.gender === 'male') {
              ending = 'ёл';
          } else if (follower.gender === 'female') {
              ending = 'ла';
          } else if (follower.gender === 'plural') {
              ending = 'ли';
          } else {
              ending = 'ло';
          }
          for (const pc of randomRoom.players) {
            if (this.hasAttribute('invisibility') && this.getAttribute('invisibility') > pc.getAttribute('detect_invisibility')) {
              continue;
            } else if (this.hasAttribute('hide') && this.getAttribute('hide') > pc.getAttribute('detect_hide')) {
              continue;
            } else {
              if (!follower.travelVerbIn) {
                Broadcast.sayAt(pc, `${follower.Name} приш` + ending + ` вместе с ${this.tname}.`);
              } else {
                Broadcast.sayAt(pc, `${follower.Name} ${follower.travelVerbIn} вместе с ${this.tname}.`);
              }
            }
          }
        }
      }
    }
  }
};

function RoomLight(currentRoom) {
  let currentTime = currentRoom.area.time;
  let currentRoomLight = currentRoom.light;
  if (currentTime === 0) {
  let tmpGameTime = Data.parseFile('gameTime.json').ingameTime;
  const dayDuration = 24;
    if (tmpGameTime >= dayDuration) {
      tmpGameTime = tmpGameTime % dayDuration;
    }
  currentTime = tmpGameTime;
  }

  currentRoomLight += currentTime * 2 + 2;
  for (const pc of currentRoom.players) {
    if (pc.hasAttribute('light')) {
      currentRoomLight += pc.getAttribute('light');
    }
  }

  for (const npc of currentRoom.npcs) {
    if (npc.hasAttribute('light')) {
      currentRoomLight += npc.getAttribute('light');
    }
  }

  for (const roomItem of currentRoom.items) {
    if (roomItem.metadata.light) {
      currentRoomLight += roomItem.metadata.light;
    }
  }
  return currentRoomLight;
}