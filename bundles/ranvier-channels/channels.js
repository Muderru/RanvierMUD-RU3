'use strict';

module.exports = (srcPath) => {
  const WorldAudience = require(srcPath + 'ChannelAudience/WorldAudience');
  const AreaAudience = require(srcPath + 'ChannelAudience/AreaAudience');
  const RoomAudience = require(srcPath + 'ChannelAudience/RoomAudience');
  const PrivateAudience = require(srcPath + 'ChannelAudience/PrivateAudience');
  const PartyAudience = require(srcPath + 'ChannelAudience/PartyAudience');
  const Channel = require(srcPath + 'Channel');

  return [
    new Channel({
      name: 'оос',
      aliases: ['.'],
      color: ['bold', 'green'],
      description: 'Оправить сообщение всем в игре.',
      audience: new WorldAudience()
    }),

    new Channel({
      name: 'говорить',
      color: ['yellow'],
      description: 'Оправить сообщение всем в комнате.',
      audience: new RoomAudience(),
      formatter: {
        sender: function (sender, target, message, colorify) {
            return colorify(`Вы говорите: '${message}'`);
        },

        target: function (sender, target, message, colorify) {
          if (sender.gender === 'male') {
            return colorify(`${sender.name} говорит: '${message}'`);
          } else if (sender.gender === 'female') {
            return colorify(`${sender.name} говорит: '${message}'`);
          } else if (sender.gender === 'plural') {
            return colorify(`${sender.name} говорят: '${message}'`);
          } else {
            return colorify(`${sender.name} говорит: '${message}'`);
          }
        }
      }
    }),

    new Channel({
      name: 'сказать',
      color: ['bold', 'cyan'],
      description: 'Отправить приватное сообщение другому игроку.',
      audience: new PrivateAudience(),
      formatter: {
        sender: function (sender, target, message, colorify) {
          return colorify(`Вы сказали ${target.dname}: '${message}'`);
        },

        target: function (sender, target, message, colorify) {
          if (sender.gender === 'male') {
            return colorify(`${sender.name} сказал вам: '${message}'`);
          } else if (sender.gender === 'female') {
            return colorify(`${sender.name} сказала вам: '${message}'`);
          } else if (sender.gender === 'plural') {
            return colorify(`${sender.name} сказали вам: '${message}'`);
          } else {
            return colorify(`${sender.name} сказало вам: '${message}'`);
          }            
        }
      }
    }),

    new Channel({
      name: 'кричать',
      aliases: ['орать'],
      color: ['bold', 'red'],
      description: 'Оправить сообщение всем в комнате.',
      audience: new AreaAudience(),
      formatter: {
        sender: function (sender, target, message, colorify) {
          return colorify(`Вы кричите: '${message}'`);
        },

        target: function (sender, target, message, colorify) {
          return colorify(`Кто-то кричит неподалеку: '${message}'`);
        }
      }
    }),

    new Channel({
      name: 'гговорить',
      color: ['bold', 'green'],
      description: 'Оправить сообщение всем членам вашей группы.',
      audience: new PartyAudience(),
      formatter: {
        sender: function (sender, target, message, colorify) {
          return colorify(`Вы говорите группе: '${message}'`);
        },

        target: function (sender, target, message, colorify) {
          if (sender.gender === 'male') {
            return colorify(`${sender.name} говорит группе: '${message}'`);
          } else if (sender.gender === 'female') {
            return colorify(`${sender.name} говорит группе: '${message}'`);
          } else if (sender.gender === 'plural') {
            return colorify(`${sender.name} говорят группе: '${message}'`);
          } else {
            return colorify(`${sender.name} говорит группе: '${message}'`);
          }
        }
      }
    }),
  ];
};
