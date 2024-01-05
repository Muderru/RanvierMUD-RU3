const { sprintf } = require('sprintf-js');
const { Broadcast: B } = require('ranvier');
const Combat = require('../../combat/lib/Combat');

module.exports = {
  aliases: ['очки', 'характеристики', 'счет', 'счёт'],
  command: (state) => (args, p) => {
    const say = (message) => B.sayAt(p, message);

    say(`Вы ${p.name}, ${p.playerClass.config.name} ${p.level} уровня.`);

    const stats = {
      strength: 0,
      agility: 0,
      intellect: 0,
      stamina: 0,
      armor: 0,
      health: 0,
      critical: 0,
      cutting_resistance: 0,
      crushing_resistance: 0,
      piercing_resistance: 0,
      fire_resistance: 0,
      cold_resistance: 0,
      lightning_resistance: 0,
      earth_resistance: 0,
      acid_resistance: 0,
      chaos_resistance: 0,
      ether_resistance: 0,
      cutting_damage: 0,
      crushing_damage: 0,
      piercing_damage: 0,
      fire_damage: 0,
      cold_damage: 0,
      lightning_damage: 0,
      earth_damage: 0,
      acid_damage: 0,
      chaos_damage: 0,
      ether_damage: 0,
      invisibility: 0,
      detect_invisibility: 0,
      hide: 0,
      detect_hide: 0,
      freedom: 0,
      light: 0,
      health_regeneration: 0,
      mana_regeneration: 0,
    };

    for (const stat in stats) {
      stats[stat] = {
        current: p.getAttribute(stat) || 0,
        base: p.getBaseAttribute(stat) || 0,
        max: p.getMaxAttribute(stat) || 0,
      };
    }
    stats["mana"] = {
      current: p.getAttribute('mana'),
      max: p.getMaxAttribute('mana'),
    };

    say(`Здоровье: ${stats.health.current}/${stats.health.max}, мана: ${stats.mana.current}/${stats.mana.max}.`);

    const weaponDamage = Combat.getWeaponDamage(p);
    const min = Combat.normalizeWeaponDamage(p, weaponDamage.min);
    const max = Combat.normalizeWeaponDamage(p, weaponDamage.max);
    say(`Урон: ${min}-${max}, скорость: ${Combat.getWeaponSpeed(p)} сек.`);

    function getStatString (stat) {
      const val = stats[stat];
      const statColor = (val.current > val.base ? 'green' : 'white');
      let ruStat = '';
      switch (stat) {
        case 'strength':
          ruStat = 'Сила';
          break;
        case 'agility':
          ruStat = 'Ловкость';
          break;
        case 'intellect':
          ruStat = 'Интеллект';
          break;
        case 'stamina':
          ruStat = 'Выносливость';
          break;
        case 'armor':
          ruStat = 'Броня';
          break;
        case 'critical':
          ruStat = 'шанс крит.удара';
          break;
        case 'cutting_resistance':
          ruStat = 'Режущего';
          break;
        case 'crushing_resistance':
          ruStat = 'Дробящего';
          break;
        case 'piercing_resistance':
          ruStat = 'Колющего';
          break;
        case 'fire_resistance':
          ruStat = 'Огня';
          break;
        case 'cold_resistance':
          ruStat = 'Холода';
          break;
        case 'lightning_resistance':
          ruStat = 'Молний';
          break;
        case 'earth_resistance':
          ruStat = 'Земли';
          break;
        case 'acid_resistance':
          ruStat = 'Кислоты';
          break;
        case 'chaos_resistance':
          ruStat = 'Хаоса';
          break;
        case 'ether_resistance':
          ruStat = 'Эфира';
          break;
        case 'cutting_damage':
          ruStat = 'Режущим';
          break;
        case 'crushing_damage':
          ruStat = 'Дробящим';
          break;
        case 'piercing_damage':
          ruStat = 'Колющим';
          break;
        case 'fire_damage':
          ruStat = 'Огнем';
          break;
        case 'cold_damage':
          ruStat = 'Холодом';
          break;
        case 'lightning_damage':
          ruStat = 'Молниями';
          break;
        case 'earth_damage':
          ruStat = 'Землей';
          break;
        case 'acid_damage':
          ruStat = 'Кислотой';
          break;
        case 'chaos_damage':
          ruStat = 'Хаосом';
          break;
        case 'ether_damage':
          ruStat = 'Эфиром';
          break;
        case 'invisibility':
          ruStat = 'Невидимость';
          break;
        case 'detect_invisibility':
          ruStat = 'Видеть невидимое';
          break;
        case 'hide':
          ruStat = 'Маскировка';
          break;
        case 'detect_hide':
          ruStat = 'Видеть маскировку';
          break;
        case 'freedom':
          ruStat = 'Свобода движений';
          break;
        case 'health_regeneration':
          ruStat = 'Регенерация жизни';
          break;
        case 'mana_regeneration':
          ruStat = 'Регенерация маны';
          break;
        case 'light':
          ruStat = 'Радиус освещения';
          break;
      }
      const str = sprintf(
        `%s: <b><${statColor}>%s</${statColor}></b>`,
        ruStat, val.current,
      );

      return str;
    };

    say("Основные характеристики:");
    say(`${getStatString("strength")}, ${getStatString("agility")}, ${getStatString("stamina")}, ${getStatString("intellect")}.`);;
    say(`${getStatString('armor')}, ${getStatString('critical')}%.`);

    say("Бонус к урону:");
    say(`${getStatString('cutting_damage')}, ${getStatString('crushing_damage')}, ${getStatString('piercing_damage')}, ${getStatString('fire_damage')}, ${getStatString('cold_damage')}, ${getStatString('lightning_damage')}, ${getStatString('earth_damage')}, ${getStatString('acid_damage')}, ${getStatString('chaos_damage')}, ${getStatString('ether_damage')}.`);
    say("Бонус к защите от:");
    say(`${getStatString('cutting_resistance')}, ${getStatString('crushing_resistance')}, ${getStatString('piercing_resistance')}, ${getStatString('fire_resistance')}, ${getStatString('cold_resistance')}, ${getStatString('lightning_resistance')}, ${getStatString('earth_resistance')}, ${getStatString('acid_resistance')}, ${getStatString('chaos_resistance')}, ${getStatString('ether_resistance')}.`);

    say("Дополнительные атрибуты:");
    say(`${getStatString('invisibility')}, ${getStatString('detect_invisibility')}.`);
    say(`${getStatString('hide')}, ${getStatString('detect_hide')}.`);
    say(`${getStatString('health_regeneration')}, ${getStatString('mana_regeneration')}.`);
    say(`${getStatString('light')}, ${getStatString('freedom')}.`);

    function getPointString (pointType) {
      const val = p.getMeta(pointType);
      let ruType;
      if (pointType == "attributePoints") 
        ruType = "характеристик";
      else if (pointType == "magicPoints")
        ruType = "заклинаний";
      else if (pointType == "skillPoints")
        ruType = "умений";
      let buf = `${val} `;
      const str = `${val}`;
      let num;
      if (str.length > 2) {
        let tmp = `${str[(str.length - 2)]}${str[(str.length - 1)]}`;
        if (tmp[0] == '0')
          num = +tmp[1];
        else
          num = +tmp;
      }
      else
        num = +str;
      if (num != 11 && num % 10 == 1)
        buf += "очко";
      else if (num > 10 && num < 20)
        buf += "очков";
      else if (num % 10 == 0 || num % 10 >= 5)
        buf += "очков";
      else if (num % 10 <= 4)
        buf += "очка";
      return (buf + ` ${ruType}`);
    }
    say(`Вы можете распределить ${getPointString('attributePoints')}, ${getPointString('magicPoints')} и ${getPointString('skillPoints')}.`);
    const gold = p.getMeta('currencies.золото');
    if (gold > 0)
      say(`У вас имеется ${gold} золота.`);
  },
};