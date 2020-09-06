const { Logger } = require('ranvier');

function randomType() {
  let types = ['poison', 'glacial', 'hunter', 'executioner'];
  return types[Math.floor(Math.random() * types.length)];
}

exports.bossLabel = function (mob, bossType) {
  let ruType = '';
  switch(bossType) {
    case 'poison':
      if (mob.gender === 'male') {
        ruType = 'ядовитый';
      } else if (mob.gender === 'female') {
        ruType = 'ядовитая';
      } else if (mob.gender === 'plural') {
        ruType = 'ядовитые';
      } else {
        ruType = 'ядовитое';
      }
      break;
    case 'glacial':
      if (mob.gender === 'male') {
        ruType = 'студёный';
      } else if (mob.gender === 'female') {
        ruType = 'студёная';
      } else if (mob.gender === 'plural') {
        ruType = 'студёные';
      } else {
        ruType = 'студёное';
      }
      break;
    case 'hunter':
      if (mob.gender === 'male') {
        ruType = 'охотник';
      } else if (mob.gender === 'female') {
        ruType = 'охотница';
      } else if (mob.gender === 'plural') {
        ruType = 'охотники';
      } else {
        ruType = 'охотник';
      }
      break;
    case 'executioner':
      ruType = 'палач';
      break;
    default:
      if (mob.gender === 'male') {
        ruType = 'одержимый';
      } else if (mob.gender === 'female') {
        ruType = 'одержимая';
      } else if (mob.gender === 'plural') {
        ruType = 'одержимые';
      } else {
        ruType = 'одержимое';
      }
    }
    return ruType;
}

exports.enhance = function (state, mob) {
  const hp = mob.attributes.get('health');
  if (!mob.hasAttribute('mana')) {
    mob.addAttribute(state.AttributeFactory.create('mana', 200));
  }
  const mana = mob.attributes.get('mana');
  const armor = mob.attributes.get('armor');
  const detectInvisibility = mob.attributes.get('detect_invisibility');
  const detectHide = mob.attributes.get('detect_hide');
  const freedom = mob.attributes.get('freedom');
  const healthRegeneration = mob.attributes.get('health_regeneration');
  const manaRegeneration = mob.attributes.get('mana_regeneration');
  if (!mob.getMeta('boss')) {
    mob.setMeta('boss', []);
  }

  if (!mob.hasBehavior('boss')) {
    const capableBehavior = state.MobBehaviorManager.get('boss');
    capableBehavior.attach(mob, true);
  }

  if (!mob.hasBehavior('lootable')) {
    const lootableBehavior = state.MobBehaviorManager.get('lootable');
    lootableBehavior.attach(mob, {});
  }

  const bossType = randomType();
  let add = [];
  add = mob.getMeta('boss');
  if (!add.includes(bossType)) {
    hp.setBase(hp.base * 2);
    mana.setBase(mana.base * 2);
    armor.setBase(armor.base * 2);
    detectInvisibility.setBase((detectInvisibility.base + 1) * 2);
    detectHide.setBase((detectHide.base + 1) * 2);
    freedom.setBase((freedom.base + 1) * 2);
    healthRegeneration.setBase(healthRegeneration.base + 10);
    manaRegeneration.setBase(manaRegeneration.base + 10);
    mob.min_damage = Math.floor(mob.min_damage * 1.2);
    mob.max_damage = Math.floor(mob.max_damage * 1.2);
    add.push(bossType);
    mob.setMeta('boss', add);
  }

  const effectDurationPercent = mob.attributes.get('effect_duration_percent');
  const swift = mob.attributes.get('swift');
  switch(bossType) {
    case 'poison':
      effectDurationPercent.setBase(mob.level);
    break;
    case 'glacial':
      effectDurationPercent.setBase(mob.level);
    break;
    case 'hunter':
      swift.setBase(mob.level);
    break;
  }

  return mob;
};
