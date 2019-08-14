'use strict';

const humanize = (sec) => { return require('humanize-duration')(sec, { language: 'ru', round: true }); };
const sprintf = require('sprintf-js').sprintf;
const {
  Broadcast: B,
  Item,
  ItemType,
  Logger,
  Player
} = require('ranvier');
const ArgParser = require('../../lib/lib/ArgParser');
const ItemUtil = require('../../lib/lib/ItemUtil');

module.exports = {
  usage: "смотреть [объект]",
  aliases: ['смотреть', 'осмотреть'],
  command: state => (args, player) => {
    if (!player.room) {
      Logger.error(player.getName() + ' is in limbo.');
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
      hasNewQuest = npc.quests.find(questRef => state.QuestFactory.canStart(player, questRef));
      hasReadyQuest = npc.quests.find(questRef => {
          return player.questTracker.isActive(questRef) &&
            player.questTracker.get(questRef).getProgress().percent >= 100;
      });
      hasActiveQuest = npc.quests.find(questRef => {
          return player.questTracker.isActive(questRef) &&
            player.questTracker.get(questRef).getProgress().percent < 100;
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

  const exits = room.getExits();
  const foundExits = [];

  // prioritize explicit over inferred exits with the same name
  for (const exit of exits) {
    if (foundExits.find(fe => fe.direction === exit.direction)) {
      continue;
    }

    foundExits.push(exit);
  }

  B.at(player, foundExits.map(exit => {
    const exitRoom = state.RoomManager.getRoom(exit.roomId);
    const door = room.getDoor(exitRoom) || exitRoom.getDoor(room);
    if (door && (door.locked || door.closed)) {
      return '(' + exit.direction + ')';
    }

    return exit.direction;
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

  let entity = ArgParser.parseDot(search, room.items);
  entity = entity || ArgParser.parseDot(search, room.players);
  entity = entity || ArgParser.parseDot(search, room.npcs);
  entity = entity || ArgParser.parseDot(search, player.inventory);

  if (!entity) {
    return B.sayAt(player, "Здесь нет ничего такого.");
  }

  if (entity instanceof Player) {
    // TODO: Show player equipment?
    B.sayAt(player, `Вы видите игрока ${entity.vname}.`);
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
          return B.sayAt(player, `В ${entity.dname} пусто.`);
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
