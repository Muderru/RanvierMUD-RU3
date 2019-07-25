'use strict';

const sprintf = require('sprintf-js').sprintf;

module.exports = srcPath => {
  const B = require(srcPath + 'Broadcast');
  const CommandManager = require(srcPath + 'CommandManager');

  const subcommands = new CommandManager();
  subcommands.add({
    name: 'список',
    command: state => (args, player) => {
      const waypoints = player.getMeta('waypoints');

      if (!waypoints || !waypoints.saved.length) {
        return B.sayAt(player, 'У вас нет сохраненных путеводных точек.');
      }

      B.sayAt(player, 'Порталы:');
      for (const [i, savedWaypoint] of Object.entries(waypoints.saved)) {
        const room = state.RoomManager.getRoom(savedWaypoint);
        B.sayAt(player, sprintf('%2s) %s%s', i + 1, waypoints.home === room.entityReference ? '(Д) ' : '', room.title));
      }
    }
  });

  subcommands.add({
    name: 'сохранить',
    command: state => (args, player) => {
      if (!player.room.hasBehavior('waypoint')) {
        return B.sayAt(player, 'Вы не у портала.');
      }

      let waypoints = player.getMeta('waypoints');

      waypoints = waypoints || {
        saved: [],
        home: null
      };

      if (waypoints.saved.includes(player.room.entityReference)) {
        return B.sayAt(player, 'Вы уже сохранили эту путеводную точку.');
      }

      waypoints.saved.push(player.room.entityReference);
      player.setMeta('waypoints', waypoints);
      B.sayAt(player, `${player.room.title} сохранено в списке. Используйте '<b>портал дом</b>' для установки домашнего портала.`);
    }
  });

  subcommands.add({
    name: 'дом',
    command: state => (args, player) => {
      if (!player.room.hasBehavior('waypoint')) {
        return B.sayAt(player, 'Вы не у портала.');
      }

      const waypoints = player.getMeta('waypoints');

      if (!waypoints || !waypoints.saved.includes(player.room.entityReference)) {
        return B.sayAt(player, 'Вы не сохранили эту путеводную точку.');
      }

      player.setMeta('waypoints.home', player.room.entityReference);
      B.sayAt(player, `${player.room.title} теперь ваша домашняя путеводная точка.`);
    }
  });

  subcommands.add({
    name: 'переместиться',
    command: state => (args, player) => {
      if (!args || !args.length) {
        return B.sayAt(player, 'Переместиться куда? (портал переместиться #)');
      }

      if (!player.room.hasBehavior('waypoint')) {
        return B.sayAt(player, 'Вы можете перемещаться только между порталами.');
      }

      const waypoints = player.getMeta('waypoints');

      if (!waypoints || !waypoints.saved.length) {
        return B.sayAt(player, 'У вас нет сохраненных путеводных точек.');
      }

      const index = parseInt(args, 10) - 1;
      if (isNaN(index) || !waypoints.saved[index]) {
        return B.sayAt(player, 'Недопустимый портал.');
      }

      const waypoint = waypoints.saved[index];
      const nextRoom = state.RoomManager.getRoom(waypoint);

      B.sayAt(player, '<b><cyan>Вы прикасаетесь к порталу, его руны вспыхивают и вас окутывает голубое сияние.</cyan></b>');
      B.sayAtExcept(player.room, `<b><cyan>${player.name} прикасается к порталу и исчезает в спышке голубого света.</cyan></b>`, [player]);

      player.moveTo(nextRoom, _ => {
        state.CommandManager.get('look').execute('', player);

        B.sayAt(player, '<b><cyan>Голубое сияние угасает и вы обнаруживаете себя у другого портала.</cyan></b>');
        B.sayAtExcept(player.room, `<b><cyan>Руны портала вспыхивают и ${player.name} появляется в спышке голубого света.</cyan></b>`, [player]);
      });
    }
  });

  return {
    usage: 'портал список, сохранить, переместиться #',
    aliases: [ 'портал', 'порталы' ],
    command: state => (args, player) => {
      if (!args || !args.length) {
        args = 'список';
      }

      const [ command, ...commandArgs ] = args.split(' ');
      const subcommand = subcommands.find(command);

      if (!subcommand) {
        return B.sayAt(player, 'Недопустимая команда для портала.');
      }

      subcommand.command(state)(commandArgs.join(' '), player);
    }
  };
};
