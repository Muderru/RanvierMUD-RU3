'use strict';

const humanize = (sec) => { return require('humanize-duration')(sec, { round: true }); };
const sprintf = require('sprintf-js').sprintf;

module.exports = (srcPath, bundlePath) => {
  const B = require(srcPath + 'Broadcast');
  const CommandParser = require(srcPath + 'CommandParser').CommandParser;
  const Item = require(srcPath + 'Item');
  const ItemType = require(srcPath + 'ItemType');
  const Logger = require(srcPath + 'Logger');
  const Player = require(srcPath + 'Player');
  const ItemUtil = require(bundlePath + 'ranvier-lib/lib/ItemUtil');

  return {
    usage: "смотреть [объект]",
    aliases: ['смотреть', 'осмотреть'],
    command: state => (args, player) => {
      if (!player.room) {
        Logger.error(player.getName() + ' в бездне.');
        return B.sayAt(player, 'Вы находитесь в темной бесформенной бездне.');
      }

      if (args) {
        return lookEntity(state, player, args);
      }

      lookRoom(state, player);
    }
  };

  function getCompass(player) {
    const room = player.room;

    const exitMap = new Map();
    exitMap.set('восток', 'В');
    exitMap.set('запад', 'З');
    exitMap.set('юг', 'Ю');
    exitMap.set('север', 'С');
    exitMap.set('вверх', 'ВВ');
    exitMap.set('вниз', 'ВН');
    exitMap.set('юго-запад', 'ЮЗ');
    exitMap.set('юго-восток', 'ЮВ');
    exitMap.set('северо-запад', 'СЗ');
    exitMap.set('северо-восток', 'СВ');

    const directionsAvailable = room.exits.map(exit => exitMap.get(exit.direction));

    const exits = Array.from(exitMap.values()).map(exit => {
      if (directionsAvailable.includes(exit)) {
        return exit;
      }
      //If we are either SE or NE, pre-pad
      if (exit.length === 2 && exit.includes('В')) {
        return ' -';
      }

      //If we are either SW or NW, post-pad
      if (exit.length === 2 && exit.includes('З')) {
        return '- ';
      }
      return '-';
    });

    let [В, З, Ю, С, ВВ, ВН, ЮЗ, ЮВ, СЗ, СВ] = exits;
    ВВ = ВВ === 'ВВ' ? '<yellow><b>ВВ</yellow></b>' : ВВ;
    ВН = ВН === 'ВН' ? '<yellow><b>ВН</yellow></b>' : ВН;

    const line1 = `${СЗ}     ${С}     ${СВ}`;
    const line2 = `<yellow><b>${З}</b></yellow> <-${ВВ}-(@)-${ВН}-> <yellow><b>${В}</b></yellow>`;
    const line3 = `${ЮЗ}     ${Ю}     ${ЮВ}\r\n`;

    return [line1, line2, line3];
  }

  function lookRoom(state, player) {
    const room = player.room;

    if (player.room.coordinates) {
      B.sayAt(player, '<yellow><b>' + sprintf('%-65s', room.title) + '</b></yellow>');
      B.sayAt(player, B.line(60));
    } else {
      const [ line1, line2, line3 ] = getCompass(player);

      // map is 15 characters wide, room is formatted to 80 character width
      B.sayAt(player, '<yellow><b>' + sprintf('%-65s', room.title) + line1 + '</b></yellow>');
      B.sayAt(player, B.line(60) + B.line(5, ' ') + line2);
      B.sayAt(player, B.line(65, ' ') + '<yellow><b>' + line3 + '</b></yellow>');
    }

    if (!player.getMeta('config.краткий')) {
      B.sayAt(player, room.description, 80);
    }

    if (player.getMeta('config.миникарта')) {
      B.sayAt(player, '');
      state.CommandManager.get('map').execute(4, player);
    }

    B.sayAt(player, '');

    // show all players
    room.players.forEach(otherPlayer => {
      if (otherPlayer === player) {
        return;
      }
      let combatantsDisplay = '';
      if (otherPlayer.isInCombat()) {
        combatantsDisplay = getCombatantsDisplay(otherPlayer);
      }
      B.sayAt(player, '[Игрок] ' + otherPlayer.name + combatantsDisplay);
    });

    // show all the items in the rom
    room.items.forEach(item => {
      if (item.hasBehavior('resource')) {
        B.sayAt(player, `[${ItemUtil.qualityColorize(item, 'Ресурс')}] <green>${item.roomDesc}</green>`);
      } else {
        B.sayAt(player, `[${ItemUtil.qualityColorize(item, 'Предмет')}] <green>${item.roomDesc}</green>`);
      }
    });

    // show all npcs
    room.npcs.forEach(npc => {
      // show quest state as [!], [%], [?] for available, in progress, ready to complete respectively
      let hasNewQuest, hasActiveQuest, hasReadyQuest;
      if (npc.quests) {
        const quests = npc.quests.map(qid => {
          try {
            return state.QuestFactory.create(state, qid, player)
          } catch (e) {
            Logger.error(e.message);
            return null;
          }
        }).filter(q => q);

        hasNewQuest = quests.find(quest => player.questTracker.canStart(quest));
        hasReadyQuest = quests.find(quest => {
            return player.questTracker.isActive(quest.entityReference) &&
              player.questTracker.get(quest.entityReference).getProgress().percent >= 100;
        });
        hasActiveQuest = quests.find(quest => {
            return player.questTracker.isActive(quest.entityReference) &&
              player.questTracker.get(quest.entityReference).getProgress().percent < 100;
        });

        let questString = '';
        if (hasNewQuest || hasActiveQuest || hasReadyQuest) {
          questString += hasNewQuest ? '[<b><yellow>!</yellow></b>]' : '';
          questString += hasActiveQuest ? '[<b><yellow>%</yellow></b>]' : '';
          questString += hasReadyQuest ? '[<b><yellow>?</yellow></b>]' : '';
          B.at(player, questString + ' ');
        }
      }

      let combatantsDisplay = '';
      if (npc.isInCombat()) {
        combatantsDisplay = getCombatantsDisplay(npc);
      }

      // color NPC label by difficulty
      let npcLabel = 'НПС';
      switch (true) {
        case (player.level  - npc.level > 4):
          npcLabel = '<cyan>НПС</cyan>';
          break;
        case (npc.level - player.level > 9):
          npcLabel = '<b><black>НПС</black></b>';
          break;
        case (npc.level - player.level > 5):
          npcLabel = '<red>НПС</red>';
          break;
        case (npc.level - player.level > 3):
          npcLabel = '<yellow>НПС</red>';
          break;
        default:
          npcLabel = '<green>НПС</green>';
          break;
      }
      B.sayAt(player, `[${npcLabel}] ` + npc.name + combatantsDisplay);
    });

    B.at(player, '[<yellow><b>Выходы</yellow></b>: ');
      // find explicitly defined exits
      let foundExits = Array.from(room.exits).map(ex => {
        return [ex.direction, state.RoomManager.getRoom(ex.roomId)];
      });

      // infer from coordinates
      if (room.coordinates) {
        const coords = room.coordinates;
        const area = room.area;
        const directions = {
          север: [0, 1, 0],
          юг: [0, -1, 0],
          восток: [1, 0, 0],
          запад: [-1, 0, 0],
          вверх: [0, 0, 1],
          вниз: [0, 0, -1],
        };

        foundExits = [...foundExits, ...(Object.entries(directions)
          .map(([dir, diff]) => {
            return [dir, area.getRoomAtCoordinates(coords.x + diff[0], coords.y + diff[1], coords.z + diff[2])];
          })
          .filter(([dir, exitRoom]) => {
            return !!exitRoom;
          })
        )];
      }

      B.at(player, foundExits.map(([dir, exitRoom]) => {
        const door = room.getDoor(exitRoom) || exitRoom.getDoor(room);
        if (door && (door.locked || door.closed)) {
          return '(' + dir + ')';
        }

        return dir;
      }).join(' '));

      if (!foundExits.length) {
        B.at(player, 'нет');
      }
      B.sayAt(player, ']');
  }

  function lookEntity(state, player, args) {
    const room = player.room;

    args = args.split(' ');
    let search = null;

    if (args.length > 1) {
      search = args[0] === 'в' ? args[1] : args[0];
    } else {
      search = args[0];
    }

    let entity = CommandParser.parseDot(search, room.items);
    entity = entity || CommandParser.parseDot(search, room.players);
    entity = entity || CommandParser.parseDot(search, room.npcs);
    entity = entity || CommandParser.parseDot(search, player.inventory);

    if (!entity) {
      return B.sayAt(player, "Здесь нет ничего такого.");
    }

    if (entity instanceof Player) {
      // TODO: Show player equipment?
      B.sayAt(player, `Это другой игрок ${entity.name}.`);
      return;
    }

    B.sayAt(player, entity.description, 80);

    if (entity.timeUntilDecay) {
      B.sayAt(player, `Вам кажется, что ${entity.name} исчезнет через ${humanize(entity.timeUntilDecay)}.`);
    }

    const usable = entity.getBehavior('usable');
    if (usable) {
      if (usable.spell) {
        const useSpell = state.SpellManager.get(usable.spell);
        if (useSpell) {
          useSpell.options = usable.options;
          B.sayAt(player, useSpell.info(player));
        }
      }

      if (usable.effect && usable.config.description) {
        B.sayAt(player, usable.config.description);
      }

      if (usable.charges) {
        B.sayAt(player, `Тут осталось ${usable.charges} зарядов.`);
      }
    }

    if (entity instanceof Item) {
      switch (entity.type) {
        case ItemType.WEAPON:
        case ItemType.ARMOR:
          return B.sayAt(player, ItemUtil.renderItem(state, entity, player));
        case ItemType.CONTAINER: {
          if (!entity.inventory || !entity.inventory.size) {
            return B.sayAt(player, `${entity.name} - тут пусто.`);
          }

          if (entity.closed) {
            return B.sayAt(player, `Закрыто.`);
          }

          B.at(player, 'Содержимое');
          if (isFinite(entity.inventory.getMax())) {
            B.at(player, ` (${entity.inventory.size}/${entity.inventory.getMax()})`);
          }
          B.sayAt(player, ':');

          for (const [, item ] of entity.inventory) {
            B.sayAt(player, '  ' + ItemUtil.display(item));
          }
          break;
        }
      }
    }
  }


  function getCombatantsDisplay(entity) {
    const combatantsList = [...entity.combatants.values()].map(combatant => combatant.tname);
    return `, <red>сражается с </red>${combatantsList.join("<red>,</red> ")}`;
  }
};
