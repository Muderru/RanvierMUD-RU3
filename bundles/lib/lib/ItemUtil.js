'use strict';

/**
 * General functions used across the ranvier bundles
 */

const sprintf = require('sprintf-js').sprintf;
const { Broadcast: B, ItemType } = require('ranvier');

const qualityColors = {
  poor: ['bold', 'black'],
  common: ['bold', 'white'],
  uncommon: ['bold', 'green'],
  rare: ['bold', 'blue'],
  epic: ['bold', 'magenta'],
  legendary: ['bold', 'red'],
  artifact: ['bold', 'yellow'],
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
exports.display = function (item, caseword = 'name') {
  switch(caseword) {
    case 'name':
      return qualityColorize(item, `[${item.name}]`);
    case 'rname':
      return qualityColorize(item, `${item.rname}`);
    case 'dname':
      return qualityColorize(item, `${item.dname}`);
    case 'vname':
      return qualityColorize(item, `${item.vname}`);
    case 'tname':
      return qualityColorize(item, `${item.tname}`);
    case 'pname':
      return qualityColorize(item, `${item.pname}`);
    default:
      return qualityColorize(item, `[${item.name}]`);
  }
};

/**
 * Render a pretty display of an item
 * @param {GameState} state
 * @param {Item}      item
 * @param {Player}    player
 */
exports.renderItem = function (state, item, player) {
  let buf = qualityColorize(item, sprintf('%-36s', item.name)) + '\r\n';
  buf += qualityColorize(item, '.' + B.line(38) + '.') + '\r\n';

  const props = item.metadata;

  if (item.type === ItemType.ARMOR) {
    buf += sprintf('| %-36s |\r\n', 'Одежда');
  } else if (item.type === ItemType.WEAPON) {
    buf += sprintf('| %-36s |\r\n', 'Оружие');
  } else if (item.type === ItemType.CONTAINER) {
    buf += sprintf('| %-36s |\r\n', 'Контейнер');
  } else if (item.type === ItemType.SCROLL) {
    buf += sprintf('| %-36s |\r\n', 'Свиток');
  } else if (item.type === ItemType.RESOURCE) {
    buf += sprintf('| %-36s |\r\n', 'Ресурс');
  }

  const requirements = item.metadata.requirements;
  if (requirements) {
    const requiredSkills = item.metadata.requirements.skills;
    if (requiredSkills) {
      for (const requiredSkill of requiredSkills) {
        let skill = state.SkillManager.find(requiredSkill, true);
        buf += sprintf('| %-36s |\r\n', '(' + skill.name + ')');
      }
    }
  }

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
      buf += sprintf('| %-36s |\r\n', item.metadata.slot[0].toUpperCase() + item.metadata.slot.slice(1));
      buf += sprintf('| %-36s |\r\n', `Поместится ${item.maxItems} предметов`);
      break;
    case ItemType.SCROLL:
      let scrollSpell = state.SpellManager.find(item.metadata.spell);
      buf += sprintf('| %-36s |\r\n', `Заклинание '` + scrollSpell.name[0].toUpperCase() + scrollSpell.name.slice(1) + `'.`);
      buf += sprintf('| %-36s |\r\n', `Использует ${scrollSpell.resource.cost} маны.`);
      break;
    case ItemType.RESOURCE:
      buf += sprintf('| %-36s |\r\n', 'Содержит:');
      let materials = '';
      const materialsNumber = item.materials.length - 1;
      for (const material of item.materials) {
        if (material === item.materials[materialsNumber]) {
          materials += ` ${material}`;
        } else {
          materials += ` ${material},`;
        }
      }
      buf += sprintf('| %-36s |\r\n', `${materials}`);
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
               ru_stat = 'к силе';
               break;
            case 'agility':
               ru_stat = 'к ловкости';
               break;
            case 'intellect':
               ru_stat = 'к интеллекту';
               break;
            case 'stamina':
               ru_stat = 'к выносливости';
               break;
            case 'armor':
               ru_stat = 'к броне';
               break;
            case 'critical':
               ru_stat = 'к крит.шансу';
               break;
            case 'cutting_damage':
               ru_stat = 'режущего урона';
               break;
            case 'crushing_damage':
               ru_stat = 'дробящего урона';
               break;
            case 'piercing_damage':
               ru_stat = 'колющего урона';
               break;
            case 'fire_damage':
               ru_stat = 'огненного урона';
               break;
            case 'cold_damage':
               ru_stat = 'урона от холода';
               break;
            case 'lightning_damage':
               ru_stat = 'урона от молнии';
               break;
            case 'earth_damage':
               ru_stat = 'урона землей';
               break;
            case 'acid_damage':
               ru_stat = 'урона кислотой';
               break;
            case 'chaos_damage':
               ru_stat = 'урона хаосом';
               break;
            case 'ether_damage':
               ru_stat = 'урона эфиром';
               break;
            case 'cutting_resistance':
               ru_stat = 'к сопротивлению режущему';
               break;
            case 'crushing_resistance':
               ru_stat = 'к сопротивлению дробящему';
               break;
            case 'piercing_resistance':
               ru_stat = 'к сопротивлению колющему';
               break;
            case 'fire_resistance':
               ru_stat = 'к сопротивлению огню';
               break;
            case 'cold_resistance':
               ru_stat = 'к сопротивлению холоду';
               break;
            case 'lightning_resistance':
               ru_stat = 'к сопротивлению молнии';
               break;
            case 'earth_resistance':
               ru_stat = 'к сопротивлению земле';
               break;
            case 'acid_resistance':
               ru_stat = 'к сопротивлению кислоте';
               break;
            case 'chaos_resistance':
               ru_stat = 'к сопротивлению хаосу';
               break;
            case 'ether_resistance':
               ru_stat = 'к сопротивлению эфиру';
               break;
            case 'light':
               ru_stat = 'к радиусу освещения';
               break;
            case 'invisibility':
               ru_stat = 'к невидимости';
               break;
            case 'detect_invisibility':
               ru_stat = 'к определению невидимости';
               break;
            case 'hide':
               ru_stat = 'к маскировке';
               break;
            case 'detect_hide':
               ru_stat = 'к определению маскировки';
               break;
            case 'freedom':
               ru_stat = 'к свободе движений';
               break;
            case 'health_regeneration':
               ru_stat = 'к регенерации жизни';
               break;
            case 'mana_regeneration':
               ru_stat = 'к регенерации маны';
               break;
            case 'health':
               ru_stat = 'к жизни';
               break;
            case 'mana':
               ru_stat = 'к мане';
               break;
        }
    buf += sprintf(
      '| %-36s |\r\n',
      (value > 0 ? '+' : '') + value + ' '  + ru_stat
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
      buf += B.wrap('<b>Аффект</b>: ' + usable.config.description, 80) + '\r\n';
    }

    if (usable.charges) {
      buf += B.wrap(`${usable.charges} зарядов`, 80) + '\r\n';
    }
  }

  // colorize border according to item quality
  buf = buf.replace(/\|/g, qualityColorize(item, '|'));
  return buf;
};
