'use strict';

const { ItemType } = require('ranvier');

function randomStat() {
  let stats = [ 'strength', 'agility', 'intellect', 'stamina', 'armor', 'health', 'critical',
                'cutting_resistance', 'crushing_resistance', 'piercing_resistance',
                'fire_resistance', 'cold_resistance', 'lightning_resistance', 'earth_resistance',
                'acid_resistance', 'chaos_resistance', 'ether_resistance', 'cutting_damage',
                'crushing_damage', 'piercing_damage', 'fire_damage', 'cold_damage',
                'lightning_damage', 'earth_damage', 'acid_damage', 'chaos_damage',
                'ether_damage', 'invisibility', 'detect_invisibility', 'hide', 'detect_hide',
                'freedom', 'light', 'health_regeneration', 'mana_regeneration', 'mana' ];
  return stats[Math.floor(Math.random() * stats.length)];
}

function randomStatValue(item, stat) {
  let value = 0;
  if (!item.metadata.itemLevel) {
    return 0;
  }

  let max = 1;
  if (item.type === ItemType.WEAPON) {
    max = item.getMeta('itemLevel') / 2;
  } else {
    max = item.getMeta('itemLevel') / 5;
  }
  Math.round(max);

  switch(stat) {
    case 'health':
      value = Math.floor(10*(Math.random() * max + 1));
      break;
    case 'mana':
      value = Math.floor(10*(Math.random() * max + 1));
      break;
    case 'strength':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'agility':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'intellect':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'stamina':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'armor':
      value = Math.floor(5 * (Math.random() * max + 1));
      break;
    case 'critical':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'cutting_resistance':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'crushing_resistance':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'piercing_resistance':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'fire_resistance':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'cold_resistance':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'lightning_resistance':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'earth_resistance':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'acid_resistance':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'chaos_resistance':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'ether_resistance':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'cutting_damage':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'crushing_damage':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'piercing_damage':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'fire_damage':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'cold_damage':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'lightning_damage':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'earth_damage':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'acid_damage':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'chaos_damage':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'ether_damage':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'invisibility':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'detect_invisibility':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'hide':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'detect_hide':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'freedom':
      value = Math.floor(Math.random() * max + 1);
      break;
    case 'health_regeneration':
      value = Math.floor(2.5 * (Math.random() * max + 1));
      break;
    case 'mana_regeneration':
      value = Math.floor(2.5 * (Math.random() * max + 1));
      break;
    case 'light':
      value = Math.floor(Math.random() * max + 1);
      break;
    default:
      value = Math.floor(Math.random() * max + 1);
    }
    return value;
}

