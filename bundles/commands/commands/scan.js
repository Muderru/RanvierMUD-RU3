'use strict';

const { Broadcast: B, Data } = require('ranvier');

/**
 * See brief details of npcs/players in nearby rooms
 */
module.exports = {
  usage: 'оглядеться',
  aliases: [ 'оглядеться' ],
  command: state => (args, player) => {
    for (const exit of player.room.exits) {
      const room = state.RoomManager.getRoom(exit.roomId);
      let currentTime = room.area.time;
      let currentLight = room.light;
      if (currentTime === 0) {
        let tmpGameTime = Data.parseFile('gameTime.json').ingameTime;
        const dayDuration = 24;
        if (tmpGameTime >= dayDuration) {
          tmpGameTime = tmpGameTime % dayDuration;
        }
        currentTime = tmpGameTime;
      }

      currentLight += currentTime * 2 + 2;
      for (const pc of room.players) {
        if (pc.hasAttribute('light')) {
          currentLight += pc.getAttribute('light');
        }
      }

      for (const npc of room.npcs) {
        if (npc.hasAttribute('light')) {
          currentLight += npc.getAttribute('light');
        }
      }

      for (const roomItem of room.items) {
        if (roomItem.metadata.light) {
          currentLight += roomItem.metadata.light;
        }
      }


      B.at(player, `(${exit.direction}) ${room.title}`);
      if (room.npcs.size || room.players.size) {
        B.sayAt(player, ':');
      } else {
        B.sayAt(player);
      }

      if (currentLight >= 50) {
        for (const npc of room.npcs) {
          if (npc.hasAttribute('invisibility') && npc.getAttribute('invisibility') > player.getAttribute('detect_invisibility')) {
            continue;
          }
          if (npc.hasAttribute('hide') && npc.getAttribute('hide') > player.getAttribute('detect_hide')) {
            continue;
          }
          B.sayAt(player, `  [НПС] ${npc.Name}`);
        }
        for (const pc of room.players) {
          if (pc.hasAttribute('invisibility') && pc.getAttribute('invisibility') > player.getAttribute('detect_invisibility')) {
            continue;
          }
          if (pc.hasAttribute('hide') && pc.getAttribute('hide') > player.getAttribute('detect_hide')) {
            continue;
          }
          B.sayAt(player, `  [Игрок] ${pc.name}`);
        }
      } else {
        B.sayAt(player, `  Слишком темно`);
      }
      B.sayAt(player);
    }
  }
};
