'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');

  return  {
    listeners: {
      playerEnter: state => function (player) {
        Broadcast.sayAt(player);
        Broadcast.sayAt(player, `<b><cyan>Подсказка: Порталы позволяют путешествовать на отдаленные расстояния. Сохраняйте путевые точки командой '<white>портал сохранить</white>', установите дом командой '<white>портал дом</white>. Если у вас достаточно энергии, то вы можете вернуться домой командой '<white>возврат</white>'.</cyan></b>`, 80);
      }
    }
  };
};
