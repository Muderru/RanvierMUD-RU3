'use strict';

const { Random } = require('rando-js');
const { Broadcast, Logger } = require('ranvier');

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


      if (roomExit.direction === 'вверх' || roomExit.direction === 'вниз') {
          Broadcast.sayAtExcept(this.room, `${this.Name} ${this.travelVerbOut} ${roomExit.direction}.`, blindPlayers);
      } else {
          Broadcast.sayAtExcept(this.room, `${this.Name} ${this.travelVerbOut} на ${roomExit.direction}.`, blindPlayers);
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
      this.moveTo(randomRoom);
    }
  }
};
