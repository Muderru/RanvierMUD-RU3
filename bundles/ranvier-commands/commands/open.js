'use strict';

module.exports = (srcPath, bundlePath) => {
  const B = require(srcPath + 'Broadcast');
  const Parser = require(srcPath + 'CommandParser').CommandParser;
  const ItemUtil = require(bundlePath + 'ranvier-lib/lib/ItemUtil');

  return {
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

      const directions = {
        север: [0, 1, 0],
        юг: [0, -1, 0],
        восток: [1, 0, 0],
        запад: [-1, 0, 0],
        вверх: [0, 0, 1],
        вниз: [0, 0, -1],
      };

      for (const [dir, diff] of Object.entries(directions)) {
        if (dir.indexOf(exitDirection) !== 0) {
          continue;
        }

        exitDirection = dir;
        validTarget = true;
        const exit = state.RoomManager.findExit(player.room, exitDirection);
        let doorRoom = player.room;
        let nextRoom = null;
        let door = null;
        let targetRoom = null;

        if (exit) {
          nextRoom = state.RoomManager.getRoom(exit.roomId);
        } else {
          if (doorRoom.coordinates) {
            const coords = doorRoom.coordinates;
            const area = doorRoom.area;
            nextRoom = area.getRoomAtCoordinates(coords.x + diff[0], coords.y + diff[1], coords.z + diff[2]);
          }
        }

        if (nextRoom) {
          targetRoom = nextRoom;
          door = doorRoom.getDoor(targetRoom);
          if (!door) {
            doorRoom = nextRoom;
            targetRoom = player.room;
            door = doorRoom.getDoor(targetRoom);
          }
        }

        if (door) {
          switch (action) {
            case 'открыть': {
              if (door.locked) {
                if (door.lockedBy) {
                  const playerKey = player.hasItem(door.lockedBy);
                  if (playerKey) {
                    B.sayAt(player, `*Щелк* Вы открыли дверь с помощью ${ItemUtil.display(playerKey)}.`);
                    doorRoom.unlockDoor(targetRoom);
                    return doorRoom.openDoor(targetRoom);
                  }
                }
                return B.sayAt(player, "Дверь заперта и у вас нет ключа.");
              }
              if (door.closed) {
                B.sayAt(player, "Дверь открывается.");
                return doorRoom.openDoor(targetRoom);
              } else {
                return B.sayAt(player, "Дверь не закрыта.");
              }
            }
            case 'закрыть': {
              if (door.locked || door.closed) {
                return B.sayAt(player, "Дверь уже закрыта.");
              }
              B.sayAt(player, "Дверь захлопывается.");
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
                const keyItem = state.ItemFactory.getDefinition(door.lockedBy);
                if (!keyItem) {
                  return B.sayAt(player, "У вас нет ключа.");
                }
                return B.sayAt(player, `Эту дверь можно закрыть только с помощью ${keyItem.name}.`);
              }
              doorRoom.lockDoor(targetRoom);
              return B.sayAt(player, '*Щелк* Дверь закрыта.');
            }
            case 'отпереть': {
              if (door.locked) {
                if (door.lockedBy) {
                  if (player.hasItem(door.lockedBy)) {
                    B.sayAt(player, '*Щелк* Дверь отперта.');
                    return doorRoom.unlockDoor(targetRoom);
                  } else {
                    return B.sayAt(player, `Дверь может быть отперта только с помощью ${keyItem.name}.`);
                  }
                } else {
                  return B.sayAt(player, "Вы не можете отпереть эту дверь.");
                }
              }
              if (door.closed) {
                return B.sayAt(player, "Дверь уже отперта.");
              } else {
                return B.sayAt(player, "Дверь уже открыта.");
              }
            }
          }
        }
      }

      // otherwise trying to open an item
      let item = Parser.parseDot(args, player.inventory);
      item = item || Parser.parseDot(args, player.room.items);

      if (item) {
        validTarget = true;
        if (typeof item.closed == 'undefined' && typeof item.locked == 'undefined') {
          return B.sayAt(player, `${ItemUtil.display(item)} - не контейнер.`)
        }
        switch (action) {
          case 'открыть': {
            if (item.locked) {
              if (item.lockedBy) {
                const playerKey = player.hasItem(item.lockedBy);
                if (playerKey) {
                  B.sayAt(player, `*Щелк* Вы отперли ${ItemUtil.display(item)} с помощью ${ItemUtil.display(playerKey)}.`);
                  item.unlock();
                  item.open();
                  return;
                }
              }
              return B.sayAt(player, "Контейнер заперт и у вас нет ключа.");
            }
            if (item.closed) {
              B.sayAt(player, `Вы открыли ${ItemUtil.display(item)}.`);
              return item.open();
            }
            return B.sayAt(player, `${ItemUtil.display(item)} не закрыт...`);
          }
          case 'закрыть': {
            if (item.locked || item.closed) {
              return B.sayAt(player, "Это уже закрыто.");
            }
            if (typeof item.closed == 'undefined') {
              return B.sayAt(player, "Вы не можете закрыть это.");
            }
            B.sayAt(player, `Вы закрыли ${ItemUtil.display(item)}.`);
            return item.close();
          }
          case 'запереть': {
            if (item.locked) {
              return B.sayAt(player, "Это уже заперто.");
            }
            if (!item.lockedBy) {
              return B.sayAt(player, `Вы не можете запереть ${ItemUtil.display(item)}.`);
            }
            const keyItem = state.ItemFactory.getDefinition(item.lockedBy);
            if (!keyItem) {
              return B.sayAt(player, `Вы не можете запереть ${ItemUtil.display(item)}.`);
            }
            const playerKey = player.hasItem(item.lockedBy);
            if (playerKey) {
              B.sayAt(player, `*Щелк* Вы заперли ${ItemUtil.display(item)} с помощью ${ItemUtil.display(playerKey)}.`);
              return item.lock();
            }
            return B.sayAt(player, "Контейнер заперт и у вас нет ключа.");
          }
          case 'отпереть': {
            if (item.locked) {
              if (item.lockedBy) {
                const playerKey = player.hasItem(item.lockedBy);
                if (playerKey) {
                  B.sayAt(player, `*Щелк* Вы отперли ${ItemUtil.display(item)} с помощью ${ItemUtil.display(playerKey)}.`);
                  return item.unlock();
                } else {
                  return B.sayAt(player, "Контейнер заперт и у вас нет ключа.");
                }
              } else {
                B.sayAt(player, `*Щелк* Вы отперли ${ItemUtil.display(item)}.`);
                return item.unlock();
              }
            }
            if (!item.closed) {
              return B.sayAt(player, `${ItemUtil.display(item)} не закрыт...`);
            }
            return B.sayAt(player, `${ItemUtil.display(item)} не заперт...`);
          }
        }
      }

      if (validTarget) {
        return B.sayAt(player, `Вы не можете ${action} это!`);
      } else {
        return B.sayAt(player, `Вы не видите ${args} здесь.`);
      }
    }
  };
};
