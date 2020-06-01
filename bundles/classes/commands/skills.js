'use strict';

const sprintf = require('sprintf-js').sprintf;
const { Broadcast: B, Logger, SkillFlag } = require('ranvier');

module.exports = {
  aliases: ['умения', 'заклинания', 'способности'],
  command: state => (args, player) => {
    const say = message => B.sayAt(player, message);

    const skill = [
      "judge", "lunge", "rend", "secondwind", "shieldblock", "smite", 
      "hide", "detect_hide", "axes", "bows", "light_armor", "medium_armor", 
      "heavy_armor", "maces", "polearms", "staves", "swords", "various_weapons", 
      "rescue", "daggers",
    ];

    const spell = [
      "fireball", "heal", "plea","invisibility", "detect_invisibility", "paralysis", 
      "light", "recall", "petty_demon", "ice_peak", "lightning", "acid", "silence",
    ];

    say("<b>" + B.center(40, 'Умения', 'green'));
    say("<b>" + B.line(40, '=', 'green'));

    for (let skillId of skill) {
      let skillLearned = state.SkillManager.find(skillId, true);
      let skillname = 'skill_' + skillId;
      if (!skillLearned.flags.includes(SkillFlag.PASSIVE)) {
        if (player.getMeta(skillname) > 0) {
          say("<b>" + B.center(40, skillLearned.name[0].toUpperCase() + skillLearned.name.slice(1) + ' (' + player.getMeta(skillname) + ' %)'));
        }
      }
    }

    say();

    say("<b>" + B.center(40, 'Заклинания', 'green'));
    say("<b>" + B.line(40, '=', 'green'));

    for (let spellId of spell) {
      let spellname = 'spell_' + spellId;
        if (player.getMeta(spellname) > 0) {
          let spellLearned = state.SpellManager.find(spellId);
          say("<b>" + B.center(40, spellLearned.name[0].toUpperCase() + spellLearned.name.slice(1) + ' (' + player.getMeta(spellname) + ' %)'));
        }
    }

    say();

    say("<b>" + B.center(40, 'Пассивные', 'green'));
    say("<b>" + B.line(40, '=', 'green'));

    for (let skillId of skill) {
      let skillLearned = state.SkillManager.find(skillId, true);
      let skillname = 'skill_' + skillId;
        if (skillLearned.flags.includes(SkillFlag.PASSIVE)) {
          if (player.getMeta(skillname) > 0) {
            say("<b>" + B.center(40, skillLearned.name[0].toUpperCase() + skillLearned.name.slice(1)));
          }
        }
    }

    say();
  }
};
