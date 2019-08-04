'use strict';

const sprintf = require('sprintf-js').sprintf;
const { Broadcast: B, CommandManager, ItemType } = require('ranvier');
const say = B.sayAt;
const ItemUtil = require('../../bundle-lib/lib/ItemUtil');
const Parser = require('../../bundle-lib/lib/ArgParser');


const subcommands = new CommandManager();
subcommands.add({
  name: 'list',
  aliases: [ 'список' ],
  command: state => (vendor, args, player) => {
    const vendorConfig = vendor.getMeta('vendor');
    const items = getVendorItems(state, vendorConfig.items);
    const tell = genTell(state, vendor, player);

    // show item to player before purchasing
    if (args) {
      const item = Parser.parseDot(args, items);
      if (!item) {
        return tell("У меня нет этой вещи.");
      }

      item.hydrate(state);
      const vendorItem = vendorConfig.items[item.entityReference];

      B.sayAt(player, ItemUtil.renderItem(state, item, player));
      B.sayAt(player, `Цена: <b><white>[${friendlyCurrencyName(vendorItem.currency)}]</white></b> x ${vendorItem.cost}`);
      return;
    }

    // group vendor's items by category then display them
    let itemCategories = {
      [ItemType.POTION]: {
        title: 'Зелья',
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

    for (const item of items) {
      itemCategories[item.type].items.push(item);
    }

    for (const [, itemCategory] of Object.entries(ItemType)) {
      const category = itemCategories[itemCategory];
      if (!category || !category.items.length) {
        continue;
      }

      B.sayAt(player, '.' + B.center(78, category.title, 'yellow', '-') + '.');
      for (const item of category.items) {
        const vendorItem = vendorConfig.items[item.entityReference];

        B.sayAt(player,
          '<yellow>|</yellow> ' +
          ItemUtil.qualityColorize(item, sprintf('%-48s', `[${item.name}]`)) +
          sprintf(' <yellow>|</yellow> <b>%-26s</b>', B.center(26, friendlyCurrencyName(vendorItem.currency) + ' x ' + vendorItem.cost)) +
          '<yellow>|</yellow> '
        );
      }

      B.sayAt(player, "'" + B.line(78, '-', 'yellow') + "'");
      B.sayAt(player);
    }
  }
});

subcommands.add({
  name: 'buy',
  aliases: [ 'купить' ],
  command: state => (vendor, args, player) => {
    const vendorConfig = vendor.getMeta('vendor');
    const tell = genTell(state, vendor, player);
    if (!args || !args.length) {
      return tell("Отлично, что вы хотите купить?");
    }

    const items = getVendorItems(state, vendorConfig.items);
    const item = Parser.parseDot(args, items);

    if (!item) {
      return tell("У меня нет этой вещи.");
    }

    const vendorItem = vendorConfig.items[item.entityReference];

    const currencyKey = 'currencies.' + vendorItem.currency;
    const playerCurrency = player.getMeta(currencyKey);
    if (!playerCurrency || playerCurrency < vendorItem.cost) {
      return tell(`Вы не можете позволить себе это, оно стоит ${vendorItem.cost} ${friendlyCurrencyName(vendorItem.currency)}.`);
    }

    if (player.isInventoryFull()) {
      return tell("Вы не унесете больше.");
    }

    player.setMeta(currencyKey, playerCurrency - vendorItem.cost);
    item.hydrate(state);
    state.ItemManager.add(item);
    player.addItem(item);
    say(player, `<green>Вы потратили <b><white>${vendorItem.cost} ${friendlyCurrencyName(vendorItem.currency)}</white></b>, чтобы приобрести ${ItemUtil.display(item)}.</green>`);
    player.save();
  }
});

subcommands.add({
  name: 'sell',
  aliases: [ 'продать' ],
  command: state => (vendor, args, player) => {
    const tell = genTell(state, vendor, player);
    const [ itemArg, confirm ] = args.split(' ');

    if (!args || !args.length) {
      tell("Что вы хотите продать?");
    }

    const item = Parser.parseDot(itemArg, player.inventory);
    if (!item) {
      return say(player, "У вас этого нет.");
    }

    const sellable = item.getMeta('sellable');
    if (!sellable) {
      return say(player, "Эту вещь нельзя продать.");
    }

    if (!['poor', 'common'].includes(item.metadata.quality || 'common') && confirm !== 'да') {
      return say(player, "Чтобы продать вещь высокого качества, наберите '<b>продать <вещь> да</b>'.");
    }

    const currencyKey = 'currencies.' + sellable.currency;
    if (!player.getMeta('currencies')) {
      player.setMeta('currencies', {});
    }
    player.setMeta(currencyKey, (player.getMeta(currencyKey) || 0) + sellable.value);

    say(player, `<green>Вы продали ${ItemUtil.display(item)} за <b><white>${sellable.value} ${friendlyCurrencyName(sellable.currency)}</white></b>.</green>`);
    state.ItemManager.remove(item);
  }
});

// check sell value of an item
subcommands.add({
  name: 'value',
  aliases: [ 'цена', 'оценить', 'предложить' ],
  command: state => (vendor, args, player) => {
    const tell = genTell(state, vendor, player);

    if (!args || !args.length) {
      return tell("Что нужно оценить?");
    }

    const [ itemArg, confirm ] = args.split(' ');

    const targetItem = Parser.parseDot(itemArg, player.inventory);

    if (!targetItem) {
      return say(player, "У вас этого нет.");
    }

    const sellable = targetItem.getMeta('sellable');
    if (!sellable) {
      return say(player, "Вы не можете продать эту вещь.");
    }

    tell(`Я могу предложить вам <b><white>${sellable.value} ${friendlyCurrencyName(sellable.currency)}</white></b> за ${ItemUtil.display(targetItem)}.</green>`);
  }
});

module.exports = {
  aliases: [ 'торговец', 'список', 'купить', 'продать', 'цена', 'предложить' ],
  usage: 'список [поиск], купить <вещь>, продать <вещь>, цена <вещь>',
  command: state => (args, player, arg0) => {
    // if list/buy aliases were used then prepend that to the args
    args = (!['торговец', 'магазин'].includes(arg0) ? arg0 + ' ' : '') + args;

    const vendor = Array.from(player.room.npcs).find(npc => npc.getMeta('vendor'));

    if (!vendor) {
      return B.sayAt(player, "Здесь не торгуют.");
    }

    const [ command, ...commandArgs ] = args.split(' ');
    const subcommand = subcommands.find(command);

    if (!subcommand) {
      return say(player, "Не допустимая команда. Смотрите '<b>помощь магазины</b>'");
    }

    subcommand.command(state)(vendor, commandArgs.join(' '), player);
  }
};

function getVendorItems(state, vendorConfig) {
  return Object.entries(vendorConfig).map(([itemRef]) => {
    const area = state.AreaManager.getAreaByReference(itemRef);
    return state.ItemFactory.create(area, itemRef);
  });
}

function genTell(state, vendor, player) {
  return message => {
    state.ChannelManager.get('tell').send(state, vendor, player.name + ' ' + message);
  };
}

function friendlyCurrencyName(currency) {
  return currency
    .replace('_', ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
  ;
}
