module.exports = {
  listeners: {
    spawn: (state) => function (config) {
      if (!config) {
        config = 0;
      }
      if (this.getAttribute('strength') === 0) {
        this.attributes.get('strength').setBase(20 + config);
      }
      if (this.getAttribute('agility') === 0) {
        this.attributes.get('agility').setBase(20 + config);
      }
      if (this.getAttribute('intellect') === 0) {
        this.attributes.get('intellect').setBase(20 + config);
      }
      if (this.getAttribute('stamina') === 0) {
        this.attributes.get('stamina').setBase(20 + config);
      }
      if (this.getAttribute('armor') === 0) {
        this.attributes.get('armor').setBase(config);
      }
      if (this.getAttribute('critical') === 0) {
        this.attributes.get('critical').setBase(config);
      }
      if (this.getAttribute('cutting_resistance') === 0) {
        this.attributes.get('cutting_resistance').setBase(config);
      }
      if (this.getAttribute('crushing_resistance') === 0) {
        this.attributes.get('crushing_resistance').setBase(config);
      }
      if (this.getAttribute('piercing_resistance') === 0) {
        this.attributes.get('piercing_resistance').setBase(config);
      }
      if (this.getAttribute('fire_resistance') === 0) {
        this.attributes.get('fire_resistance').setBase(config);
      }
      if (this.getAttribute('cold_resistance') === 0) {
        this.attributes.get('cold_resistance').setBase(config);
      }
      if (this.getAttribute('lightning_resistance') === 0) {
        this.attributes.get('lightning_resistance').setBase(config);
      }
      if (this.getAttribute('earth_resistance') === 0) {
        this.attributes.get('earth_resistance').setBase(config);
      }
      if (this.getAttribute('acid_resistance') === 0) {
        this.attributes.get('acid_resistance').setBase(config);
      }
      if (this.getAttribute('chaos_resistance') === 0) {
        this.attributes.get('chaos_resistance').setBase(config);
      }
      if (this.getAttribute('ether_resistance') === 0) {
        this.attributes.get('ether_resistance').setBase(config);
      }
      if (this.getAttribute('cutting_damage') === 0) {
        this.attributes.get('cutting_damage').setBase(config);
      }
      if (this.getAttribute('crushing_damage') === 0) {
        this.attributes.get('crushing_damage').setBase(config);
      }
      if (this.getAttribute('piercing_damage') === 0) {
        this.attributes.get('piercing_damage').setBase(config);
      }
      if (this.getAttribute('fire_damage') === 0) {
        this.attributes.get('fire_damage').setBase(config);
      }
      if (this.getAttribute('cold_damage') === 0) {
        this.attributes.get('cold_damage').setBase(config);
      }
      if (this.getAttribute('lightning_damage') === 0) {
        this.attributes.get('lightning_damage').setBase(config);
      }
      if (this.getAttribute('earth_damage') === 0) {
        this.attributes.get('earth_damage').setBase(config);
      }
      if (this.getAttribute('acid_damage') === 0) {
        this.attributes.get('acid_damage').setBase(config);
      }
      if (this.getAttribute('chaos_damage') === 0) {
        this.attributes.get('chaos_damage').setBase(config);
      }
      if (this.getAttribute('ether_damage') === 0) {
        this.attributes.get('ether_damage').setBase(config);
      }
      if (this.getAttribute('detect_invisibility') === 0) {
        this.attributes.get('detect_invisibility').setBase(config);
      }
      if (this.getAttribute('detect_hide') === 0) {
        this.attributes.get('detect_hide').setBase(config);
      }
      if (this.getAttribute('freedom') === 0) {
        this.attributes.get('freedom').setBase(config);
      }
      if (this.getAttribute('health_regeneration') === 0) {
        this.attributes.get('health_regeneration').setBase(5 + config);
      }
      if (this.getAttribute('mana_regeneration') === 0) {
        this.attributes.get('mana_regeneration').setBase(5 + config);
      }
    },
  },
};
