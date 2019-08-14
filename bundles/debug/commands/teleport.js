'use strict';

const { Broadcast, PlayerRoles } = require('ranvier');

module.exports = {
  aliases: ['tp', 'goto'],
  usage: 'teleport <player/room>',
  requiredRole: PlayerRoles.ADMIN,
  command: (state) => (args, player) => {
    if (!args || !args.length) {
      return Broadcast.sayAt(player, 'Нужно установить место перемещения указав игрока или id комнаты.');
    }

    const target = args;
    const isRoom = target.includes(':');
    let targetRoom = null;

    if (isRoom) {
      targetRoom = state.RoomManager.getRoom(target);
      if (!targetRoom) {
        return Broadcast.sayAt(player, 'Такой комнаты не найдено.');
      } else if (targetRoom === player.room) {
        return Broadcast.sayAt(player, 'Вы уже тут.');
      }
    } else {
      const targetPlayer = state.PlayerManager.getPlayer(target);
      if (!targetPlayer) {
        return Broadcast.sayAt(player, 'Такого игрока сейчас нет в игре.');
      } else if (targetPlayer === player || targetPlayer.room === player.room) {
        return Broadcast.sayAt(player, 'Вы уже рядом с ним.');
      }

      targetRoom = targetPlayer.room;
    }

    player.followers.forEach(follower => {
      follower.unfollow();
      if (!follower.isNpc) {
        Broadcast.sayAt(follower, `Вы прекратили следовать за ${player.tname}.`);
      }
    });

    if (player.isInCombat()) {
      player.removeFromCombat();
    }

    const oldRoom = player.room;

    player.moveTo(targetRoom, () => {
      Broadcast.sayAt(player, '<b><green>Вы щёлкнули пальцами и оказались в другой комнате.</green></b>\r\n');
      state.CommandManager.get('look').execute('', player);
    });

    if (player.gender === 'male') {
      Broadcast.sayAt(oldRoom, `${player.name} исчез в облаке дыма.`);
      Broadcast.sayAtExcept(targetRoom, `${player.name} телепортировался сюда.`, player);
    } else if (player.gender === 'female') {
      Broadcast.sayAt(oldRoom, `${player.name} исчезла в облаке дыма.`);
      Broadcast.sayAtExcept(targetRoom, `${player.name} телепортировалась сюда.`, player);
    } else if (player.gender === 'plural') {
      Broadcast.sayAt(oldRoom, `${player.name} исчезли в облаке дыма.`);
      Broadcast.sayAtExcept(targetRoom, `${player.name} телепортировались сюда.`, player);
    } else {
      Broadcast.sayAt(oldRoom, `${player.name} исчезло в облаке дыма.`);
      Broadcast.sayAtExcept(targetRoom, `${player.name} телепортировалось сюда.`, player);
    }
  }
};
