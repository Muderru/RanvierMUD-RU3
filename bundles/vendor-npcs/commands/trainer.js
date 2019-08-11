'use strict';

const sprintf = require('sprintf-js').sprintf;
const { Broadcast: B, CommandManager, ItemType } = require('ranvier');
const say = B.sayAt;
const ItemUtil = require('../../bundle-lib/lib/ItemUtil');
const Parser = require('../../bundle-lib/lib/ArgParser');


const subcommands = new CommandManager();
subcommands.add({
  name: 'list',
  aliases: [ 'список' ],
  command: state => (trainer, args, player) => {
    const trainerConfig = trainer.getMeta('trainer');
    
    if (!trainerConfig.spell) {
    } else {
        B.sayAt(player, "<b>" + B.center(40, 'Заклинания', 'green'));
        B.sayAt(player, "<b>" + B.line(40, '=', 'green'));
        let spell = state.SpellManager.find(trainerConfig.spell);
        let ending = (trainerConfig.cost === 1) ? ' очко магии' : ' очка магии';
        B.sayAt(player, spell.name + sprintf(' %-40s', B.center(40, trainerConfig.cost + ending)));
    }

    if (!trainerConfig.skill) {
    } else {
        B.sayAt(player, "<b>" + B.center(40, 'Умения', 'green'));
        B.sayAt(player, "<b>" + B.line(40, '=', 'green'));
        let skill = state.SkillManager.find(trainerConfig.skill);
        let ending = (trainerConfig.cost === 1) ? ' очко умений' : ' очка умений';
        B.sayAt(player, skill.name + sprintf(' %-40s', B.center(40, trainerConfig.cost + ending)));
    }
  }
});

subcommands.add({
  name: 'learn',
  aliases: [ 'выучить', 'учить' ],
  command: state => (trainer, args, player) => {
    const trainerConfig = trainer.getMeta('trainer');
    const tell = genTell(state, trainer, player);

    let skill = state.SkillManager.find(args, true);
    if (!skill) {
      skill = state.SpellManager.find(args, true);
    }

    if (!trainerConfig.spell) {
    } else {
        if (skill.id !== trainerConfig.spell) {
            return tell("Я не обучаю такому.");
        } else if (player.getMeta('magicPoints') < trainerConfig.cost) {
            return tell("У вас недостаточно очков магии.");
        } else if (player.getMeta('skill_' + skill.id) > 0) {
            return tell("Вы уже знаете это заклинание.");
        } else {
            let magicPoints = player.getMeta('magicPoints');
            player.setMeta('magicPoints', magicPoints - trainerConfig.cost);
            player.setMeta('skill_' + skill.id, 1);
            return tell("Вы выучили заклинание \'" + skill.name + "\'.");
        }
    }

    if (!trainerConfig.skill) {
    } else {
        if (skill.id !== trainerConfig.skill) {
          return tell("Я не обучаю такому.");
        } else if (player.getMeta('skillPoints') < trainerConfig.cost) {
            return tell("У вас недостаточно очков умений.");
        } else if (player.getMeta('skill_' + skill.id) > 0) {
            return tell("Вы уже знаете это умение.");
        } else {
            let skillPoints = player.getMeta('skillPoints');
            player.setMeta('skillPoints', spellPoints - trainerConfig.cost);
            player.setMeta('skill_' + skill.id, 1);
            return tell("Вы выучили умение \'" + skill.name + "\'.");
        }
    }

    player.save();
  }
});

module.exports = {
  aliases: [ 'учитель' ],
  usage: 'список, купить <умение>/<заклинание>',
  command: state => (args, player, arg0) => {
    // if list/buy aliases were used then prepend that to the args
    args = (!['учитель', 'мастер'].includes(arg0) ? arg0 + ' ' : '') + args;

    const trainer = Array.from(player.room.npcs).find(npc => npc.getMeta('trainer'));

    if (!trainer) {
      return B.sayAt(player, "Здесь нет учителей.");
    }

    const [ command, ...commandArgs ] = args.split(' ');
    const subcommand = subcommands.find(command);

    if (!subcommand) {
      return say(player, "Не допустимая команда. Смотрите '<b>помощь учителя</b>'");
    }

    subcommand.command(state)(trainer, commandArgs.join(' '), player);
  }
};

function genTell(state, trainer, player) {
  return message => {
    state.ChannelManager.get('tell').send(state, trainer, player.name + ' ' + message);
  };
}