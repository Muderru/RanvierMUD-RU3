const { Player, Item, Logger } = require('ranvier');
const LootTable = require('../../lib/LootTable');
const EnhanceItem = require('../../../lib/lib/EnhanceItem');

module.exports = {
  listeners: {
    killed: (state) => async function (config, killer) {
      const {
        room, name, rname, dname, vname, tname, pname, gender, area, keywords,
      } = this;

      const lootTable = new LootTable(state, config);
      const currencies = lootTable.currencies();
      const roll = await lootTable.roll();
      const items = roll.map(
        (item) => state.ItemFactory.create(state.AreaManager.getAreaByReference(item), item),
      );

      const corpse = new Item(area, {
        id: 'corpse',
        name: `труп ${rname}`,
        rname: `трупа ${rname}`,
        dname: `трупу ${rname}`,
        vname: `труп ${rname}`,
        tname: `трупом ${rname}`,
        pname: `трупе ${rname}`,
        gender: 'male',
        roomDesc: `Труп ${rname}`,
        description: `Это гниющий труп ${rname}`,
        keywords: keywords.concat(['труп']),
        type: 'CONTAINER',
        metadata: {
          noPickup: true,
        },
        maxItems: items.length,
        behaviors: {
          decay: {
            duration: 300,
          },
        },
      });
      corpse.hydrate(state);

      Logger.log(`Generated corpse: ${corpse.uuid}`);

      let uncommonChance = 10;
      let rareChance = 4.5;
      let epicChance = 1.5;
      let legendaryChance = 0.5;
      let artifactChance = 0.1;
      let increaseChance = 1;
      //увеличенный шанс лоада улучшенных вещей для боссов
      if (this.getMeta('boss')) {
        Logger.log(`Boss loot drop chance increased: ${this.entityReference}`);
        const difficulty = this.getMeta('boss').length;
        increaseChance = difficulty * 10;
        uncommonChance *= increaseChance;
        rareChance *= increaseChance;
        epicChance *= increaseChance;
        legendaryChance *= increaseChance;
        artifactChance *= increaseChance;
        const chance = Math.random() * 100;
        //добавляем в труп боссов материалы для крафта
        if (chance <= artifactChance) {
          const goldGem = state.ItemFactory.create(state.AreaManager.getArea('craft'), 'craft:goldessence');
          goldGem.hydrate(state);
          corpse.maxItems += 1;
          corpse.addItem(goldGem);
        } else if (chance <= legendaryChance) {
          const redGem = state.ItemFactory.create(state.AreaManager.getArea('craft'), 'craft:redessence');
          redGem.hydrate(state);
          corpse.maxItems += 1;
          corpse.addItem(redGem);
        } else if (chance <= epicChance) {
          const magentaGem = state.ItemFactory.create(state.AreaManager.getArea('craft'), 'craft:magentaessence');
          magentaGem.hydrate(state);
          corpse.maxItems += 1;
          corpse.addItem(magentaGem);
        } else if (chance <= rareChance) {
          const blueGem = state.ItemFactory.create(state.AreaManager.getArea('craft'), 'craft:blueessence');
          blueGem.hydrate(state);
          corpse.maxItems += 1;
          corpse.addItem(blueGem);
        } else if (chance <= uncommonChance) {
          const greenGem = state.ItemFactory.create(state.AreaManager.getArea('craft'), 'craft:greenessence');
          greenGem.hydrate(state);
          corpse.maxItems += 1;
          corpse.addItem(greenGem);
        }
      }
      items.forEach((item) => {
        item.hydrate(state);
        const chance = Math.random() * 100;
        if (chance <= artifactChance && item.getMeta('slot') && item.getMeta('quality') === 'common') {
          item = EnhanceItem.enhance(item, 'artifact');
        } else if (chance <= legendaryChance && item.getMeta('slot') && item.getMeta('quality') === 'common') {
          item = EnhanceItem.enhance(item, 'legendary');
        } else if (chance <= epicChance && item.getMeta('slot') && item.getMeta('quality') === 'common') {
          item = EnhanceItem.enhance(item, 'epic');
        } else if (chance <= rareChance && item.getMeta('slot') && item.getMeta('quality') === 'common') {
          item = EnhanceItem.enhance(item, 'rare');
        } else if (chance <= uncommonChance && item.getMeta('slot') && item.getMeta('quality') === 'common') {
          item = EnhanceItem.enhance(item, 'uncommon');
        }
        corpse.addItem(item);
      });
      room.addItem(corpse);
      state.ItemManager.add(corpse);

      if (killer.getMeta('config.автосбор') === true) {
        state.CommandManager.get('get').execute(this.keywords[0] || 'труп', killer, 'взятьвсе');
      }

      if (killer && killer instanceof Player) {
        if (currencies) {
          currencies.forEach((currency) => {
            // distribute currency among group members in the same room
            const recipients = (killer.party ? [...killer.party] : [killer]).filter((recipient) => recipient.room === killer.room);

            let remaining = currency.amount;
            for (const recipient of recipients) {
              // Split currently evenly amount recipients.  The way the math works out the leader
              // of the party will get any remainder if the currency isn't divisible evenly
              const amount = Math.floor(remaining / recipients.length) + (remaining % recipients.length);
              remaining -= amount;

              recipient.emit('currency', currency.name, amount * increaseChance);
              state.CommandManager.get('look').execute(corpse.uuid, recipient);
            }
          });
        }
      }
    },
  },
};
