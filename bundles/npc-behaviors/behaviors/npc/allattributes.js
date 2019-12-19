'use strict';

const { Logger } = require('ranvier');

module.exports = {
  listeners: {
    spawn: state => function (config) {
      if (!config) {
        config = 0;
      }
      if (!this.hasAttribute('strength')) {
        this.addAttribute(state.AttributeFactory.create('strength', config));
      }
      if (!this.hasAttribute('agility')) {
        this.addAttribute(state.AttributeFactory.create('agility', config));
      }
      if (!this.hasAttribute('intellect')) {
        this.addAttribute(state.AttributeFactory.create('intellect', config));
      }
      if (!this.hasAttribute('stamina')) {
        this.addAttribute(state.AttributeFactory.create('stamina', config));
      }
      if (!this.hasAttribute('armor')) {
        this.addAttribute(state.AttributeFactory.create('armor', config));
      }
      if (!this.hasAttribute('critical')) {
        this.addAttribute(state.AttributeFactory.create('critical', config));
      }
      if (!this.hasAttribute('cutting_resistance')) {
        this.addAttribute(state.AttributeFactory.create('cutting_resistance', config));
      }
      if (!this.hasAttribute('crushing_resistance')) {
        this.addAttribute(state.AttributeFactory.create('crushing_resistance', config));
      }
      if (!this.hasAttribute('piercing_resistance')) {
        this.addAttribute(state.AttributeFactory.create('piercing_resistance', config));
      }
      if (!this.hasAttribute('fire_resistance')) {
        this.addAttribute(state.AttributeFactory.create('fire_resistance', config));
      }
      if (!this.hasAttribute('cold_resistance')) {
        this.addAttribute(state.AttributeFactory.create('cold_resistance', config));
      }
      if (!this.hasAttribute('lightning_resistance')) {
        this.addAttribute(state.AttributeFactory.create('lightning_resistance', config));
      }
      if (!this.hasAttribute('earth_resistance')) {
        this.addAttribute(state.AttributeFactory.create('earth_resistance', config));
      }
      if (!this.hasAttribute('acid_resistance')) {
        this.addAttribute(state.AttributeFactory.create('acid_resistance', config));
      }
      if (!this.hasAttribute('chaos_resistance')) {
        this.addAttribute(state.AttributeFactory.create('chaos_resistance', config));
      }
      if (!this.hasAttribute('ether_resistance')) {
        this.addAttribute(state.AttributeFactory.create('ether_resistance', config));
      }
      if (!this.hasAttribute('cutting_damage')) {
        this.addAttribute(state.AttributeFactory.create('cutting_damage', config));
      }
      if (!this.hasAttribute('crushing_damage')) {
        this.addAttribute(state.AttributeFactory.create('crushing_damage', config));
      }
      if (!this.hasAttribute('piercing_damage')) {
        this.addAttribute(state.AttributeFactory.create('piercing_damage', config));
      }
      if (!this.hasAttribute('fire_damage')) {
        this.addAttribute(state.AttributeFactory.create('fire_damage', config));
      }
      if (!this.hasAttribute('cold_damage')) {
        this.addAttribute(state.AttributeFactory.create('cold_damage', config));
      }
      if (!this.hasAttribute('lightning_damage')) {
        this.addAttribute(state.AttributeFactory.create('lightning_damage', config));
      }
      if (!this.hasAttribute('earth_damage')) {
        this.addAttribute(state.AttributeFactory.create('earth_damage', config));
      }
      if (!this.hasAttribute('acid_damage')) {
        this.addAttribute(state.AttributeFactory.create('acid_damage', config));
      }
      if (!this.hasAttribute('chaos_damage')) {
        this.addAttribute(state.AttributeFactory.create('chaos_damage', config));
      }
      if (!this.hasAttribute('ether_damage')) {
        this.addAttribute(state.AttributeFactory.create('ether_damage', config));
      }
      if (!this.hasAttribute('detect_invisibility')) {
        this.addAttribute(state.AttributeFactory.create('detect_invisibility', config));
      }
      if (!this.hasAttribute('detect_hide')) {
        this.addAttribute(state.AttributeFactory.create('detect_hide', config));
      }
      if (!this.hasAttribute('freedom')) {
        this.addAttribute(state.AttributeFactory.create('freedom', config));
      }
      if (!this.hasAttribute('health_regeneration')) {
        this.addAttribute(state.AttributeFactory.create('health_regeneration', config));
      }
      if (!this.hasAttribute('mana_regeneration')) {
        this.addAttribute(state.AttributeFactory.create('mana_regeneration', config));
      }
    }
  }
};
