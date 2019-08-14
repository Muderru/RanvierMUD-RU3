'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    playerEnter: state => function (player) {
      Broadcast.sayAt(player);
      Broadcast.sayAt(player, `<b><cyan>Подсказка: Вы можете подбирать вещи в комнате, увиденные командой '<white>смотреть</white>' с помощью команды '<white>взять</white>' с указанием нужного предмета, например: '<white>взять сыр</white>'. Некоторые объекты, например сундуки, могут также содержать предметы; узнать о них вы можете осмотрев объект.</cyan></b>`, 80);
    }
  }
};