function randomStatPrefix(item, stat) {
  let prefix = [];
  switch(stat) {
    case 'health':
      if (item.gender === 'male') {
        prefix = [ 'здоровый', 'здорового', 'здоровому', 'здоровый', 'здоровым', 'здоровом' ];
      } else if (item.gender === 'female') {
        prefix = [ 'здоровая', 'здоровой', 'здоровой', 'здоровую', 'здоровой', 'здоровой' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'здоровые', 'здоровых', 'здоровым', 'здоровые', 'здоровыми', 'здоровых', ];
      } else {
        prefix = [ 'здоровое', 'здорового', 'здоровому', 'здоровое', 'здоровым', 'здоровом' ];
      }
      break;
    case 'mana':
      if (item.gender === 'male') {
        prefix = [ 'зачарованный', 'зачарованного', 'зачарованному', 'зачарованный', 'зачарованным', 'зачарованном' ];
      } else if (item.gender === 'female') {
        prefix = [ 'зачарованная', 'зачарованной', 'зачарованной', 'зачарованную', 'зачарованной', 'зачарованной' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'зачарованные', 'зачарованных', 'зачарованным', 'зачарованные', 'зачарованными', 'зачарованных' ];
      } else {
        prefix = [ 'зачарованное', 'зачарованного', 'зачарованному', 'зачарованное', 'зачарованным', 'зачарованном' ];
      }
      break;
    case 'strength':
      if (item.gender === 'male') {
        prefix = [ 'усиленный', 'усиленного', 'усиленному', 'усиленный', 'усиленным', 'усиленном' ];
      } else if (item.gender === 'female') {
        prefix = [ 'усиленная', 'усиленной', 'усиленной', 'усиленную', 'усиленной', 'усиленной' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'усиленные', 'усиленных', 'усиленным', 'усиленные', 'усиленными', 'усиленных', ];
      } else {
        prefix = [ 'усиленное', 'усиленного', 'усиленному', 'усиленное', 'усиленным', 'усиленном' ];
      }
      break;
    case 'agility':
      if (item.gender === 'male') {
        prefix = [ 'удобный', 'удобного', 'удобному', 'удобный', 'удобным', 'удобном' ];
      } else if (item.gender === 'female') {
        prefix = [ 'удобная', 'удобной', 'удобной', 'удобную', 'удобной', 'удобной' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'удобные', 'удобных', 'удобным', 'удобные', 'удобными', 'удобных' ];
      } else {
        prefix = [ 'удобное', 'удобного', 'удобному', 'удобное', 'удобным', 'удобном' ];
      }
      break;
    case 'intellect':
      if (item.gender === 'male') {
        prefix = [ 'рунный', 'рунного', 'рунному', 'рунный', 'рунным', 'рунном' ];
      } else if (item.gender === 'female') {
        prefix = [ 'рунная', 'рунной', 'рунной', 'рунную', 'рунной', 'рунной' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'рунные', 'рунных', 'рунным', 'рунные', 'рунными', 'рунных' ];
      } else {
        prefix = [ 'рунное', 'рунного', 'рунному', 'рунное', 'рунным', 'рунном' ];
      }
      break;
    case 'stamina':
      if (item.gender === 'male') {
        prefix = [ 'предохраняющий', 'предохраняющего', 'предохраняющему', 'предохраняющий', 'предохраняющим', 'предохраняющем' ];
      } else if (item.gender === 'female') {
        prefix = [ 'предохраняющая', 'предохраняющей', 'предохраняющей', 'предохраняющую', 'предохраняющей', 'предохраняющей' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'предохраняющие', 'предохраняющих', 'предохраняющим', 'предохраняющие', 'предохраняющими', 'предохраняющих' ];
      } else {
        prefix = [ 'предохраняющее', 'предохраняющего', 'предохраняющему', 'предохраняющее', 'предохраняющим', 'предохраняющем' ];
      }
      break;
    case 'armor':
      if (item.gender === 'male') {
        prefix = [ 'защищенный', 'защищенного', 'защищенному', 'защищенный', 'защищенным', 'защищенном' ];
      } else if (item.gender === 'female') {
        prefix = [ 'защищенная', 'защищенной', 'защищенной', 'защищенную', 'защищенной', 'защищенной' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'защищенные', 'защищенных', 'защищенным', 'защищенные', 'защищенными', 'защищенных' ];
      } else {
        prefix = [ 'защищенное', 'защищенного', 'защищенному', 'защищенное', 'защищенным', 'защищенном' ];
      }
      break;
    case 'critical':
      if (item.gender === 'male') {
        prefix = [ 'тонкий', 'тонкого', 'тонкому', 'тонкий', 'тонким', 'тонком' ];
      } else if (item.gender === 'female') {
        prefix = [ 'тонкая', 'тонкой', 'тонкой', 'тонкую', 'тонкой', 'тонкой' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'тонкие', 'тонких', 'тонким', 'тонкие', 'тонкими', 'тонких' ];
      } else {
        prefix = [ 'тонкое', 'тонкого', 'тонкому', 'тонкое', 'тонким', 'тонком' ];
      }
      break;
    case 'cutting_resistance':
      if (item.gender === 'male') {
        prefix = [ 'кольчужный', 'кольчужного', 'кольчужному', 'кольчужный', 'кольчужным', 'кольчужном' ];
      } else if (item.gender === 'female') {
        prefix = [ 'кольчужная', 'кольчужной', 'кольчужной', 'кольчужную', 'кольчужной', 'кольчужной' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'кольчужные', 'кольчужных', 'кольчужным', 'кольчужные', 'кольчужными', 'кольчужных' ];
      } else {
        prefix = [ 'кольчужное', 'кольчужного', 'кольчужному', 'кольчужное', 'кольчужным', 'кольчужном' ];
      }
      break;
    case 'crushing_resistance':
      if (item.gender === 'male') {
        prefix = [ 'мягкий', 'мягкого', 'мягкому', 'мягкий', 'мягким', 'мягком' ];
      } else if (item.gender === 'female') {
        prefix = [ 'мягкая', 'мягкой', 'мягкой', 'мягкую', 'мягкой', 'мягкой' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'мягкие', 'мягким', 'мягким', 'мягкие', 'мягкими', 'мягких' ];
      } else {
        prefix = [ 'мягкое', 'мягкого', 'мягкому', 'мягкое', 'мягким', 'мягком' ];
      }
      break;
    case 'piercing_resistance':
      if (item.gender === 'male') {
        prefix = [ 'панцирный', 'панцирного', 'панцирному', 'панцирный', 'панцирным', 'панцирном' ];
      } else if (item.gender === 'female') {
        prefix = [ 'панцирная', 'панцирной', 'панцирной', 'панцирную', 'панцирной', 'панцирной' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'панцирные', 'панцирных', 'панцирным', 'панцирные', 'панцирными', 'панцирных' ];
      } else {
        prefix = [ 'панцирное', 'панцирного', 'панцирному', 'панцирное', 'панцирным', 'панцирном' ];
      }
      break;
    case 'fire_resistance':
      if (item.gender === 'male') {
        prefix = [ 'асбестовый', 'асбестового', 'асбестовому', 'асбестовый', 'асбестовым', 'асбестовом' ];
      } else if (item.gender === 'female') {
        prefix = [ 'асбестовая', 'асбестовой', 'асбестовой', 'асбестовую', 'асбестовой', 'асбестовой' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'асбестовые', 'асбестовых', 'асбестовым', 'асбестовые', 'асбестовыми', 'асбестовых' ];
      } else {
        prefix = [ 'асбестовое', 'асбестового', 'асбестовому', 'асбестовое', 'асбестовым', 'асбестовом' ];
      }
      break;
    case 'cold_resistance':
      if (item.gender === 'male') {
        prefix = [ 'тёплый', 'тёплого', 'тёплому', 'тёплый', 'тёплым', 'тёплом' ];
      } else if (item.gender === 'female') {
        prefix = [ 'тёплая', 'тёплой', 'тёплой', 'тёплую', 'тёплой', 'тёплой' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'тёплые', 'тёплых', 'тёплым', 'тёплые', 'тёплыми', 'тёплых' ];
      } else {
        prefix = [ 'тёплое', 'тёплого', 'тёплому', 'тёплое', 'тёплым', 'тёплом' ];
      }
      break;
    case 'lightning_resistance':
      if (item.gender === 'male') {
        prefix = [ 'сухой', 'сухого', 'сухому', 'сухой', 'сухим', 'сухом' ];
      } else if (item.gender === 'female') {
        prefix = [ 'сухая', 'сухой', 'сухой', 'сухую', 'сухой', 'сухой' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'сухие', 'сухих', 'сухим', 'сухие', 'сухими', 'сухих' ];
      } else {
        prefix = [ 'сухое', 'сухого', 'сухому', 'сухое', 'сухим', 'сухом' ];
      }
      break;
    case 'earth_resistance':
      if (item.gender === 'male') {
        prefix = [ 'хитиновый', 'хитинового', 'хитиновому', 'хитиновый', 'хитиновым', 'хитиновом' ];
      } else if (item.gender === 'female') {
        prefix = [ 'хитиновая', 'хитиновой', 'хитиновой', 'хитиновую', 'хитиновой', 'хитиновой' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'хитиновые', 'хитиновых', 'хитиновым', 'хитиновые', 'хитиновыми', 'хитиновых' ];
      } else {
        prefix = [ 'хитиновое', 'хитинового', 'хитиновому', 'хитиновое', 'хитиновым', 'хитиновом' ];
      }
      break;
    case 'acid_resistance':
      if (item.gender === 'male') {
        prefix = [ 'изъеденный', 'изъеденного', 'изъеденному', 'изъеденный', 'изъеденным', 'изъеденном' ];
      } else if (item.gender === 'female') {
        prefix = [ 'изъеденная', 'изъеденной', 'изъеденной', 'изъеденную', 'изъеденной', 'изъеденной' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'изъеденные', 'изъеденных', 'изъеденным', 'изъеденные', 'изъеденными', 'изъеденных' ];
      } else {
        prefix = [ 'изъеденное', 'изъеденного', 'изъеденному', 'изъеденное', 'изъеденным', 'изъеденном' ];
      }
      break;
    case 'chaos_resistance':
      if (item.gender === 'male') {
        prefix = [ 'демонический', 'демонического', 'демоническому', 'демонический', 'демоническим', 'демоническом' ];
      } else if (item.gender === 'female') {
        prefix = [ 'демоническая', 'демонической', 'демонической', 'демоническую', 'демонической', 'демонической' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'демонические', 'демонических', 'демоническим', 'демонические', 'демоническими', 'демонических' ];
      } else {
        prefix = [ 'демоническое', 'демонического', 'демоническому', 'демоническое', 'демоническим', 'демоническом' ];
      }
      break;
    case 'ether_resistance':
      if (item.gender === 'male') {
        prefix = [ 'ангельский', 'ангельского', 'ангельскому', 'ангельский', 'ангельским', 'ангельском' ];
      } else if (item.gender === 'female') {
        prefix = [ 'ангельская', 'ангельской', 'ангельской', 'ангельскую', 'ангельской', 'ангельской' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'ангельские', 'ангельских', 'ангельским', 'ангельские', 'ангельскими', 'ангельских' ];
      } else {
        prefix = [ 'ангельское', 'ангельского', 'ангельскому', 'ангельское', 'ангельским', 'ангельском' ];
      }
      break;
    case 'cutting_damage':
      if (item.gender === 'male') {
        prefix = [ 'заточенный', 'заточенного', 'заточенному', 'заточенный', 'заточенным', 'заточенном' ];
      } else if (item.gender === 'female') {
        prefix = [ 'заточенная', 'заточенной', 'заточенной', 'заточенную', 'заточенной', 'заточенной' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'заточенные', 'заточенных', 'заточенным', 'заточенные', 'заточенными', 'заточенных' ];
      } else {
        prefix = [ 'заточенное', 'заточенного', 'заточенному', 'заточенное', 'заточенным', 'заточенном' ];
      }
      break;
    case 'crushing_damage':
      if (item.gender === 'male') {
        prefix = [ 'улучшенный', 'улучшенного', 'улучшенному', 'улучшенный', 'улучшенным', 'улучшенном' ];
      } else if (item.gender === 'female') {
        prefix = [ 'улучшенная', 'улучшенной', 'улучшенной', 'улучшенную', 'улучшенной', 'улучшенной' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'улучшенные', 'улучшенных', 'улучшенным', 'улучшенные', 'улучшенными', 'улучшенных' ];
      } else {
        prefix = [ 'улучшенное', 'улучшенного', 'улучшенному', 'улучшенное', 'улучшенным', 'улучшенном' ];
      }
      break;
    case 'piercing_damage':
      if (item.gender === 'male') {
        prefix = [ 'шипованный', 'шипованного', 'шипованному', 'шипованный', 'шипованным', 'шипованном' ];
      } else if (item.gender === 'female') {
        prefix = [ 'шипованная', 'шипованной', 'шипованной', 'шипованную', 'шипованной', 'шипованной' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'шипованные', 'шипованных', 'шипованным', 'шипованные', 'шипованными', 'шипованных' ];
      } else {
        prefix = [ 'шипованное', 'шипованного', 'шипованному', 'шипованное', 'шипованным', 'шипованном' ];
      }
      break;
    case 'fire_damage':
      if (item.gender === 'male') {
        prefix = [ 'рубиновый', 'рубинового', 'рубиновому', 'рубиновый', 'рубиновым', 'рубиновому' ];
      } else if (item.gender === 'female') {
        prefix = [ 'рубиновая', 'рубиновой', 'рубиновой', 'рубиновую', 'рубиновой', 'рубиновой' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'рубиновые', 'рубиновых', 'рубиновым', 'рубиновые', 'рубиновыми', 'рубиновых' ];
      } else {
        prefix = [ 'рубиновое', 'рубинового', 'рубиновому', 'рубиновое', 'рубиновым', 'рубиновом' ];
      }
      break;
    case 'cold_damage':
      if (item.gender === 'male') {
        prefix = [ 'сапфировый', 'сапфирового', 'сапфировому', 'сапфировый', 'сапфировым', 'сапфировом' ];
      } else if (item.gender === 'female') {
        prefix = [ 'сапфировая', 'сапфировой', 'сапфировой', 'сапфировую', 'сапфировой', 'сапфировой' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'сапфировые', 'сапфировых', 'сапфировым', 'сапфировые', 'сапфировыми', 'сапфировых' ];
      } else {
        prefix = [ 'сапфировое', 'сапфирового', 'сапфировому', 'сапфировое', 'сапфировым', 'сапфировом' ];
      }
      break;
    case 'lightning_damage':
      if (item.gender === 'male') {
        prefix = [ 'янтарный', 'янтарного', 'янтарному', 'янтарный', 'янтарным', 'янтарном' ];
      } else if (item.gender === 'female') {
        prefix = [ 'янтарная', 'янтарной', 'янтарной', 'янтарную', 'янтарной', 'янтарной' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'янтарные', 'янтарных', 'янтарным', 'янтарные', 'янтарными', 'янтарных' ];
      } else {
        prefix = [ 'янтарное', 'янтарного', 'янтарному', 'янтарное', 'янтарным', 'янтарном' ];
      }
      break;
    case 'earth_damage':
      if (item.gender === 'male') {
        prefix = [ 'изумрудный', 'изумрудного', 'изумрудному', 'изумрудный', 'изумрудным', 'изумрудном' ];
      } else if (item.gender === 'female') {
        prefix = [ 'изумрудная', 'изумрудной', 'изумрудной', 'изумрудную', 'изумрудной', 'изумрудной' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'изумрудные', 'изумрудных', 'изумрудным', 'изумрудные', 'изумрудными', 'изумрудных' ];
      } else {
        prefix = [ 'изумрудное', 'изумрудного', 'изумрудному', 'изумрудное', 'изумрудным', 'изумрудном' ];
      }
      break;
    case 'acid_damage':
      if (item.gender === 'male') {
        prefix = [ 'едкий', 'едкого', 'едкому', 'едкий', 'едким', 'едком' ];
      } else if (item.gender === 'female') {
        prefix = [ 'едкая', 'едкой', 'едкой', 'едкую', 'едкой', 'едкой' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'едкие', 'едких', 'едким', 'едкие', 'едкими', 'едких' ];
      } else {
        prefix = [ 'едкое', 'едкого', 'едкому', 'едкое', 'едким', 'едком' ];
      }
      break;
    case 'chaos_damage':
      if (item.gender === 'male') {
        prefix = [ 'дьявольский', 'дьявольского', 'дьявольскому', 'дьявольский', 'дьявольским', 'дьявольском' ];
      } else if (item.gender === 'female') {
        prefix = [ 'дьявольская', 'дьявольской', 'дьявольской', 'дьявольскую', 'дьявольской', 'дьявольской' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'дьявольские', 'дьявольских', 'дьявольским', 'дьявольские', 'дьявольскими', 'дьявольских' ];
      } else {
        prefix = [ 'дьявольское', 'дьявольского', 'дьявольскому', 'дьявольское', 'дьявольским', 'дьявольском' ];
      }
      break;
    case 'ether_damage':
      if (item.gender === 'male') {
        prefix = [ 'архангельский', 'архангельского', 'архангельскому', 'архангельский', 'архангельским', 'архангельском' ];
      } else if (item.gender === 'female') {
        prefix = [ 'архангельская', 'архангельской', 'архангельской', 'архангельскую', 'архангельской', 'архангельской' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'архангельские', 'архангельских', 'архангельским', 'архангельские', 'архангельскими', 'архангельских' ];
      } else {
        prefix = [ 'архангельское', 'архангельского', 'архангельскому', 'архангельское', 'архангельским', 'архангельском' ];
      }
      break;
    case 'invisibility':
      if (item.gender === 'male') {
        prefix = [ 'прозрачный', 'прозрачного', 'прозрачному', 'прозрачный', 'прозрачным', 'прозрачном' ];
      } else if (item.gender === 'female') {
        prefix = [ 'прозрачная', 'прозрачной', 'прозрачной', 'прозрачную', 'прозрачной', 'прозрачной' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'прозрачные', 'прозрачных', 'прозрачным', 'прозрачные', 'прозрачными', 'прозрачных' ];
      } else {
        prefix = [ 'прозрачное', 'прозрачного', 'прозрачному', 'прозрачное', 'прозрачным', 'прозрачном' ];
      }
      break;
    case 'detect_invisibility':
      if (item.gender === 'male') {
        prefix = [ 'призматический', 'призматического', 'призматическому', 'призматический', 'призматическим', 'призматическом' ];
      } else if (item.gender === 'female') {
        prefix = [ 'призматическая', 'призматической', 'призматической', 'призматическую', 'призматической', 'призматической' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'призматические', 'призматических', 'призматическим', 'призматические', 'призматическими', 'призматических' ];
      } else {
        prefix = [ 'призматическое', 'призматического', 'призматическому', 'призматическое', 'призматическим', 'призматическом' ];
      }
      break;
    case 'hide':
      if (item.gender === 'male') {
        prefix = [ 'переливающийся', 'переливающегося', 'переливающемуся', 'переливающийся', 'переливающимся', 'переливающемся' ];
      } else if (item.gender === 'female') {
        prefix = [ 'переливающаяся', 'переливающейся', 'переливающейся', 'переливающуюся', 'переливающейся', 'переливающейся' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'переливающиеся', 'переливающихся', 'переливающимся', 'переливающиеся', 'переливающимися', 'переливающихся' ];
      } else {
        prefix = [ 'переливающееся', 'переливающегося', 'переливающемуся', 'переливающееся', 'переливающимся', 'переливающемся' ];
      }
      break;
    case 'detect_hide':
      if (item.gender === 'male') {
        prefix = [ 'приманивающий', 'приманивающего', 'приманивающему', 'приманивающий', 'приманивающим', 'приманивающем' ];
      } else if (item.gender === 'female') {
        prefix = [ 'приманивающая', 'приманивающей', 'приманивающей', 'приманивающую', 'приманивающей', 'приманивающей' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'приманивающие', 'приманивающих', 'приманивающим', 'приманивающие', 'приманивающими', 'приманивающих' ];
      } else {
        prefix = [ 'приманивающее', 'приманивающего', 'приманивающему', 'приманивающее', 'приманивающим', 'приманивающем' ];
      }
      break;
    case 'freedom':
      if (item.gender === 'male') {
        prefix = [ 'облегченный', 'облегченного', 'облегченному', 'облегченный', 'облегченным', 'облегченном' ];
      } else if (item.gender === 'female') {
        prefix = [ 'облегченная', 'облегченной', 'облегченной', 'облегченную', 'облегченной', 'облегченной' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'облегченные', 'облегченных', 'облегченным', 'облегченные', 'облегченными', 'облегченных' ];
      } else {
        prefix = [ 'облегченное', 'облегченного', 'облегченному', 'облегченное', 'облегченным', 'облегченном' ];
      }
      break;
    case 'health_regeneration':
      if (item.gender === 'male') {
        prefix = [ 'регенерирующий', 'регенерирующего', 'регенерирующему', 'регенерирующий', 'регенерирующим', 'регенерирующем' ];
      } else if (item.gender === 'female') {
        prefix = [ 'регенерирующая', 'регенерирующей', 'регенерирующей', 'регенерирующую', 'регенерирующей', 'регенерирующую' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'регенерирующие', 'регенерирующих', 'регенерирующим', 'регенерирующие', 'регенерирующими', 'регенерирующих' ];
      } else {
        prefix = [ 'регенерирующее', 'регенерирующего', 'регенерирующему', 'регенерирующее', 'регенерирующим', 'регенерирующем' ];
      }
      break;
    case 'mana_regeneration':
      if (item.gender === 'male') {
        prefix = [ 'вдохновляющий', 'вдохновляющего', 'вдохновляющему', 'вдохновляющий', 'вдохновляющим', 'вдохновляющем' ];
      } else if (item.gender === 'female') {
        prefix = [ 'вдохновляющая', 'вдохновляющей', 'вдохновляющей', 'вдохновляющую', 'вдохновляющей', 'вдохновляющей' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'вдохновляющие', 'вдохновляющих', 'вдохновляющим', 'вдохновляющие', 'вдохновляющими', 'вдохновляющих' ];
      } else {
        prefix = [ 'вдохновляющее', 'вдохновляющего', 'вдохновляющему', 'вдохновляющее', 'вдохновляющим', 'вдохновляющем' ];
      }
      break;
    case 'light':
      if (item.gender === 'male') {
        prefix = [ 'светящийся', 'светящегося', 'светящемуся', 'светящийся', 'светящимся', 'светящемся' ];
      } else if (item.gender === 'female') {
        prefix = [ 'светящаяся', 'светящейся', 'светящейся', 'светящуюся', 'светящейся', 'светящейся' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'светящиеся', 'светящимися', 'светящимся', 'светящиеся', 'светящимися', 'светящихся' ];
      } else {
        prefix = [ 'светящееся', 'светящегося', 'светящемуся', 'светящееся', 'светящимся', 'светящемся' ];
      }
      break;
    default:
      if (item.gender === 'male') {
        prefix = [ 'непонятный', 'непонятного', 'непонятному', 'непонятный', 'непонятным', 'непонятном' ];
      } else if (item.gender === 'female') {
        prefix = [ 'непонятная', 'непонятной', 'непонятной', 'непонятную', 'непонятной', 'непонятной' ];
      } else if (item.gender === 'plural') {
        prefix = [ 'непонятные', 'непонятных', 'непонятным', 'непонятные', 'непонятными', 'непонятных' ];
      } else {
        prefix = [ 'непонятное', 'непонятного', 'непонятному', 'непонятное', 'непонятным', 'непонятном' ];
      }
    }
    return prefix;
}

