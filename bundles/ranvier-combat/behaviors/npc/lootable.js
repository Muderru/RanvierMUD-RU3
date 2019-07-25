'use strict';

const LootTable = require('../../lib/LootTable');

module.exports = srcPath => {
  const B = require(srcPath + 'Broadcast');
  const Player = require(srcPath + 'Player');
  const Item = require(srcPath + 'Item');
  const Logger = require(srcPath + 'Logger');

  return {
    listeners: {
      killed: state => function (config, killer) {
        const lootTable = new LootTable(state, config);
        const currencies = lootTable.currencies();
        const resources = lootTable.resources();
        const items = lootTable.roll().map(
          item => state.ItemFactory.create(state.AreaManager.getAreaByReference(item), item)
        );

        const corpse = new Item(this.area, {
          id: 'труп',
          name: `труп ${this.rname}`,
          rname: `трупа ${this.rname}`,
          dname: `трупу ${this.rname}`,
          vname: `труп ${this.rname}`,
          tname: `трупом ${this.rname}`,
          pname: `трупе ${this.rname}`,
          gender: `male`,
          roomDesc: `Труп ${this.rname}`,
          description: `Гниющий труп ${this.rname}.`,
          keywords: this.keywords.concat(['труп']),
          type: 'CONTAINER',
          metadata: {
            noPickup: true,
          },
          maxItems: items.length,
          behaviors: {
            decay: {
              duration: 180
            }
          },
        });
        corpse.hydrate(state);

        Logger.log(`Generated corpse: ${corpse.uuid}`);

        items.forEach(item => {
          item.hydrate(state);
          corpse.addItem(item)
        });
        this.room.addItem(corpse);
        state.ItemManager.add(corpse);

        // Does this work if an NPC is in a player's party and kills something?
        if (killer && killer instanceof Player) {
          if (currencies) {
            distribute(currencies, 'деньги');
          }
          if (resources) {
            distribute(resources, 'ресурсы');
          }

          if (killer.getMeta('config.autoloot') === true) {
            state.CommandManager.get('get').execute(this.keywords[0] || 'труп', killer, 'взятьвсе');
          }

          function distribute(distributables, type) {
            distributables.forEach(distributable => {
              const friendlyName = distributable.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
              const key = `${type}.${distributable.name}`;
          
              // distribute  among group members in the same room
              const recipients = (killer.party ? [...killer.party] : [killer]).filter(recipient => {
                return recipient.room === killer.room && !recipient.isNpc;
              });
          
              let remaining = distributable.amount;
              for (const recipient of recipients) {
                // Split  evenly amount amongst recipients.  The way the math works out, the leader
                // of the party will get any remainder if the distributable isn't divisible evenly
                const amount = Math.floor(remaining / recipients.length) + (remaining % recipients.length);
                remaining -= amount;
                if (amount < 1) continue;
                B.sayAt(recipient, `<green>Вы получили ${type}: <b><white>[${friendlyName}]</white></b> x${amount}.</green>`);
          
                if (!recipient.getMeta(type)) {
                  recipient.setMeta(type, {});
                }
                recipient.setMeta(key, (recipient.getMeta(key) || 0) + amount);
                recipient.save();          
              }
            });
          }

        }
      }
    }
  };
};