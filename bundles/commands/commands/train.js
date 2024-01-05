const { Broadcast: B } = require('ranvier');

module.exports = {
  aliases: ['поднять', 'тренировать'],
  command: (state) => (args, p) => {
    const attributePoints = p.getMeta('attributePoints');
    if (!args.length) {
      B.sayAt(p, 'Вы можете потренировать силу, ловкость, интеллект и выносливость.');
      B.sayAt(p, `У вас ${p.getMeta('attributePoints')} очков характеристик.`);
      return;
    }

    if (p.getMeta('attributePoints') < 1) {
      return B.sayAt(p, 'Сейчас вы не можете ничего тренировать.');
    }

    const [arg1, arg2] = args.split(' ');
    let val;
    if (!arg2)
      val = 1;
    else if (+arg2 < 1)
      return B.sayAt(p, "Невозможно потренировать характеристику такое количество раз.");
    else
      val = +arg2;
    if (val > attributePoints)
      return B.sayAt(p, `У вас не хватит очков, чтобы потренировать характеристику ${val} раз.`);

    function getTrainString (attribute, val) {
      let buf;
      if (attribute == "strength")
        buf = "силу";
      else if (attribute == "agility")
        buf = "ловкость";
      else if (attribute == "stamina")
        buf = "выносливость";
      else if (attribute == "intellect")
        buf = "интеллект";

      buf += ` ${val} `;
      const str = `${val}`;
      let num;
      if (str.length > 2)
        num = +`${str[-1]}${str[-2]}`;
      else
        num = +str;
      if (num % 10 <= 1 || num % 10 >= 5 || (num > 11 && num < 15))
        buf += "раз";
      else
        buf += "раза";
      return buf;
    }

    let attribute;
    if (arg1 === 'сила' || arg1 === 'силу')
      attribute = "strength";
      else if (arg1 === 'ловкость')
      attribute = "agility";
    else if (arg1 === 'интеллект')
      attribute = "intellect";
    else if (arg1 === 'выносливость')
attribute = "stamina";
    else
      return B.sayAt(p, 'Вы можете потренировать силу, ловкость, интеллект и выносливость.');

    B.sayAt(p, `Вы потренировали ${getTrainString(attribute, val)}.`);
    const stat = p.attributes.get(attribute);
    stat.setBase(stat.base + val);
    p.setMeta('attributePoints', attributePoints - val);
    return;
  },
};
