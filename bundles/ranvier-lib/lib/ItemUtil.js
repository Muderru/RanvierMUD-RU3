'use strict';

/**
 * General functions used across the ranvier bundles
 */

const srcPath = '../../../src/'

const sprintf = require('sprintf-js').sprintf;
const ItemType = require(srcPath + 'ItemType');
const B = require(srcPath + 'Broadcast');

const qualityColors = {
  poor: ['bold', 'black'],
  common: ['bold', 'white'],
  uncommon: ['bold', 'green'],
  rare: ['bold', 'blue'],
  epic: ['bold', 'magenta'],
  legendary: ['bold', 'red'],
  artifact: ['yellow'],
};
exports.qualityColors = qualityColors;

/**
 * Colorize the given string according to this item's quality
 * @param {Item} item
 * @param {string} string
 * @return string
 */
function qualityColorize(item, string) {
  const colors = qualityColors[item.metadata.quality || 'common'];
  const open = '<' + colors.join('><') + '>';
  const close = '</' + colors.reverse().join('></') + '>';
  return open + string + close;
}
exports.qualityColorize = qualityColorize;

/**
 * Friendly display colorized by quality
 */
exports.display = function (item) {
  return qualityColorize(item, `[${item.name}]`);
};

/**
 * Render a pretty display of an item
 * @param {GameState} state
 * @param {Item}      item
 * @param {Player}    player
 */
exports.renderItem = function (state, item, player) {
  let buf = qualityColorize(item, '.' + B.line(38) + '.') + '\r\n';
  buf += '| ' + qualityColorize(item, sprintf('%-36s', item.name)) + ' |\r\n';

  const props = item.metadata;

  buf += sprintf('| %-36s |\r\n', item.type === ItemType.ARMOR ? 'Доспех' : 'Оружие');

  switch (item.type) {
    case ItemType.WEAPON:
      buf += sprintf('| %-18s%18s |\r\n', `Урон ${props.minDamage} - ${props.maxDamage}`, `скорость ${props.speed}`);
      const dps = ((props.minDamage + props.maxDamage) / 2) / props.speed;
      buf += sprintf('| %-36s |\r\n', `(${dps.toPrecision(2)} урона в секунду)`);
      break;
    case ItemType.ARMOR:
      buf += sprintf('| %-36s |\r\n', item.metadata.slot[0].toUpperCase() + item.metadata.slot.slice(1));
      break;
    case ItemType.CONTAINER:
      buf += sprintf('| %-36s |\r\n', `Содержится ${item.maxItems} предметов`);
      break;
  }

  // copy stats to make sure we don't accidentally modify it
  const stats = Object.assign({}, props.stats);

  // always show armor first
  if (stats.armor) {
    buf += sprintf('| %-36s |\r\n', `${stats.armor} брони`);
    delete stats.armor;
  }

  // non-armor stats
  for (const stat in stats) {
    const value = stats[stat];
    let ru_stat = '';
        switch(stat) {
            case 'strength':
               ru_stat = 'к силе'
               break;
            case 'agility':
               ru_stat = 'к ловкости'
               break;
            case 'intellect':
               ru_stat = 'к интеллекту'
               break;
            case 'stamina':
               ru_stat = 'к выносливости'
               break;
            case 'armor':
               ru_stat = 'к броне'
               break;
            case 'critical':
               ru_stat = 'к крит.шансу'
               break;
            case 'cutting_damage':
               ru_stat = 'режущего урона'
               break;
            case 'crushing_damage':
               ru_stat = 'дробящего урона'
               break;
            case 'piercing_damage':
               ru_stat = 'колющего урона'
               break;
            case 'fire_damage':
               ru_stat = 'огненного урона'
               break;
            case 'cold_damage':
               ru_stat = 'урона от холода'
               break;
            case 'lightning_damage':
               ru_stat = 'урона от молнии'
               break;
            case 'earth_damage':
               ru_stat = 'урона землей'
               break;
            case 'acid_damage':
               ru_stat = 'урона кислотой'
               break;               
            case 'chaos_damage':
               ru_stat = 'урона хаосом'
               break;
            case 'ether_damage':
               ru_stat = 'урона эфиром'
               break;
            case 'cutting_resistance':
               ru_stat = 'к сопротивлению режущему'
               break;
            case 'crushing_resistance':
               ru_stat = 'к сопротивлению дробящему'
               break;
            case 'piercing_resistance':
               ru_stat = 'к сопротивлению колющему'
               break;
            case 'fire_resistance':
               ru_stat = 'к сопротивлению огню'
               break;
            case 'cold_resistance':
               ru_stat = 'к сопротивлению холоду'
               break;
            case 'lightning_resistance':
               ru_stat = 'к сопротивлению молнии'
               break;
            case 'earth_resistance':
               ru_stat = 'к сопротивлению земле'
               break;
            case 'acid_resistance':
               ru_stat = 'к сопротивлению кислоте'
               break;               
            case 'chaos_resistance':
               ru_stat = 'к сопротивлению хаосу'
               break;
            case 'ether_resistance':
               ru_stat = 'к сопротивлению эфиру'
               break;               
        }
    buf += sprintf(
      '| %-36s |\r\n',
      (value > 0 ? '+' : '') + value + ' ' + ru_stat
    );
  }

  // custom special effect rendering
  if (props.specialEffects) {
    props.specialEffects.forEach(effectText => {
      const text = B.wrap(effectText, 36).split(/\r\n/g);
      text.forEach(textLine => {
        buf += sprintf('| <b><green>%-36s</green></b> |\r\n', textLine);
      });
    });
  }

  if (props.level) {
    const cantUse = props.level > player.level ? '<red>%-36s</red>' : '%-36s';
    buf += sprintf(`| ${cantUse} |\r\n`, 'Требуется уровень ' + props.level);
  }
  buf += qualityColorize(item, "'" + B.line(38) + "'") + '\r\n';

  // On use
  const usable = item.getBehavior('usable');
  if (usable) {
    if (usable.spell) {
      const useSpell = state.SpellManager.get(usable.spell);
      if (useSpell) {
        useSpell.options = usable.options;
        buf += B.wrap('<b>При использовании</b>: ' + useSpell.info(player), 80) + '\r\n';
      }
    }

    if (usable.effect && usable.config.description) {
      buf += B.wrap('<b>Effect</b>: ' + usable.config.description, 80) + '\r\n';
    }

    if (usable.charges) {
      buf += B.wrap(`${usable.charges} зарядов`, 80) + '\r\n';
    }
  }

  // colorize border according to item quality
  buf = buf.replace(/\|/g, qualityColorize(item, '|'));
  return buf;
};
