const { Broadcast, SkillType, ItemType } = require('ranvier');
const SkillUtil = require('../../classes/lib/SkillUtil');
const MaterialsUtil = require('../lib/MaterialsUtil');
const EnhanceItem = require('../../lib/lib/EnhanceItem');
const ItemUtil = require('../../lib/lib/ItemUtil');

const manaCost = 150;
const baseChance = 45; //начальная вероятность успеха

/**
 * трансмутация
 */
module.exports = {
  aliases: ['трансмутация'],
  name: 'трансмутация',
  gender: 'female',
  type: SkillType.SPELL,
  requiresTarget: false,
  initiatesCombat: false,
  targetSelf: false,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 300,

  run: (state) => function (args, player, target) {
    if (!player.hasItem('craft:doriat_cube')) {
      return Broadcast.sayAt(player, 'Вам нужен дориатский куб для этого.');
    }

    const cube = player.hasItem('craft:doriat_cube');
    if (!cube.inventory || !cube.inventory.size) {
      return Broadcast.sayAt(player, 'В дориатском кубе пусто.');
    }

    let materials = [];
    let targetItem = null;
    let catalyst = null;
    for (const [, item] of cube.inventory) {
      if (item.type === ItemType.RESOURCE) {
        for (const material of item.materials) {
          materials.push(material);
          if (material === 'катализатор') {
            catalyst = item;
          }
        }
      } else if ((item.type === ItemType.WEAPON) || (item.type === ItemType.ARMOR)) {
        targetItem = item;
      }
    }

    if (!targetItem) {
      return Broadcast.sayAt(player, 'В кубе нет подходящего предмета для улучшения.');
    }

    if (targetItem.getMeta('quality') !== 'common') {
      return Broadcast.sayAt(player, 'Можно улучшить только обычную вещь.');
    }

    if (!catalyst) {
      return Broadcast.sayAt(player, 'Нужен катализатор трансмутации.');
    }

    let requiredMaterials = [];
    const stats = Object.assign({}, targetItem.metadata.stats);
    for (const stat in stats) {
      requiredMaterials.push(MaterialsUtil.material(stat));
    }

    for (const material of requiredMaterials) {
      if (!materials.includes(material)) {
        return Broadcast.sayAt(player, `Вам ещё нужен ${material}.`);
      }
    }

    const successChance = baseChance + (SkillUtil.getBuff(player, 'spell_transmutation') / 2);
    for (const [, item] of cube.inventory) {
      if (item === targetItem) {
        if (catalyst.getMeta('quality') === 'uncommon') {
          EnhanceItem.enhance(item, 'uncommon');
        } else if (catalyst.getMeta('quality') === 'rare') {
          EnhanceItem.enhance(item, 'rare');
        } else if (catalyst.getMeta('quality') === 'epic') {
          EnhanceItem.enhance(item, 'epic');
        } else if (catalyst.getMeta('quality') === 'legendary') {
          EnhanceItem.enhance(item, 'legendary');
        } else if (catalyst.getMeta('quality') === 'artifact') {
          EnhanceItem.enhance(item, 'artifact');
        } else {
          return Broadcast.sayAt(player, `${targetItem.Vname} нельзя улучшить.`);
        }
      } else {
        cube.removeItem(item);
      }
    }

    if ((Math.random() * 100) <= successChance) {
      Broadcast.sayAt(player, `Вы создали ${ItemUtil.display(targetItem, 'vname')}.`);
    } else {
      cube.removeItem(targetItem);
      Broadcast.sayAt(player, 'Вы не смогли улучшить предмет. Он разрушился при трансмутации.');
    }

    SkillUtil.skillUp(state, player, 'spell_transmutation');
  },

  info: (player) => 'Заклинание позволяет улучшать вещи, при наличии подходящих ресурсов. Требуется дориатский куб. Вероятность улучшения зависит от уровня владения заклинанием, всегда меньше 100%. При неудаче предмет будет разрушен.',
};
