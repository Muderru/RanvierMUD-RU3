const { Broadcast, Heal, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const manaCost = 80;
const bonusThreshold = 50;
const cooldown = 10;
const ddMod = 0.8; // direct heal coefficient

/**
 * Basic cleric spell
 */
module.exports = {
  aliases: ['благодать'],
  name: 'благодать',
  gender: 'female',
  damageVerb: 'окутывает',
  type: SkillType.SPELL,
  initiatesCombat: false,
  requiresTarget: true,
  targetSelf: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown,

  run: (state) => function (args, player, target) {
    const maxHealth = target.getMaxAttribute('health');
    let amount = Math.floor(SkillUtil.directHealAmount(player, target, 'ether', 'plea') * ddMod);

    if (target.getAttribute('health') < (maxHealth * (bonusThreshold / 100))) {
      amount *= 2;
    }

    const heal = new Heal('health', amount, player, this);

    if (target !== player) {
      Broadcast.sayAt(player, `<b><green>Вы взываете к силам Света и лечите раны ${target.rname}.</green></b>`);
      Broadcast.sayAtExcept(player.room, `<b><green>${player.Name} взывает к силам Света и лечит раны ${target.rname}.</green></b>`, [target, player]);
      Broadcast.sayAt(target, `<b><green>${player.Name} взывает к силам Света и лечит ваши раны.</green></b>`);
    } else {
      Broadcast.sayAt(player, '<b><green>Вы взываете к силам Света и лечите ваши раны.</green></b>');
      Broadcast.sayAtExcept(player.room, `<b><green>${player.Name} взывает к силам Света и лечит свои раны.</green></b>`, [player, target]);
    }

    heal.commit(target);

    SkillUtil.skillUp(state, player, 'spell_plea');
  },

  info: (player) => `Воззвать к силам Света и восстановить жизнь цели в количестве зависящем от урона оружия, интеллекта, бонусного урона эфиром и уровня владения умением заклинателя. Если здоровье цели меньше ${bonusThreshold}%, Милость Света излечивает в два раза больше.`,
};
