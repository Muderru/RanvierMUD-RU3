'use strict';

const sprintf = require('sprintf-js').sprintf;
const { Broadcast: B } = require('ranvier');
const Combat = require('../../bundle-combat/lib/Combat');

module.exports = {
  aliases: [ 'очки', 'характеристики', 'счет' ],
  command : (state) => (args, p) => {
    const say = message => B.sayAt(p, message);

    say('<b>' + B.center(60, `${p.name}, уровень ${p.level} ${p.playerClass.config.name}`, 'green'));
    say('<b>' + B.line(60, '-', 'green'));

    let stats = {
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
    };

    for (const stat in stats) {
      stats[stat] = {
        current: p.getAttribute(stat) || 0,
        base: p.getBaseAttribute(stat) || 0,
        max: p.getMaxAttribute(stat) || 0,
      };
    }

    B.at(p, sprintf(' %-9s: %12s', 'Здоровье', `${stats.health.current}/${stats.health.max}`));
    say('<b><green>' + sprintf(
      '%36s',
      'Оружие '
    ));

    // class resource
    const mana = {
      current: p.getAttribute('mana'),
      max: p.getMaxAttribute('mana')
    };
    B.at(p, sprintf(' %-9s: %12s', 'Мана', `${mana.current}/${mana.max}`));

    say(sprintf('%35s', '.' + B.line(22)) + '.');

    B.at(p, sprintf('%37s', '|'));
    const weaponDamage = Combat.getWeaponDamage(p);
    const min = Combat.normalizeWeaponDamage(p, weaponDamage.min);
    const max = Combat.normalizeWeaponDamage(p, weaponDamage.max);
    say(sprintf(' %6s:<b>%5s</b> - <b>%-5s</b> |', 'Урон', min, max));
    B.at(p, sprintf('%37s', '|'));
    say(sprintf(' %6s: <b>%12s</b> |', 'Скор.', B.center(12, Combat.getWeaponSpeed(p) + ' сек')));

    say(sprintf('%60s', "'" + B.line(22) + "'"));

    say('<b><green>' + sprintf(
      '%-24s',
      ' Характеристики'
    ) + '</green></b>');
    say('.' + B.line(25) + '.');


    const printStat = (stat, newline = true) => {
      const val = stats[stat];
      const statColor = (val.current > val.base ? 'green' : 'white');
      let ru_stat = '';
      switch(stat) {
          case 'strength':
             ru_stat = 'Сила'
             break;
          case 'agility':
             ru_stat = 'Ловкость'
             break;
          case 'intellect':
             ru_stat = 'Интеллект'
             break;
          case 'stamina':
             ru_stat = 'Выносливость'
             break;
          case 'armor':
             ru_stat = 'Броня'
             break;
          case 'critical':
             ru_stat = 'Крит.шанс'
             break;
          case 'cutting_resistance':
             ru_stat = 'Режущее'
             break;
          case 'crushing_resistance':
             ru_stat = 'Дробящее'
             break;
          case 'piercing_resistance':
             ru_stat = 'Колющее'
             break;
          case 'fire_resistance':
             ru_stat = 'Огонь'
             break;
          case 'cold_resistance':
             ru_stat = 'Холод'
             break;
          case 'lightning_resistance':
             ru_stat = 'Молния'
             break;
          case 'earth_resistance':
             ru_stat = 'Земля'
             break;
          case 'acid_resistance':
             ru_stat = 'Кислота'
             break;               
          case 'chaos_resistance':
             ru_stat = 'Хаос'
             break;
          case 'ether_resistance':
             ru_stat = 'Эфир'
             break;
          case 'cutting_damage':
             ru_stat = 'Режущий'
             break;
          case 'crushing_damage':
             ru_stat = 'Дробящий'
             break;
          case 'piercing_damage':
             ru_stat = 'Колющий'
             break;
          case 'fire_damage':
             ru_stat = 'Огонь'
             break;
          case 'cold_damage':
             ru_stat = 'Холод'
             break;
          case 'lightning_damage':
             ru_stat = 'Молния'
             break;
          case 'earth_damage':
             ru_stat = 'Земля'
             break;
          case 'acid_damage':
             ru_stat = 'Кислота'
             break;               
          case 'chaos_damage':
             ru_stat = 'Хаос'
             break;
          case 'ether_damage':
             ru_stat = 'Эфир'
             break;               
        }
        const str = sprintf(
          `| %-12s : <b><${statColor}>%8s</${statColor}></b> |`,
          ru_stat,
          val.current
        );

      if (newline) {
        say(str);
      } else {
        B.at(p, str);
      }
    };

    printStat('strength', false); // left
    say('<b><green>' + sprintf('%33s', 'Золото ')); // right
    printStat('agility', false); // left
    say(sprintf('%33s', '.' + B.line(12) + '.')); // right
    printStat('intellect', false); // left
    say(sprintf('%19s| <b>%10s</b> |', '', p.getMeta('currencies.золото') || 0)); // right
    printStat('stamina', false); // left
    say(sprintf('%33s', "'" + B.line(12) + "'")); // right

    say(':' + B.line(25) + ':');
    printStat('armor');
    printStat('critical');
    say("'" + B.line(25) + "'");
    say('<b><green>' + sprintf(
      '%-24s',
      ' Доп. урон                   Сопротивления'
    ) + '</green></b>');
    say('.' + B.line(52) + '.');      
    printStat('cutting_damage', false);
    printStat('cutting_resistance');
    printStat('crushing_damage', false);
    printStat('crushing_resistance');
    printStat('piercing_damage', false);
    printStat('piercing_resistance');
    printStat('fire_damage', false);
    printStat('fire_resistance');
    printStat('cold_damage', false);
    printStat('cold_resistance');
    printStat('lightning_damage', false);
    printStat('lightning_resistance');
    printStat('earth_damage', false);
    printStat('earth_resistance');
    printStat('acid_damage', false);
    printStat('acid_resistance');
    printStat('chaos_damage', false);
    printStat('chaos_resistance');
    printStat('ether_damage', false);
    printStat('ether_resistance');
    say('.' + B.line(52) + '.');
    
    B.at(p, sprintf(' %-9s: %2s', '<b><green>Очки характеристик', `</green></b>${p.getMeta('attributePoints')}`));
    B.at(p, sprintf(' %-9s: %2s', '<b><green>Очки магии', `</green></b>${p.getMeta('magicPoints')}`));
    B.at(p, sprintf(' %-9s: %2s', '<b><green>Очки умений', `</green></b>${p.getMeta('skillPoints')}`));
  }
};
