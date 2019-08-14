'use strict';

const Ranvier = require('ranvier');
const { Broadcast: B, CommandManager } = require('ranvier');
const Parser = require('../../lib/lib/ArgParser');
const say = B.sayAt;

const subcommands = new CommandManager();
subcommands.add({
  name: 'create',
  aliases: [ 'создать' ],
  command: state => (args, player) => {
    if (player.party) {
      return say(player, "Вы уже в группе.");
    }

    state.PartyManager.create(player);
    say(player, "<b><yellow>Вы создали группу, приглашайте в нее игроков командой '<white>группа пригласить <имя></white>'</yellow></b>");
  }
});

subcommands.add({
  name: 'invite',
  aliases: [ 'пригласить' ],
  command: state => (args, player) => {
    if (!player.party) {
      return say(player, "Вы не в группе, создайте ее командой '<b>группа создать</b>'.");
    }

    if (player.party && player !== player.party.leader) {
      return say(player, "Вы не лидер группы.");
    }

    if (!args.length) {
      return say(player, "Пригласить кого?");
    }

    const target = Parser.parseDot(args, player.room.players);

    if (target === player) {
      return say(player, "Вы спрашиваете себя, вступили ли вы в свою собственную группу? Едва ли.");
    }

    if (!target) {
      return say(player, "Тут никого с таким именем нет.");
    }

    if (target.party) {
         if (target.gender === 'male') {
           return say(player, "Он уже в группе.");
         } else if (target.gender === 'female') {
           return say(player, "Она уже в группе.");
         } else if (target.gender === 'plural') {
           return say(player, "Они уже в группе.");
         } else {
           return say(player, "Оно уже в группе.");
         }
      }

    say(target, `<b><yellow>${player.name} приглашает вас вступить в группу. Согласитесь/откажитесь командой '<white>группа вступить/отказаться ${player.name}</white>'</yellow></b>`);
    say(player, `<b><yellow>Вы пригласили ${target.vname} присоединиться к группе.</yellow></b>`);
    player.party.invite(target);
    B.prompt(target);
  }
}
);

subcommands.add({
  name: 'disband',
  aliases: [ 'распустить' ],
  command: state => (args, player) => {
    if (!player.party) {
      return say(player, "Вы не в группе.");
    }

    if (player !== player.party.leader) {
      return say(player, "Вы не лидер группы.");
    }

    if (!args || args !== 'да') {
      return say(player, `<b><yellow>Подтвердите роспуск группы командой '<white>группа распустить да</white>'</yellow></b>`);
    }

    say(player.party, '<b><green>Группа распущена!</green></b>');
    state.PartyManager.disband(player.party);
  }
});

subcommands.add({
  name: 'join',
  aliases: [ 'вступить' ],
  command: state => (args, player) => {
    if (!args.length) {
      return say(player, "В какую группу вы хотите вступить?");
    }

    const target = Parser.parseDot(args, player.room.players);

    if (!target) {
      return say(player, "Их здесь нет.");
    }

    if (!target.party || target !== target.party.leader) {
      return say(player, "Это не лидер группы.");
    }

    if (!target.party.isInvited(player)) {
      return say(player, "Вас туда никто не приглашал.");
    }

    say(player, `<b><yellow>Вы вступили в группу ${target.rname}.</yellow></b>`);
    
    if (player.gender === 'male') {
        say(target.party, `<b><yellow>${player.name} присоединился к группе.</yellow></b>`);
      } else if (player.gender === 'female') {
        say(target.party, `<b><yellow>${player.name} присоединилась к группе.</yellow></b>`);
      } else if (player.gender === 'plural') {
        say(target.party, `<b><yellow>${player.name} присоединились к группе.</yellow></b>`);
      } else {
        say(target.party, `<b><yellow>${player.name} присоединилось к группе.</yellow></b>`);
      }
      
    target.party.add(player);
    player.follow(target);
  }
});

subcommands.add({
  name: 'decline',
  aliases: [ 'отказаться' ],
  command: state => (args, player) => {
    if (!args.length) {
      return say(player, "Отказаться от чего приглашения?");
    }

    const target = Parser.parseDot(args, player.room.players);

    if (!target) {
      return say(player, "Никого с таким именем тут нет.");
    }

    say(player, `<b><yellow>Вы отказались присоединяться к группе ${target.rname}.</yellow></b>`);

    if (player.gender === 'male') {
        say(target, `<b><yellow>${player.name} отказался присоединяться к группе.</yellow></b>`);
      } else if (player.gender === 'female') {
        say(target, `<b><yellow>${player.name} отказалась присоединяться к группе.</yellow></b>`);
      } else if (player.gender === 'plural') {
        say(target, `<b><yellow>${player.name} отказались присоединяться к группе.</yellow></b>`);
      } else {
        say(target, `<b><yellow>${player.name} отказалось присоединяться к группе.</yellow></b>`);
      }

    target.party.removeInvite(player);
  }
});

subcommands.add({
  name: 'list',
  aliases: [ 'список' ],
  command: state => (args, player) => {
    if (!player.party) {
      return say(player, "Вы не в группе.");
    }

    say(player, '<b>' + B.center(80, 'Group', 'green', '-') + '</b>');
    for (const member of player.party) {
      let tag = '   ';
      if (member === player.party.leader) {
        tag = '[Л]';
      }
      say(player, `<b><green>${tag} ${member.name}</green></b>`);
    }
  }
});

subcommands.add({
  name: 'leave',
  aliases: [ 'покинуть' ],
  command: state => (args, player) => {
    if (!player.party) {
      return say(player, "Вы не в группе.");
    }

    if (player === player.party.leader) {
      return say(player, "You have to disband if you want to leave the group.");
    }

    const party = player.party;
    player.party.delete(player);

    if (player.gender === 'male') {
        say(party, `<b><yellow>${player.name} покинул группу.</yellow></b>`);
      } else if (player.gender === 'female') {
        say(party, `<b><yellow>${player.name} покинула группу.</yellow></b>`);
      } else if (player.gender === 'plural') {
        say(party, `<b><yellow>${player.name} покинули группу.</yellow></b>`);
      } else {
        say(party, `<b><yellow>${player.name} покинуло группу.</yellow></b>`);
      }

    say(player, '<b><yellow>Вы покинули группу.</yellow></b>');
  }
});

module.exports = {
  aliases: [ 'группа' ],
  command: state => (args, player) => {

    if (!args || !args.length) {
      args = 'list';
    }

    const [ command, ...commandArgs ] = args.split(' ');
    const subcommand = subcommands.find(command);

    if (!subcommand) {
      return say(player, "Недопустимая команда.");
    }

    subcommand.command(state)(commandArgs.join(' '), player);
  }
};
