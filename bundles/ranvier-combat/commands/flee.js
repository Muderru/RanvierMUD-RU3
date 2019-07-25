'use strict';

module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Random = require(srcPath + 'RandomUtil');
  const say = Broadcast.sayAt;

  return {
    usage: 'бежать [направление]',
    aliases: ['бежать', 'убежать', 'сбежать'],
    command: state => (direction, player) => {
      if (!player.isInCombat()) {
        return say(player, "Вы вздрагиваете от вида собственной тени.");
      }

      let possibleRooms = {};
      for (const possibleExit of player.room.exits) {
        possibleRooms[possibleExit.direction] = possibleExit.roomId;
      }

      // TODO: This is in a few places now, there is probably a refactor to be had here
      // but can't be bothered at the moment.
      const coords = player.room.coordinates;
      if (coords) {
        // find exits from coordinates
        const area = player.room.area;
        const directions = {
          север: [0, 1, 0],
          юг: [0, -1, 0],
          восток: [1, 0, 0],
          запад: [-1, 0, 0],
          вверх: [0, 0, 1],
          вниз: [0, 0, -1],
        };

        for (const [dir, diff] of Object.entries(directions)) {
          const room = area.getRoomAtCoordinates(coords.x + diff[0], coords.y + diff[1], coords.z + diff[2]);
          if (room) {
            possibleRooms[dir] = room.entityReference;
          }
        }
      }

      let roomId = null;
      if (direction) {
        roomId = possibleRooms[direction];
      } else {
        const entries = Object.entries(possibleRooms);
        if (entries.length) {
          [direction, roomId] = Random.fromArray(Object.entries(possibleRooms));
        }
      }

      const randomRoom = state.RoomManager.getRoom(roomId);

      if (!randomRoom) {
        say(player, "Вы не знаете куда бежать!");
        return;
      }


      const door = player.room.getDoor(randomRoom) || randomRoom.getDoor(player.room);
      if (randomRoom && door && (door.locked || door.closed)) {
        say(player, "Вы с разбега ударились в закрытую дверь!");
        return;
      }

      say(player, "С гордо поднятой головой вы сбегаете из битвы!");
      player.removeFromCombat();
      state.CommandManager.get('move').execute(direction, player);
    }
  };
};
