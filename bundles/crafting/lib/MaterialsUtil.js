'use strict';

exports.material = function (attr) {
  switch(attr) {
    case 'health':
      return 'сукровица';
    case 'mana':
      return 'флегма';
    case 'strength':
      return 'квасцы';
    case 'agility':
      return 'ртуть';
    case 'intellect':
      return 'ихор';
    case 'stamina':
      return 'древесина';
    case 'armor':
      return 'мифрил';
    case 'critical':
      return 'адамантит';
    case 'cutting_resistance':
      return 'кость';
    case 'crushing_resistance':
      return 'кожа';
    case 'piercing_resistance':
      return 'хитин';
    case 'fire_resistance':
      return 'флогистон';
    case 'cold_resistance':
      return 'шерсть';
    case 'lightning_resistance':
      return 'янтарь';
    case 'earth_resistance':
      return 'охра';
    case 'acid_resistance':
      return 'купорос';
    case 'chaos_resistance':
      return 'кристалл';
    case 'ether_resistance':
      return 'порфир';
    case 'cutting_damage':
      return 'обсидиан';
    case 'crushing_damage':
      return 'орихалк';
    case 'piercing_damage':
      return 'шипы';
    case 'fire_damage':
      return 'сера';
    case 'cold_damage':
      return 'лёд';
    case 'lightning_damage':
      return 'амальгама';
    case 'earth_damage':
      return 'куркумин';
    case 'acid_damage':
      return 'уксус';
    case 'chaos_damage':
      return 'кровь';
    case 'ether_damage':
      return 'эфир';
    case 'light':
      return 'воск';
    case 'invisibility':
      return 'эктоплазма';
    case 'detect_invisibility':
      return 'кварц';
    case 'hide':
      return 'хромофор';
    case 'detect_hide':
      return 'танин';
    case 'freedom':
      return 'мескалин';
    case 'health_regeneration':
      return 'пурпур';
    case 'mana_regeneration':
      return 'индиго';
    default:
      return 'эктоплазма';
  }
};

exports.plant = function (areaType) {
  let plants = [];
  switch(areaType) {
    case 'луг':
      plants = ['anise', 'valerian', 'verbena', 'carnation', 'tutsan', 'clover', 'lavender', 'flax']
      return `craft:${plants[Math.floor(Math.random() * plants.length)]}`;
    case 'лес':
      plants = ['mandrake', 'heather', 'honeysuckle', 'juniper', 'fern', 'thistle', 'hemlock', 'amanita']
      return `craft:${plants[Math.floor(Math.random() * plants.length)]}`;
    case 'горы':
      plants = ['hawthorn', 'barberry', 'gentian', 'fireweed', 'ginseng', 'edelweiss', 'rhododendron', 'azalea']
      return `craft:${plants[Math.floor(Math.random() * plants.length)]}`;
    case 'мелководье':
      plants = ['lotus', 'calamus', 'duckweed', 'waterlily', 'hornwort', 'calla', 'hyacinth', 'reeds']
      return `craft:${plants[Math.floor(Math.random() * plants.length)]}`;
    case 'болото':
      plants = ['angelica', 'mint', 'cicuta', 'henbane', 'cane', 'cranberry', 'iris', 'sundew']
      return `craft:${plants[Math.floor(Math.random() * plants.length)]}`;
    case 'пещера':
      plants = ['fleshylichen', 'cavemoss', 'schizosteg', 'albinofern', 'bloodylichen', 'sulphurousmushroom', 'goldensponge', 'brainmushroom']
      return `craft:${plants[Math.floor(Math.random() * plants.length)]}`;
    case 'тундра':
      plants = ['reindeermoss', 'bearberry', 'cloudberry', 'blueberry', 'arcticberry', 'crowberry', 'cottongrass', 'ledum']
      return `craft:${plants[Math.floor(Math.random() * plants.length)]}`;
    case 'пустошь':
      plants = ['sagebrush', 'adonis', 'mimosa', 'basil', 'vetiver', 'geranium', 'cumin', 'sage']
      return `craft:${plants[Math.floor(Math.random() * plants.length)]}`;
    case 'степь':
      plants = ['sagebrush', 'adonis', 'mimosa', 'basil', 'vetiver', 'geranium', 'cumin', 'sage']
      return `craft:${plants[Math.floor(Math.random() * plants.length)]}`;
    case 'пустыня':
      plants = ['aloe', 'cactus', 'myrrh', 'acacia', 'tumbleweed', 'saxaul', 'camelthorn', 'stapelia']
      return `craft:${plants[Math.floor(Math.random() * plants.length)]}`;
    default:
      plants = ['anise', 'valerian', 'verbena', 'carnation', 'tutsan', 'clover', 'lavender', 'flax']
      return `craft:${plants[Math.floor(Math.random() * plants.length)]}`;
  }
};