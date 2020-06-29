'use strict';

const { Broadcast: B, SkillFlag } = require('ranvier');

module.exports = {
  aliases: [ 'умение', 'заклинание' ],
  command : state => (args, player) => {
    const say = (message, wrapWidth) => B.sayAt(player, message, wrapWidth);

    if (!args.length) {
      return say("О каком умении или заклинании вы хотите узнать? Наберите 'умения', чтобы увидеть все умения и заклинания.");
    }

    let skill = state.SkillManager.find(args, true);
    if (!skill) {
      skill = state.SpellManager.find(args, true);
    }

    if (!skill) {
      return say("Вы не знаете такого умения.");
    }

    say('<b>' + B.center(80, skill.name[0].toUpperCase() + skill.name.slice(1), 'white', '-') + '</b>');
    if (skill.flags.includes(SkillFlag.PASSIVE)) {
      say('<b>Пассивное</b>');
    } else {
      say(`<b>Использование</b>: ${skill.id}, ${skill.aliases[0]}`);
    }

    if (skill.resource && skill.resource.cost) {
      say(`<b>Стоимость</b>: <b>${skill.resource.cost}</b> ${skill.resource.attribute}`);
    }

    if (skill.cooldownLength) {
      say(`<b>Задержка</b>: <b>${skill.cooldownLength}</b> секунд`);
    }
    say(skill.info(player), 80);
    say('<b>' + B.line(80) + '</b>');
  }
};
