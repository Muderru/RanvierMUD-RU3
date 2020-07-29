const { sprintf } = require('sprintf-js');
const { Broadcast: B, SkillFlag } = require('ranvier');

module.exports = {
  aliases: ['умения', 'заклинания', 'способности'],
  command: (state) => (args, player) => {
    const say = (message) => B.sayAt(player, message);

    const skill = [
      'judge', 'lunge', 'rend', 'secondwind', 'shieldblock', 'smite',
      'hide', 'detect_hide', 'axes', 'bows', 'light_armor', 'medium_armor',
      'heavy_armor', 'maces', 'polearms', 'staves', 'swords', 'various_weapons',
      'rescue', 'daggers', 'bash',
    ];

    const spell = [
      'fireball', 'heal', 'plea', 'invisibility', 'detect_invisibility', 'paralysis',
      'light', 'recall', 'petty_demon', 'ice_peak', 'lightning', 'acid', 'silence',
      'poison',
    ];

    say(`<b>${B.center(40, 'Умения', 'green')}`);
    say(`<b>${B.line(40, '=', 'green')}`);

    for (const skillId of skill) {
      const skillLearned = state.SkillManager.find(skillId, true);
      const skillname = `skill_${skillId}`;
      if (!skillLearned.flags.includes(SkillFlag.PASSIVE)) {
        if (player.getMeta(skillname) > 0) {
          say(`<b>${B.center(40, `${skillLearned.name[0].toUpperCase() + skillLearned.name.slice(1)} (${player.getMeta(skillname)} %)`)}`);
        }
      }
    }

    say();

    say(`<b>${B.center(40, 'Заклинания', 'green')}`);
    say(`<b>${B.line(40, '=', 'green')}`);

    for (const spellId of spell) {
      const spellname = `spell_${spellId}`;
      if (player.getMeta(spellname) > 0) {
        const spellLearned = state.SpellManager.find(spellId);
        say(`<b>${B.center(40, `${spellLearned.name[0].toUpperCase() + spellLearned.name.slice(1)} (${player.getMeta(spellname)} %)`)}`);
      }
    }

    say();

    say(`<b>${B.center(40, 'Пассивные', 'green')}`);
    say(`<b>${B.line(40, '=', 'green')}`);

    for (const skillId of skill) {
      const skillLearned = state.SkillManager.find(skillId, true);
      const skillname = `skill_${skillId}`;
      if (skillLearned.flags.includes(SkillFlag.PASSIVE)) {
        if (player.getMeta(skillname) > 0) {
          say(`<b>${B.center(40, skillLearned.name[0].toUpperCase() + skillLearned.name.slice(1))}`);
        }
      }
    }

    say();
  },
};