function randomStatSuffix(item, stat) {
  let suffix = '';
  switch(stat) {
    case 'health':
      suffix = 'дракона';
      break;
    case 'mana':
      suffix = 'архимага';
      break;
    case 'strength':
      suffix = 'быка';
      break;
    case 'agility':
      suffix = 'лиса';
      break;
    case 'intellect':
      suffix = 'ворона';
      break;
    case 'stamina':
      suffix = 'совы';
      break;
    case 'armor':
      suffix = 'медведя';
      break;
    case 'critical':
      suffix = 'змеи';
      break;
    case 'cutting_resistance':
      suffix = 'задора';
      break;
    case 'crushing_resistance':
      suffix = 'удали';
      break;
    case 'piercing_resistance':
      suffix = 'удачи';
      break;
    case 'fire_resistance':
      suffix = 'теплоты';
      break;
    case 'cold_resistance':
      suffix = 'прохлады';
      break;
    case 'lightning_resistance':
      suffix = 'пустоты';
      break;
    case 'earth_resistance':
      suffix = 'леса';
      break;
    case 'acid_resistance':
      suffix = 'болот';
      break;
    case 'chaos_resistance':
      suffix = 'бездны';
      break;
    case 'ether_resistance':
      suffix = 'небес';
      break;
    case 'cutting_damage':
      suffix = 'жестокости';
      break;
    case 'crushing_damage':
      suffix = 'ярости';
      break;
    case 'piercing_damage':
      suffix = 'подлости';
      break;
    case 'fire_damage':
      suffix = 'пламени';
      break;
    case 'cold_damage':
      suffix = 'вьюги';
      break;
    case 'lightning_damage':
      suffix = 'разряда';
      break;
    case 'earth_damage':
      suffix = 'камней';
      break;
    case 'acid_damage':
      suffix = 'ржавчины';
      break;
    case 'chaos_damage':
      suffix = 'нечестивости';
      break;
    case 'ether_damage':
      suffix = 'праведности';
      break;
    case 'invisibility':
      suffix = 'невидимости';
      break;
    case 'detect_invisibility':
      suffix = 'зрения';
      break;
    case 'hide':
      suffix = 'маскировки';
      break;
    case 'detect_hide':
      suffix = 'внимательности';
      break;
    case 'freedom':
      suffix = 'свободы';
      break;
    case 'health_regeneration':
      suffix = 'регенерации';
      break;
    case 'mana_regeneration':
      suffix = 'магии';
      break;
    case 'light':
      suffix = 'света';
      break;
    default:
      suffix = 'непонятности';
    }
    return suffix;
}

