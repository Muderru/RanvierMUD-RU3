'use strict';

const sprintf = require('sprintf-js').sprintf;
const { Broadcast: B, Logger } = require('ranvier');

module.exports = {
  aliases: ['умения', 'заклинания', 'способности'],
  command: state => (args, player) => {
    const say = message => B.sayAt(player, message);

    let skill = [
      "judge",
      "lunge",
      "rend",
      "secondwind",
      "shieldblock",
      "smite",
    ];

    let spell = [
      "fireball",
      "heal",
      "plea",
    ];

    say("<b>" + B.center(40, 'Умения', 'green'));
    say("<b>" + B.line(40, '=', 'green'));

    for (let skillId of skill) {
      let skillname = 'skill_' + skillId;
        if (player.getMeta(skillname) > 0) {
          let skillLearned = state.SkillManager.find(skillId);
          say("<b>" + B.center(40, skillLearned.name[0].toUpperCase() + skillLearned.name.slice(1) + ' (' + player.getMeta(skillname) + ' %)'));
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

      // end with a line break
      say();
  }
};
