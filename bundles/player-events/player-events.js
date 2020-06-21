'use strict';

const sprintf = require('sprintf-js').sprintf;
const LevelUtil = require('../lib/lib/LevelUtil');
const { Broadcast: B, Config, Logger, PlayerRoles } = require('ranvier');

module.exports = {
  listeners: {
    /**
     * Handle a player movement command. From: 'commands' input event.
     * movementCommand is a result of CommandParser.parse
     */
    move: state => function (movementCommand) {
      const { roomExit } = movementCommand;

      if (!roomExit) {
        return B.sayAt(this, "Вы не можете идти туда!");
      }

      if (this.isInCombat()) {
        return B.sayAt(this, 'Вы сейчас сражаетесь!');
      }

    for (const npc of this.room.npcs) {
      if (npc.hasBehavior('block')) {
        const block = npc.getBehavior('block');
        const blockExits = block.exits;
        let detectInvis = 0;
        let detectHide = 0;

        if (npc.hasAttribute('detect_invisibility')) {
          detectInvis = npc.getAttribute('detect_invisibility');
        }

        if (npc.hasAttribute('detect_hide')) {
          detectHide = npc.getAttribute('detect_hide');
        }

        for (let blockExit of blockExits) {
          if (blockExit === roomExit.direction) {
            if (this.hasAttribute('invisibility') && this.getAttribute('invisibility') > detectInvis) {
              continue;
            } else if (this.hasAttribute('hide') && this.getAttribute('hide') > detectHide) {
              continue;
            } else {
              return B.sayAt(this, npc.Name + ' не дает вам туда пройти!');
            }
          }
        }
      }
    }

      const nextRoom = state.RoomManager.getRoom(roomExit.roomId);
      const oldRoom = this.room;

      const door = oldRoom.getDoor(nextRoom) || nextRoom.getDoor(oldRoom);

      if (door) {
        if (door.locked) {
          return B.sayAt(this, "Дверь заперта.");
        }

        if (door.closed) {
          return B.sayAt(this, "Дверь закрыта.");
        }
      }

      this.moveTo(nextRoom, _ => {
        state.CommandManager.get('look').execute('', this);
      });

      let blindPlayers = [];
      for (const pc of oldRoom.players) {
        let counter = 0;
        if (this.hasAttribute('invisibility') && this.getAttribute('invisibility') > pc.getAttribute('detect_invisibility')) {
          blindPlayers[counter] = pc;
          counter++;
        } else if (this.hasAttribute('hide') && this.getAttribute('hide') > pc.getAttribute('detect_hide')) {
          blindPlayers[counter] = pc;
          counter++;
        }
      }

      blindPlayers.push(this);
      if (roomExit.direction === 'вниз' || roomExit.direction === 'вверх') {
          B.sayAtExcept(oldRoom, `${this.name} ${this.travelVerbOut} ${roomExit.direction}.`, blindPlayers);
      } else {
          B.sayAtExcept(oldRoom, `${this.name} ${this.travelVerbOut} на ${roomExit.direction}.`, blindPlayers);
      }

      for (const pc of nextRoom.players) {
        if (this.hasAttribute('invisibility') && this.getAttribute('invisibility') > pc.getAttribute('detect_invisibility')) {
          continue;
        } else if (this.hasAttribute('hide') && this.getAttribute('hide') > pc.getAttribute('detect_hide')) {
          continue;
        } else {
          switch(roomExit.direction) {
            case 'восток':
              B.sayAtExcept(pc, `${this.name} ${this.travelVerbIn} с запада.`, this);
            break;
            case 'запад':
              B.sayAtExcept(pc, `${this.name} ${this.travelVerbIn} с востока.`, this);
            break;
            case 'юг':
              B.sayAtExcept(pc, `${this.name} ${this.travelVerbIn} с севера.`, this);
            break;
            case 'север':
              B.sayAtExcept(pc, `${this.name} ${this.travelVerbIn} с юга.`, this);
            break;
            case 'вверх':
              B.sayAtExcept(pc, `${this.name} ${this.travelVerbIn} снизу.`, this);
            break;
            case 'вниз':
              B.sayAtExcept(pc, `${this.name} ${this.travelVerbIn} сверху.`, this);
            break;
            case 'северо-запад':
              B.sayAtExcept(pc, `${this.name} ${this.travelVerbIn} с юго-востока.`, this);
            break;
            case 'северо-восток':
              B.sayAtExcept(pc, `${this.name} ${this.travelVerbIn} с юго-запада.`, this);
            break;
            case 'юго-запад':
              B.sayAtExcept(pc, `${this.name} ${this.travelVerbIn} с северо-востока.`, this);
            break;
            case 'юго-восток':
              B.sayAtExcept(pc, `${this.name} ${this.travelVerbIn} с северо-запада.`, this);
            break;
            default:
              B.sayAtExcept(pc, `${this.name} ${this.travelVerbIn} откуда-то.`, this);
          }
        }
      }

      for (const follower of this.followers) {
        if (follower.room !== oldRoom) {
          continue;
        }

        if (follower.isNpc) {
          let ending = '';
          if (follower.gender === 'male') {
            ending = '';
          } else if (follower.gender === 'female') {
            ending = 'а';
          } else if (follower.gender === 'plural') {
            ending = 'и';
          } else {
            ending = 'о';
          }
          if (!follower.travelVerbOut) {
            follower.travelVerbOut = 'убежал' + ending;
          }
          if (!follower.travelVerbIn) {
            follower.travelVerbIn = 'прибежал' + ending;
          }
          B.sayAtExcept(oldRoom, `${follower.Name} ${follower.travelVerbOut} за ${this.tname}.`, blindPlayers);
          follower.moveTo(nextRoom);
          for (const pc of nextRoom.players) {
            if (this.hasAttribute('invisibility') && this.getAttribute('invisibility') > pc.getAttribute('detect_invisibility')) {
              continue;
            } else if (this.hasAttribute('hide') && this.getAttribute('hide') > pc.getAttribute('detect_hide')) {
              continue;
            } else {
              B.sayAtExcept(pc, `${follower.Name} ${follower.travelVerbIn} вместе с ${this.tname}.`, this);
            }
          }
        } else {
            if (roomExit.direction === 'вниз' || roomExit.direction === 'вверх') {
                B.sayAt(follower, `\r\nВы последовали за ${this.tname} ${roomExit.direction}.\n`);
            } else {
                B.sayAt(follower, `\r\nВы последовали за ${this.tname} на ${roomExit.direction}.\n`);
            }
          follower.emit('move', movementCommand);
        }
      }
    },

    save: state => async function (callback) {
      await state.PlayerManager.save(this);
      if (typeof callback === 'function') {
        callback();
      }
    },

    commandQueued: state => function (commandIndex) {
      const command = this.commandQueue.queue[commandIndex];
      const ttr = sprintf('%.1f', this.commandQueue.getTimeTilRun(commandIndex));
//      B.sayAt(this, `<bold><yellow>Выполнение</yellow> '<white>${command.label}</white>' <yellow>через</yellow> <white>${ttr}</white> <yellow>секунд.</yellow>`);
    },

    login: state => function () {
      let ending = '';
      if (this.gender === 'male') {
        ending = '';
      } else if (this.gender === 'female') {
        ending = 'а';
      } else if (this.gender === 'plural') {
        ending = 'и';
      } else {
        ending = 'о';
      }
      B.sayAtExcept(this.room, `<bold>${this.Name} вступил${ending} в игру.</bold>`, this);
    },

    updateTick: state => function () {
      if (this.commandQueue.hasPending && this.commandQueue.lagRemaining <= 0) {
        B.sayAt(this);
        this.commandQueue.execute();
        B.prompt(this);
      }
      const lastCommandTime = this._lastCommandTime || Infinity;
      const timeSinceLastCommand = Date.now() - lastCommandTime;
      const maxIdleTime = (Math.abs(Config.get('maxIdleTime')) * 60000) || Infinity;

      let trader = false;
      for (const [, item ] of this.inventory) {
        if (item.getMeta('forSell') > 0) {
          trader = true;
        }
      }

      if (timeSinceLastCommand > maxIdleTime && !this.isInCombat() && this.role === PlayerRoles.PLAYER && !trader) {
        this.save(() => {
          B.sayAt(this, `Вы были удалены из игры за бездействие в течении ${maxIdleTime / 60000} минут!`);
          if (this.gender === 'male') {
            B.sayAtExcept(this.room, `${this.name} исчез.`, this);
          } else if (this.gender === 'female') {
            B.sayAtExcept(this.room, `${this.name} исчезла.`, this);
          } else if (this.gender === 'plural') {
            B.sayAtExcept(this.room, `${this.name} исчезли.`, this);
          } else {
            B.sayAtExcept(this.room, `${this.name} исчезло.`, this);
          }
          
          Logger.log(`Kicked ${this.name} for being idle.`);
          state.PlayerManager.removePlayer(this, true);
        });
      }
    },

    /**
     * Handle player gaining experience
     * @param {number} amount Exp gained
     */
    experience: state => function (amount) {
      B.sayAt(this, `<blue>Вы получили <bold>${amount}</bold> опыта!</blue>`);

      const totalTnl = LevelUtil.expToLevel(this.level + 1);

      // level up, currently wraps experience if they gain more than needed for multiple levels
      if (this.experience + amount > totalTnl) {
        B.sayAt(this, '                                   <bold><blue>!Новый уровень!</blue></bold>');
        B.sayAt(this, B.progress(80, 100, "blue"));

        let nextTnl = totalTnl;
        while (this.experience + amount > nextTnl) {
          amount = (this.experience + amount) - nextTnl;
          this.level++;
          this.experience = 0;
          nextTnl = LevelUtil.expToLevel(this.level + 1);
          B.sayAt(this, `<blue>Ваш уровень теперь <bold>${this.level}</bold>!</blue>`);
          this.emit('level');
        }
      }

      this.experience += amount;

      this.save();
    },
  }
};
