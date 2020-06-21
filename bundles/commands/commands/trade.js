'use strict';

const { Broadcast: B, ItemType } = require('ranvier');
const ArgParser = require('../../lib/lib/ArgParser');
const dot = ArgParser.parseDot;
const ItemUtil = require('../../lib/lib/ItemUtil');
const sprintf = require('sprintf-js').sprintf;

module.exports = {
  usage: 'торговать <купить/список/предмет> [предмет в инвентаре] [стоимость/игрок]',
  aliases: [ 'торговать', 'торговля' ],
  command: (state) => (args, player) => {
    if (!args.length) {
      B.sayAt(player, 'Как?');
      return state.CommandManager.get('help').execute('торговать', player);
    }

    const possibleCommands = ['купить', 'список', 'предмет', 'посмотреть'];

    let [command, itemToSell, playerOrPrice ] = args.split(' ');

    if (!itemToSell) {
      B.sayAt(player, 'Как?');
      return state.CommandManager.get('help').execute('торговать', player);
    }

    if (!possibleCommands.includes(command)) {
      B.sayAt(player, `<red>Неправильная команда: ${command}</red>`);
      return;
    }

    if (command === 'список') {
      let target = dot(itemToSell, player.room.players);
      if (!target) {
        return B.sayAt(player, 'Чей?');
      }

      if (!target.inventory || !target.inventory.size) {
        return B.sayAt(player, `${target.Name} ничего не продает.`);
      }

      let itemCategories = {
        [ItemType.POTION]: {
          title: 'Зелья, еда и напитки',
          items: [],
        },
        [ItemType.ARMOR]: {
          title: 'Доспехи',
          items: [],
        },
        [ItemType.WEAPON]: {
          title: 'Оружие',
          items: [],
        },
        [ItemType.CONTAINER]: {
          title: 'Контейнеры',
          items: [],
        },
        [ItemType.OBJECT]: {
          title: 'Разное',
          items: [],
        },
      };

      let counter = 0;
      for (const [, item ] of target.inventory) {
        if (item.getMeta('forSell') && item.getMeta('forSell') > 0) {
          itemCategories[item.type].items.push(item);
          counter++;
        }
      }
      if (counter === 0) {
        return B.sayAt(player, `${target.Name} ничего не продает.`);
      } else {
        for (const [, itemCategory] of Object.entries(ItemType)) {
          const category = itemCategories[itemCategory];
          if (!category || !category.items.length) {
            continue;
          }

          B.sayAt(player, '.' + B.center(78, category.title, 'yellow', '-') + '.');
          for (const item of category.items) {
            B.sayAt(player,
              '<yellow>|</yellow> ' +
              ItemUtil.qualityColorize(item, sprintf('%-48s', `[${item.name}]`)) +
              sprintf(' <yellow>|</yellow> <b>%-26s</b>', B.center(26, friendlyCurrencyName('золото') + ' x ' + item.getMeta('forSell'))) +
              '<yellow>|</yellow> '
            );
          }

          B.sayAt(player, "'" + B.line(78, '-', 'yellow') + "'");
          B.sayAt(player);
        }
      }
      return;
    }

    if (command === 'предмет') {
      if (!player.inventory || !player.inventory.size) {
        return B.sayAt(player, `У вас ничего нет.`);
      }

      let item = dot(itemToSell, player.inventory);
      if (!item) {
        return B.sayAt(player, 'Чем вы хотите торговать?');
      }

      if (!isFinite(playerOrPrice)) {
        return B.sayAt(player, `Нужно указать стоимость предмета.`);
      }

      playerOrPrice = parseInt(playerOrPrice, 10);
      item.setMeta('forSell', playerOrPrice);
      if (playerOrPrice === 0) {
        return B.sayAt(player, `Вы сняли с продажи ${ItemUtil.display(item, 'vname')}.`);
      } else {
        return B.sayAt(player, `Вы выставили на продажу ${ItemUtil.display(item)} по цене ${playerOrPrice}.`);
      }
    }

    if (command === 'купить') {
      let target = dot(playerOrPrice, player.room.players);
      if (!target) {
        return B.sayAt(player, 'Купить у кого?');
      }
      if (!target.inventory || !target.inventory.size) {
        return B.sayAt(player, `${target.Name} ничего не продает.`);
      }

      let item = dot(itemToSell, target.inventory);
      if (!item) {
        return B.sayAt(player, 'Что вы хотите купить?');
      }

      if (!item.getMeta('forSell') || item.getMeta('forSell') < 1) {
        return B.sayAt(player, 'Что вы хотите купить?');
      }

      const playerGold = player.getMeta('currencies.золото');
      const cost = item.getMeta('forSell');
      if (!playerGold || playerGold < cost) {
        return B.sayAt(player, 'У вас недостаточно денег.');
      }

      let ending = '';
      if (player.gender === 'male') {
        ending = '';
      } else if (player.gender === 'female') {
        ending = 'а';
      } else if (player.gender === 'plural') {
        ending = 'и';
      } else {
        ending = 'о';
      }

      item.setMeta('forSell', 0);
      target.removeItem(item);
      player.addItem(item);
      B.sayAt(player, `<bold>Вы купили ${ItemUtil.display(item, 'vname')} у ${target.rname} за ${cost} золота.</bold>`);
      B.sayAt(target, `<bold>${player.name} купил${ending} у вас ${ItemUtil.display(item, 'vname')} за ${cost} золота.</bold>`);
      player.setMeta('currencies.золото', playerGold - cost);
      const targetGold = target.getMeta('currencies.золото');
      target.setMeta('currencies.золото', targetGold + cost);
    }

    if (command === 'посмотреть') {
      let target = dot(playerOrPrice, player.room.players);
      if (!target) {
        return B.sayAt(player, 'Посмотреть у кого?');
      }
      if (!target.inventory || !target.inventory.size) {
        return B.sayAt(player, `${target.Name} ничего не продает.`);
      }

      let item = dot(itemToSell, target.inventory);
      if (!item) {
        return B.sayAt(player, 'Что вы хотите посмотреть?');
      }

      if (!item.getMeta('forSell') || item.getMeta('forSell') < 1) {
        return B.sayAt(player, 'Что вы хотите посмотреть?');
      }

      return B.sayAt(player, ItemUtil.renderItem(state, item, player));
    }

    function friendlyCurrencyName(currency) {
      return currency
        .replace('_', ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/(золото)/g, 'золота')
      ;
    }
  }
};

