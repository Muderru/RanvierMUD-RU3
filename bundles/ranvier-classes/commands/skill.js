'use strict';

module.exports = (srcPath) => {
  const B = require(srcPath + 'Broadcast');
  const SkillFlag = require(srcPath + 'SkillFlag');

  return {
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

      say('<b>' + B.center(80, skill.name, 'white', '-') + '</b>');
      if (skill.flags.includes(SkillFlag.PASSIVE)) {
        say('<b>Пассивные</b>');
      } else {
        say(`<b>Usage</b>: ${skill.id}`);
      }

      if (skill.resource && skill.resource.cost) {
        say(`<b>Стоимость</b>: <b>${skill.resource.cost}</b> ${skill.resource.attribute}`);
      }

      if (skill.cooldownLength) {
        say(`<b>Задержка</b>: <b>${skill.cooldownLength}</b> сек.`);
      }
      say(skill.info(player), 80);
      say('<b>' + B.line(80) + '</b>');
    }
  };
};


