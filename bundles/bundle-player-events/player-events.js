'use strict';

const sprintf = require('sprintf-js').sprintf;
const LevelUtil = require('../bundle-lib/lib/LevelUtil');
const { Broadcast: B, Config, Logger } = require('ranvier');

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

      let ending = '';
      if (this.gender === 'male') {
          ending = 'ёл';
      } else if (this.gender === 'female') {
          ending = 'ла';
      } else if (this.gender === 'plural') {
          ending = 'ли';
      } else {
          ending = 'ло';
      }

      if (roomExit.direction === 'вниз' || roomExit.direction === 'вверх') {
          B.sayAt(oldRoom, `${this.name} уш${ending} ${roomExit.direction}.`);
      } else {
          B.sayAt(oldRoom, `${this.name} уш${ending} на ${roomExit.direction}.`);
      }

      switch(roomExit.direction) {
          case 'восток':
            B.sayAtExcept(nextRoom, `${this.name} приш${ending} с запада.`, this);
          break;
          case 'запад':
            B.sayAtExcept(nextRoom, `${this.name} приш${ending} с востока.`, this);
          break;
          case 'юг':
            B.sayAtExcept(nextRoom, `${this.name} приш${ending} с севера.`, this);
          break;
          case 'север':
            B.sayAtExcept(nextRoom, `${this.name} приш${ending} с юга.`, this);
          break;
          case 'вверх':
            B.sayAtExcept(nextRoom, `${this.name} приш${ending} снизу.`, this);
          break;
          case 'вниз':
            B.sayAtExcept(nextRoom, `${this.name} приш${ending} сверху.`, this);
          break;
          default:
            B.sayAtExcept(nextRoom, `${this.name} приш${ending} откуда-то.`, this);
      }

      for (const follower of this.followers) {
        if (follower.room !== oldRoom) {
          continue;
        }

        if (follower.isNpc) {
          follower.moveTo(nextRoom);
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
      B.sayAt(this, `<bold><yellow>Executing</yellow> '<white>${command.label}</white>' <yellow>in</yellow> <white>${ttr}</white> <yellow>seconds.</yellow>`);
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

      if (timeSinceLastCommand > maxIdleTime && !this.isInCombat()) {
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
