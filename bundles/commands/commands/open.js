'use strict';

const { Broadcast: B } = require('ranvier');
const { CommandParser } = require('../../lib/lib/CommandParser');
const ArgParser = require('../../lib/lib/ArgParser');
const ItemUtil = require('../../lib/lib/ItemUtil');

module.exports = {
  aliases: ['закрыть', 'запереть', 'отпереть', 'открыть'],
  usage: '[открыть/закрыть/запереть/отпереть] <предмет> / [открыть/закрыть/запереть/отпереть] <дверь направление>',
  command: state => (args, player, arg0) => {
    const action = arg0.toString().toLowerCase();
    let validTarget = false;
    if (!args || !args.length) {
      return B.sayAt(player, `Что вы хотите ${action}?`);
    }

    if (!player.room) {
      return B.sayAt(player, 'Вы затеряны в нигде.');
    }

    const parts = args.split(' ');

    let exitDirection = parts[0];
    if (parts[0] === 'дверь' && parts.length >= 2) {
      // Exit is in second parameter
      exitDirection = parts[1];
    }

    const roomExit = CommandParser.canGo(player, exitDirection);

    if (roomExit) {
      const roomExitRoom = state.RoomManager.getRoom(roomExit.roomId);
      let doorRoom = player.room;
      let targetRoom = roomExitRoom;
      let door = doorRoom.getDoor(targetRoom);
      if (!door) {
        doorRoom = roomExitRoom;
        targetRoom = player.room;
        door = doorRoom.getDoor(targetRoom);
      }

      if (door) {
        return handleDoor(player, doorRoom, targetRoom, door, action);
      }
    }

    const item = ArgParser.parseDot(args, [ ...player.inventory, ...player.room.items ]);

    if (item) {
      return handleItem(player, item, action);
    }

    return B.sayAt(player, `Кажется здесь нет ${args}.`);
  }
};

function handleDoor(player, doorRoom, targetRoom, door, action)
{
  switch (action) {
    case 'открыть': {
      if (door.locked) {
        return B.sayAt(player, "Дверь заперта.");
      }

      if (door.closed) {
        B.sayAt(player, "Дверь открывается.");
        return doorRoom.openDoor(targetRoom);
      }

      return B.sayAt(player, "Дверь не закрыта.");
    }

    case 'закрыть': {
      if (door.locked || door.closed) {
        return B.sayAt(player, "Дверь уже закрыта.");
      }

      B.sayAt(player, "Дверь закрывается.");
      return doorRoom.closeDoor(targetRoom);
    }

    case 'запереть': {
      if (door.locked) {
        return B.sayAt(player, "Дверь уже заперта.");
      }

      if (!door.lockedBy) {
        return B.sayAt(player, "Вы не можете запереть эту дверь.");
      }

      const playerKey = player.hasItem(door.lockedBy);
      if (!playerKey) {
        return B.sayAt(player, "У вас нет ключа.");
      }

      doorRoom.lockDoor(targetRoom);
      return B.sayAt(player, '*Щёлк* Дверь заперта.');
    }

    case 'отпереть': {
      if (!door.locked) {
        return B.sayAt(player, "Дверь не заперта.");
      }

      if (door.lockedBy) {
        if (player.hasItem(door.lockedBy)) {
          B.sayAt(player, '*Щёлк* Дверь отпирается.');
          return doorRoom.unlockDoor(targetRoom);
        }

        return B.sayAt(player, `Эту дверь можно отпереть только с помощью ${keyItem.name}.`);
      }

      return B.sayAt(player, "Эту дверь нельзя отпереть.");
    }
  }
}

function handleItem(player, item, action)
{
  if (!item.closeable) {
    return B.sayAt(player, `${ItemUtil.display(item)} - не контейнер.`)
  }

  switch (action) {
    case 'открыть': {
      if (item.locked) {
        return B.sayAt(player, `${ItemUtil.display(item)}: заперто.`);
      }

      if (item.closed) {
        B.sayAt(player, `Вы открыли ${ItemUtil.display(item)}.`);
        return item.open();
      }

      return B.sayAt(player, `${ItemUtil.display(item)} - тут уже открыто.`);
    }

    case 'закрыть': {
      if (item.locked || item.closed) {
        return B.sayAt(player, "Здесь уже закрыто.");
      }

      B.sayAt(player, `Вы закрыли ${ItemUtil.display(item)}.`);

      return item.close();
    }

    case 'запереть': {
      if (item.locked) {
        return B.sayAt(player, "Здесь уже заперто.");
      }

      if (!item.lockedBy) {
        return B.sayAt(player, `Вы не можете запереть ${ItemUtil.display(item)}.`);
      }

      const playerKey = player.hasItem(item.lockedBy);
      if (playerKey) {
        B.sayAt(player, `*Щёлк* Вы заперли ${ItemUtil.display(item)}.`);

        return item.lock();
      }

      return B.sayAt(player, "Этот предмет заперт и у вас нет ключа.");
    }

    case 'отпереть': {
      if (!item.locked) {
        return B.sayAt(player, `${ItemUtil.display(item)} - а тут и не заперто...`);
      }

      if (!item.closed) {
        return B.sayAt(player, `${ItemUtil.display(item)} - а тут и не закрыто...`);
      }

      if (item.lockedBy) {
        const playerKey = player.hasItem(item.lockedBy);
        if (playerKey) {
          B.sayAt(player, `*Щёлк* Вы отперли ${ItemUtil.display(item)} с помощью ${ItemUtil.display(playerKey)}.`);

          return item.unlock();
        }

        return B.sayAt(player, "Предмет заперт и у вас нет ключа.");
      }

      B.sayAt(player, `*Щёлк* Вы отперли ${ItemUtil.display(item)}.`);

      return item.unlock();
    }
  }
}
