'use strict';

const { Broadcast: B } = require('ranvier');

module.exports = {
    aliases: [ 'поднять', 'тренировать' ],
    command : (state) => (args, p) => {
      const attributePoints = p.getMeta('attributePoints');
      if (!args.length) {
        B.sayAt(p, 'Вы можете потренировать силу, ловкость, интеллект и выносливость.');
        B.sayAt(p, 'У вас ' + p.getMeta('attributePoints') + ' очков характеристик.');
        return;
      }

      if (p.getMeta('attributePoints') < 1) {
        return B.sayAt(p, 'Сейчас вы не можете ничего тренировать.');
      }

      if (args === 'сила' || args === 'силу') {
        B.sayAt(p, 'Вы потренировали силу.');
        let strength = p.attributes.get('strength');
        strength.setBase(strength.base + 1);
        p.setMeta('attributePoints', attributePoints - 1);
        return;
      }
      
      if (args === 'ловкость') {
        B.sayAt(p, 'Вы потренировали ловкость.');
        let agility = p.attributes.get('agility');
        agility.setBase(agility.base + 1);
        p.setMeta('attributePoints', attributePoints - 1);
        return;
      }
      
      if (args === 'интеллект') {
        B.sayAt(p, 'Вы потренировали интеллект.');
        let intellect = p.attributes.get('intellect');
        intellect.setBase(intellect.base + 1);
        p.setMeta('attributePoints', attributePoints - 1);
        return;
      }
      
      if (args === 'выносливость') {
        B.sayAt(p, 'Вы потренировали выносливость.');
        let stamina = p.attributes.get('stamina');
        stamina.setBase(stamina.base + 1);
        p.setMeta('attributePoints', attributePoints - 1);
        return;
      }
    }
};
