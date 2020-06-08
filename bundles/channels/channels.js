'use strict';

const {
  AreaAudience,
  PartyAudience,
  PrivateAudience,
  RoomAudience,
  WorldAudience,
} = require('ranvier');

const { Channel } = require('ranvier').Channel;

module.exports = [
  new Channel({
    name: 'оос',
    aliases: ['.'],
    color: ['bold', 'green'],
    description: 'Оправить сообщение всем в игре.',
    audience: new WorldAudience()
  }),

  new Channel({
    name: 'say',
    aliases: ['говорить'],
    color: ['bold', 'green'],
    description: 'Оправить сообщение всем в комнате.',
    audience: new RoomAudience(),
    formatter: {
      sender: function (sender, target, message, colorify) {
        return colorify(`Вы говорите: '${message}'`);
      },

      target: function (sender, target, message, colorify) {
        if (sender.gender === 'male') {
            return colorify(`${sender.Name} говорит: '${message}'`);
        } else if (sender.gender === 'female') {
            return colorify(`${sender.Name} говорит: '${message}'`);
        } else if (sender.gender === 'plural') {
            return colorify(`${sender.Name} говорят: '${message}'`);
        } else {
            return colorify(`${sender.Name} говорит: '${message}'`);
        }
      }
    }
  }),

  new Channel({
    name: 'tell',
    aliases: ['сказать'],
    color: ['bold', 'cyan'],
    description: 'Отправить приватное сообщение другому игроку.',
    audience: new PrivateAudience(),
    formatter: {
      sender: function (sender, target, message, colorify) {
        return colorify(`Вы сказали ${target.dname}: '${message}'`);
      },

      target: function (sender, target, message, colorify) {
        target.setMeta('interlocutor', sender.name);
        if (sender.gender === 'male') {
            return colorify(`${sender.Name} сказал вам: '${message}'`);
        } else if (sender.gender === 'female') {
            return colorify(`${sender.Name} сказала вам: '${message}'`);
        } else if (sender.gender === 'plural') {
            return colorify(`${sender.Name} сказали вам: '${message}'`);
        } else {
            return colorify(`${sender.Name} сказало вам: '${message}'`);
        }
      }
    }
  }),

  new Channel({
    name: 'yell',
    aliases: ['кричать', 'орать'],
    color: ['bold', 'red'],
    description: 'Оправить сообщение всем в области.',
    audience: new AreaAudience(),
    formatter: {
      sender: function (sender, target, message, colorify) {
        return colorify(`Вы кричите: '${message}'`);
      },

      target: function (sender, target, message, colorify) {
        if (sender.gender === 'male') {
            return colorify(`${sender.Name} кричит: '${message}'`);
        } else if (sender.gender === 'female') {
            return colorify(`${sender.Name} кричит: '${message}'`);
        } else if (sender.gender === 'plural') {
            return colorify(`${sender.Name} кричат: '${message}'`);
        } else {
            return colorify(`${sender.Name} кричит: '${message}'`);
        }
      }
    }
  }),

  new Channel({
    name: 'gtell',
    aliases: ['гговорить', 'гг'],
    color: ['bold', 'green'],
    description: 'Оправить сообщение всем членам вашей группы.',
    audience: new PartyAudience(),
    formatter: {
      sender: function (sender, target, message, colorify) {
        return colorify(`Вы говорите группе: '${message}'`);
      },

      target: function (sender, target, message, colorify) {
        if (sender.gender === 'male') {
            return colorify(`${sender.Name} говорит группе: '${message}'`);
        } else if (sender.gender === 'female') {
            return colorify(`${sender.Name} говорит группе: '${message}'`);
        } else if (sender.gender === 'plural') {
            return colorify(`${sender.Name} говорят группе: '${message}'`);
        } else {
            return colorify(`${sender.Name} говорит группе: '${message}'`);
        }
      }
    }
  }),
];
