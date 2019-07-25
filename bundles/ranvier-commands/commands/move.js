'use strict';

/**
 * Move player in a given direction from their current room
 * @param {string} exit   direction they tried to go
 * @param {Player} player
 * @return {boolean} False if the exit is inaccessible.
 */
module.exports = (srcPath) => {
  const B = require(srcPath + 'Broadcast');
  const Player = require(srcPath + 'Player');

  return {
    aliases: [ "идти" ],
    usage: 'идти [направление]',
    command: (state) => (exitName, player) => {
      const oldRoom = player.room;
      if (!oldRoom) {
        return false;
      }

      if (player.isInCombat()) {
        return B.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      const exit = state.RoomManager.findExit(oldRoom, exitName);
      let nextRoom = null;

      if (!exit) {
        if (oldRoom.coordinates) {
          const coords = oldRoom.coordinates;
          const area = oldRoom.area;
          const directions = {
            север: [0, 1, 0],
            юг: [0, -1, 0],
            восток: [1, 0, 0],
            запад: [-1, 0, 0],
            вверх: [0, 0, 1],
            вниз: [0, 0, -1],
          };

          for (const [dir, diff] of Object.entries(directions)) {
            if (dir.indexOf(exitName) !== 0) {
              continue;
            }

            nextRoom = area.getRoomAtCoordinates(coords.x + diff[0], coords.y + diff[1], coords.z + diff[2]);
          }
        } else {
          return B.sayAt(player, "Туда не пройти.");
        }
      } else {
        nextRoom = state.RoomManager.getRoom(exit.roomId);
      }

      if (!nextRoom) {
        return B.sayAt(player, "Туда не пройти.");
      }

      // check to see if this room has a door leading to the target room or vice versa
      const door = oldRoom.getDoor(nextRoom) || nextRoom.getDoor(oldRoom);
      if (door) {
        if (door.locked) {
          return B.sayAt(player, "Дверь заперта.");
        }

        if (door.closed) {
          return B.sayAt(player, "Дверь закрыта.");
        }
      }


      player.moveTo(nextRoom, _ => {
        state.CommandManager.get('look').execute('', player);
      });

      if (player.gender === 'male') {
        B.sayAt(oldRoom, `${player.name} ушел.`);
        B.sayAtExcept(nextRoom, `${player.name} пришел.`, player);
      } else if (player.gender === 'female') {
        B.sayAt(oldRoom, `${player.name} ушла.`);
        B.sayAtExcept(nextRoom, `${player.name} пришла.`, player);
      } else if (player.gender === 'plural') {
        B.sayAt(oldRoom, `${player.name} ушли.`);
        B.sayAtExcept(nextRoom, `${player.name} пришли.`, player);
      } else {
        B.sayAt(oldRoom, `${player.name} ушло.`);
        B.sayAtExcept(nextRoom, `${player.name} пришло.`, player);
      }

      for (const follower of player.followers) {
        if (follower.room !== oldRoom) {
          continue;
        }

        if (follower instanceof Player) {
          B.sayAt(follower, `\r\nВы последовали за ${player.tname} в ${nextRoom.title}.`);
          state.CommandManager.get('move').execute(exitName, follower);
        } else {
          follower.room.removeNpc(follower);
          nextRoom.addNpc(follower);
        }
      }

      return true;
    }
  };
};
