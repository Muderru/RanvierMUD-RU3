const { sprintf } = require('sprintf-js');
const { Broadcast: B } = require('ranvier');
const Combat = require('../../combat/lib/Combat');

module.exports = {
  aliases: ['очки', 'характеристики', 'счет', 'счёт'],
  command: (state) => (args, p) => {
    const say = (message) => B.sayAt(p, message);

    say(`<b>${B.center(70, `${p.name}, уровень ${p.level} ${p.playerClass.config.name}`, 'green')}`);
    say(`<b>${B.line(70, '-', 'green')}`);

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

    B.at(p, sprintf(' %-9s: %12s', 'Здоровье', `${stats.health.current}/${stats.health.max}`));
    say(`<b><green>${sprintf(
      '%36s',
      'Оружие ',
    )}`);

    // class resource
    const mana = {
      current: p.getAttribute('mana'),
      max: p.getMaxAttribute('mana'),
    };
    B.at(p, sprintf(' %-9s: %12s', 'Мана', `${mana.current}/${mana.max}`));

    say(`${sprintf('%35s', `.${B.line(22)}`)}.`);

    B.at(p, sprintf('%37s', '|'));
    const weaponDamage = Combat.getWeaponDamage(p);
    const min = Combat.normalizeWeaponDamage(p, weaponDamage.min);
    const max = Combat.normalizeWeaponDamage(p, weaponDamage.max);
    say(sprintf(' %6s:<b>%5s</b> - <b>%-5s</b> |', 'Урон', min, max));
    B.at(p, sprintf('%37s', '|'));
    say(sprintf(' %6s: <b>%12s</b> |', 'Скор.', B.center(12, `${Combat.getWeaponSpeed(p)} сек`)));

    say(sprintf('%60s', `'${B.line(22)}'`));

    say(`<b><green>${sprintf(
      '%-24s',
      ' Характеристики',
    )}</green></b>`);
    say(`.${B.line(33)}.`);

    const printStat = (stat, newline = true) => {
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
          ruStat = 'Крит.шанс';
          break;
        case 'cutting_resistance':
          ruStat = 'Режущее';
          break;
        case 'crushing_resistance':
          ruStat = 'Дробящее';
          break;
        case 'piercing_resistance':
          ruStat = 'Колющее';
          break;
        case 'fire_resistance':
          ruStat = 'Огонь';
          break;
        case 'cold_resistance':
          ruStat = 'Холод';
          break;
        case 'lightning_resistance':
          ruStat = 'Молния';
          break;
        case 'earth_resistance':
          ruStat = 'Земля';
          break;
        case 'acid_resistance':
          ruStat = 'Кислота';
          break;
        case 'chaos_resistance':
          ruStat = 'Хаос';
          break;
        case 'ether_resistance':
          ruStat = 'Эфир';
          break;
        case 'cutting_damage':
          ruStat = 'Режущий';
          break;
        case 'crushing_damage':
          ruStat = 'Дробящий';
          break;
        case 'piercing_damage':
          ruStat = 'Колющий';
          break;
        case 'fire_damage':
          ruStat = 'Огонь';
          break;
        case 'cold_damage':
          ruStat = 'Холод';
          break;
        case 'lightning_damage':
          ruStat = 'Молния';
          break;
        case 'earth_damage':
          ruStat = 'Земля';
          break;
        case 'acid_damage':
          ruStat = 'Кислота';
          break;
        case 'chaos_damage':
          ruStat = 'Хаос';
          break;
        case 'ether_damage':
          ruStat = 'Эфир';
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
        `| %-20s : <b><${statColor}>%8s</${statColor}></b> |`,
        ruStat,
        val.current,
      );

      if (newline) {
        say(str);
      } else {
        B.at(p, str);
      }
    };

    printStat('strength', false); // left
    say(`<b><green>${sprintf('%33s', 'Золото ')}`); // right
    printStat('agility', false); // left
    say(sprintf('%33s', `.${B.line(12)}.`)); // right
    printStat('intellect', false); // left
    say(sprintf('%19s| <b>%10s</b> |', '', p.getMeta('currencies.золото') || 0)); // right
    printStat('stamina', false); // left
    say(sprintf('%33s', `'${B.line(12)}'`)); // right

    say(`:${B.line(33)}:`);
    printStat('armor');
    printStat('critical');
    say(`'${B.line(33)}'`);
    say(`<b><green>${sprintf(
      '%-24s',
      ' Доп. урон                           Сопротивления',
    )}</green></b>`);
    say(`.${B.line(68)}.`);
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
    printStat('invisibility', false);
    printStat('detect_invisibility');
    printStat('hide', false);
    printStat('detect_hide');
    printStat('health_regeneration', false);
    printStat('mana_regeneration');
    printStat('light', false);
    printStat('freedom');
    say(`.${B.line(68)}.`);

    B.at(p, sprintf(' %-9s: %2s', '<b><green>Очки характеристик', `</green></b>${p.getMeta('attributePoints')}`));
    B.at(p, sprintf(' %-9s: %2s', '<b><green>    Очки магии', `</green></b>${p.getMeta('magicPoints')}`));
    B.at(p, sprintf(' %-9s: %2s', '<b><green>    Очки умений', `</green></b>${p.getMeta('skillPoints')}`));
  },
};
