'use strict';

const sprintf = require('sprintf-js').sprintf;
const { Broadcast: B, CommandManager, ItemType } = require('ranvier');
const Crafting = require('../lib/Crafting');
const say = B.sayAt;
const ItemUtil = require('../../lib/lib/ItemUtil');

const subcommands = new CommandManager();

/** LIST **/
subcommands.add({
  name: 'list',
  aliases: [ 'список' ],
  command: state => (args, player) => {
    const craftingCategories = getCraftingCategories(state);

    // list categories
    if (!args || !args.length) {
      say(player, '<b>Категории ремесла</b>');
      say(player, B.line(40));

      return craftingCategories.forEach((category, index) => {
        say(player, sprintf('%2d) %s', parseInt(index, 10) + 1, craftingCategories[index].title));
      });
    }

    let [itemCategory, itemNumber] = args.split(' ');

    itemCategory = parseInt(itemCategory, 10) - 1;
    const category = craftingCategories[itemCategory];
    if (!category) {
      return say(player, "Недопустимая категория.");
    }

    // list items within a category
    if (!itemNumber) {
      say(player, `<b>${category.title}</b>`);
      say(player, B.line(40));

      if (!category.items.length) {
        return say(player, B.center(40, "Нет рецептов."));
      }

      return category.items.forEach((categoryEntry, index) => {
        say(player, sprintf('%2d) ', index + 1) + ItemUtil.display(categoryEntry.item));
      });
    }

    itemNumber = parseInt(itemNumber, 10) - 1;
    const item = category.items[itemNumber];
    if (!item) {
      return say(player, "Недопустимый предмет.");
    }

    say(player, ItemUtil.renderItem(state, item.item, player));
    say(player, '<b>Рецепт:</b>');
    for (const [resource, amount] of Object.entries(item.recipe)) {
      const ingredient = Crafting.getResourceItem(resource);
      say(player, `  ${ItemUtil.display(ingredient)} x ${amount}`);
    }
  }
});

/** CREATE **/
subcommands.add({
  name: 'create',
  aliases: [ 'создать' ],
  command: state => (args, player) => {
    if (!args || !args.length) {
      return say(player, "Создать что? Например, 'ремесло создать 1 1");
    }

    const isInvalidSelection = categoryList => category =>
      isNaN(category) || category < 0 || category > categoryList.length;

    const craftingCategories = getCraftingCategories(state);
    const isInvalidCraftingCategory = isInvalidSelection(craftingCategories);

    let [itemCategory, itemNumber] = args.split(' ');

    itemCategory = parseInt(itemCategory, 10) - 1;
    if (isInvalidCraftingCategory(itemCategory)) {
      return say(player, "Недопустимая категория.");
    }

    const category = craftingCategories[itemCategory];
    const isInvalidCraftableItem = isInvalidSelection(category.items);
    itemNumber = parseInt(itemNumber, 10) - 1;
    if (isInvalidCraftableItem(itemNumber)) {
      return say(player, "Недопустимый предмет.");
    }

    const item = category.items[itemNumber];
    // check to see if player has resources available
    for (const [resource, recipeRequirement] of Object.entries(item.recipe)) {
      const playerResource = player.getMeta(`resources.${resource}`) || 0;
      if (playerResource < recipeRequirement) {
        return say(player, `У вас недостаточно ресурсов. Наберите 'ремесло список ${args}' чтобы увидеть рецепт. Вам нужно ${recipeRequirement - playerResource} больше ${resource}.`);
      }
    }

    if (player.isInventoryFull()) {
      return say(player, "Вы не можете держать больше вещей.");
    }

    // deduct resources
    for (const [resource, amount] of Object.entries(item.recipe)) {
      player.setMeta(`resources.${resource}`, player.getMeta(`resources.${resource}`) - amount);
      const resItem = Crafting.getResourceItem(resource);
      say(player, `<green>Вы потратили ${amount} x ${ItemUtil.display(resItem)}.</green>`);
    }

    state.ItemManager.add(item.item);
    player.addItem(item.item);
    say(player, `<b><green>Вы создали ${ItemUtil.display(item.item, 'vname')}.</green></b>`);
    player.save();
  }
});

module.exports = {
  usage: 'ремесло <список/создать> [категория #] [предмет #]',
  aliases: ['крафтинг', 'ремесло'],
  command: state => (args, player) => {
    if (!args.length) {
      return say(player, "Отсутствует команда ремесла. Смотрите 'помощь ремесло'");
    }

    const [ command, ...subArgs ] = args.split(' ');

    const subcommand = subcommands.find(command);
    if (!subcommand) {
      return say(player, "Недопустимая команда. Используйте ремесло список или ремесло создать.");
    }

    subcommand.command(state)(subArgs.join(' '), player);
  }
};

function getCraftingCategories(state) {
  let craftingCategories = [
    {
      type: ItemType.POTION,
      title: "Зелье",
      items: []
    },
    {
      type: ItemType.WEAPON,
      title: "Оружие",
      items: []
    },
    {
      type: ItemType.ARMOR,
      title: "Доспех",
      items: []
    },
  ];

  const recipes = Crafting.getRecipes();
  for (const recipe of recipes) {
    const recipeItem = state.ItemFactory.create(
      state.AreaManager.getAreaByReference(recipe.item),
      recipe.item
    );

    const catIndex = craftingCategories.findIndex(cat => {
      return cat.type === recipeItem.type;
    });

    if (catIndex === -1) {
      continue;
    }

  recipeItem.hydrate(state);
    craftingCategories[catIndex].items.push({
      item: recipeItem,
      recipe: recipe.recipe
    });
  }

  return craftingCategories;
}