exports.enhance = function (item, quality = 'uncommon') {
  let stat = '';
  let lvl = 0;
  switch(quality) {
    case 'uncommon':
      stat = randomStat();
      item.name = randomStatPrefix(item, stat)[0] + ' ' + item.name;
      item.rname = randomStatPrefix(item, stat)[1] + ' ' + item.rname;
      item.dname = randomStatPrefix(item, stat)[2] + ' ' + item.dname;
      item.vname = randomStatPrefix(item, stat)[3] + ' ' + item.vname;
      item.tname = randomStatPrefix(item, stat)[4] + ' ' + item.tname;
      item.pname = randomStatPrefix(item, stat)[5] + ' ' + item.pname;
      item.keywords.push(randomStatPrefix(item, stat)[0]);
      lvl = item.getMeta('level');
      (lvl < 99) ? item.setMeta('level', lvl + 1) : item.setMeta('level', 99);
      item.setMeta('quality', 'uncommon');
      if (!item.getMeta(`stats.${stat}`)) {
        item.setMeta(`stats.${stat}`, randomStatValue(item, stat));
      } else {
        let oldStat = item.getMeta(`stats.${stat}`);
        item.setMeta(`stats.${stat}`, oldStat + randomStatValue(item, stat));
      }
      break;
    case 'rare':
      stat = randomStat();
      item.name = randomStatPrefix(item, stat)[0] + ' ' + item.name;
      item.rname = randomStatPrefix(item, stat)[1] + ' ' + item.rname;
      item.dname = randomStatPrefix(item, stat)[2] + ' ' + item.dname;
      item.vname = randomStatPrefix(item, stat)[3] + ' ' + item.vname;
      item.tname = randomStatPrefix(item, stat)[4] + ' ' + item.tname;
      item.pname = randomStatPrefix(item, stat)[5] + ' ' + item.pname;
      item.keywords.push(randomStatPrefix(item, stat)[0]);
      if (!item.getMeta(`stats.${stat}`)) {
        item.setMeta(`stats.${stat}`, randomStatValue(item, stat));
      } else {
        let oldStat = item.getMeta(`stats.${stat}`);
        item.setMeta(`stats.${stat}`, oldStat + randomStatValue(item, stat));
      }
      stat = randomStat();
      item.name = item.name + ' ' + randomStatSuffix(item, stat);
      item.rname = item.rname + ' ' + randomStatSuffix(item, stat);
      item.dname = item.dname + ' ' + randomStatSuffix(item, stat);
      item.vname = item.vname + ' ' + randomStatSuffix(item, stat);
      item.tname = item.tname + ' ' + randomStatSuffix(item, stat);
      item.pname = item.pname + ' ' + randomStatSuffix(item, stat);
      lvl = item.getMeta('level');
      (lvl < 98) ? item.setMeta('level', lvl + 2) : item.setMeta('level', 99);
      item.setMeta('quality', 'rare');
      if (!item.getMeta(`stats.${stat}`)) {
        item.setMeta(`stats.${stat}`, randomStatValue(item, stat));
      } else {
        let oldStat = item.getMeta(`stats.${stat}`);
        item.setMeta(`stats.${stat}`, oldStat + randomStatValue(item, stat));
      }
      break;
    case 'epic':
      stat = randomStat();
      item.name = randomStatPrefix(item, stat)[0] + ' ' + item.name;
      item.rname = randomStatPrefix(item, stat)[1] + ' ' + item.rname;
      item.dname = randomStatPrefix(item, stat)[2] + ' ' + item.dname;
      item.vname = randomStatPrefix(item, stat)[3] + ' ' + item.vname;
      item.tname = randomStatPrefix(item, stat)[4] + ' ' + item.tname;
      item.pname = randomStatPrefix(item, stat)[5] + ' ' + item.pname;
      item.keywords.push(randomStatPrefix(item, stat)[0]);
      if (!item.getMeta(`stats.${stat}`)) {
        item.setMeta(`stats.${stat}`, randomStatValue(item, stat));
      } else {
        let oldStat = item.getMeta(`stats.${stat}`);
        item.setMeta(`stats.${stat}`, oldStat + randomStatValue(item, stat));
      }
      stat = randomStat();
      item.name = item.name + ' ' + randomStatSuffix(item, stat) + '★';
      item.rname = item.rname + ' ' + randomStatSuffix(item, stat) + '★';
      item.dname = item.dname + ' ' + randomStatSuffix(item, stat) + '★';
      item.vname = item.vname + ' ' + randomStatSuffix(item, stat) + '★';
      item.tname = item.tname + ' ' + randomStatSuffix(item, stat) + '★';
      item.pname = item.pname + ' ' + randomStatSuffix(item, stat) + '★';
      lvl = item.getMeta('level');
      (lvl < 97) ? item.setMeta('level', lvl + 3) : item.setMeta('level', 99);
      item.setMeta('quality', 'epic');
      if (!item.getMeta(`stats.${stat}`)) {
        item.setMeta(`stats.${stat}`, randomStatValue(item, stat));
      } else {
        let oldStat = item.getMeta(`stats.${stat}`);
        item.setMeta(`stats.${stat}`, oldStat + randomStatValue(item, stat));
      }
      if (item.getMeta('minDamage')) {
        let minDamage = item.getMeta('minDamage');
        item.setMeta('minDamage', Math.floor(minDamage * 1.05));
      }
      if (item.getMeta('maxDamage')) {
        let maxDamage = item.getMeta('maxDamage');
        item.setMeta('maxDamage', Math.floor(maxDamage * 1.05));
      }
      for (let stat in item.metadata.stats) {
        let statVal = item.getMeta('stats.' + stat);
        item.setMeta('stats.' + stat, Math.floor(statVal * 1.1));
      }
      break;
    case 'legendary':
      stat = randomStat();
      item.name = randomStatPrefix(item, stat)[0] + ' ' + item.name;
      item.rname = randomStatPrefix(item, stat)[1] + ' ' + item.rname;
      item.dname = randomStatPrefix(item, stat)[2] + ' ' + item.dname;
      item.vname = randomStatPrefix(item, stat)[3] + ' ' + item.vname;
      item.tname = randomStatPrefix(item, stat)[4] + ' ' + item.tname;
      item.pname = randomStatPrefix(item, stat)[5] + ' ' + item.pname;
      item.keywords.push(randomStatPrefix(item, stat)[0]);
      if (!item.getMeta(`stats.${stat}`)) {
        item.setMeta(`stats.${stat}`, randomStatValue(item, stat));
      } else {
        let oldStat = item.getMeta(`stats.${stat}`);
        item.setMeta(`stats.${stat}`, oldStat + randomStatValue(item, stat));
      }
      stat = randomStat();
      item.name = item.name + ' ' + randomStatSuffix(item, stat) + '★★';
      item.rname = item.rname + ' ' + randomStatSuffix(item, stat) + '★★';
      item.dname = item.dname + ' ' + randomStatSuffix(item, stat) + '★★';
      item.vname = item.vname + ' ' + randomStatSuffix(item, stat) + '★★';
      item.tname = item.tname + ' ' + randomStatSuffix(item, stat) + '★★';
      item.pname = item.pname + ' ' + randomStatSuffix(item, stat) + '★★';
      lvl = item.getMeta('level');
      (lvl < 96) ? item.setMeta('level', lvl + 4) : item.setMeta('level', 99);
      item.setMeta('quality', 'legendary');
      if (!item.getMeta(`stats.${stat}`)) {
        item.setMeta(`stats.${stat}`, randomStatValue(item, stat));
      } else {
        let oldStat = item.getMeta(`stats.${stat}`);
        item.setMeta(`stats.${stat}`, oldStat + randomStatValue(item, stat));
      }
      if (item.getMeta('minDamage')) {
        let minDamage = item.getMeta('minDamage');
        item.setMeta('minDamage', Math.floor(minDamage * 1.1));
      }
      if (item.getMeta('maxDamage')) {
        let maxDamage = item.getMeta('maxDamage');
        item.setMeta('maxDamage', Math.floor(maxDamage * 1.1));
      }
      for (let stat in item.metadata.stats) {
        let statVal = item.getMeta('stats.' + stat);
        item.setMeta('stats.' + stat, Math.floor(statVal * 1.25));
      }
      break;
    case 'artifact':
      stat = randomStat();
      item.name = randomStatPrefix(item, stat)[0] + ' ' + item.name;
      item.rname = randomStatPrefix(item, stat)[1] + ' ' + item.rname;
      item.dname = randomStatPrefix(item, stat)[2] + ' ' + item.dname;
      item.vname = randomStatPrefix(item, stat)[3] + ' ' + item.vname;
      item.tname = randomStatPrefix(item, stat)[4] + ' ' + item.tname;
      item.pname = randomStatPrefix(item, stat)[5] + ' ' + item.pname;
      item.keywords.push(randomStatPrefix(item, stat)[0]);
      if (!item.getMeta(`stats.${stat}`)) {
        item.setMeta(`stats.${stat}`, randomStatValue(item, stat));
      } else {
        let oldStat = item.getMeta(`stats.${stat}`);
        item.setMeta(`stats.${stat}`, oldStat + randomStatValue(item, stat));
      }
      stat = randomStat();
      item.name = item.name + ' ' + randomStatSuffix(item, stat) + '★★★';
      item.rname = item.rname + ' ' + randomStatSuffix(item, stat) + '★★★';
      item.dname = item.dname + ' ' + randomStatSuffix(item, stat) + '★★★';
      item.vname = item.vname + ' ' + randomStatSuffix(item, stat) + '★★★';
      item.tname = item.tname + ' ' + randomStatSuffix(item, stat) + '★★★';
      item.pname = item.pname + ' ' + randomStatSuffix(item, stat) + '★★★';
      lvl = item.getMeta('level');
      (lvl < 95) ? item.setMeta('level', lvl + 5) : item.setMeta('level', 99);
      item.setMeta('quality', 'artifact');
      if (!item.getMeta(`stats.${stat}`)) {
        item.setMeta(`stats.${stat}`, randomStatValue(item, stat));
      } else {
        let oldStat = item.getMeta(`stats.${stat}`);
        item.setMeta(`stats.${stat}`, oldStat + randomStatValue(item, stat));
      }
      if (item.getMeta('minDamage')) {
        let minDamage = item.getMeta('minDamage');
        item.setMeta('minDamage', Math.floor(minDamage * 1.25));
      }
      if (item.getMeta('maxDamage')) {
        let maxDamage = item.getMeta('maxDamage');
        item.setMeta('maxDamage', Math.floor(maxDamage * 1.25));
      }
      for (let stat in item.metadata.stats) {
        let statVal = item.getMeta('stats.' + stat);
        item.setMeta('stats.' + stat, Math.floor(statVal * 1.5));
      }
      break;
  }
  return item;
};

