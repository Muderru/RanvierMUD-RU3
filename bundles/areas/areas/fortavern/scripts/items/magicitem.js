const EnhanceItem = require('../../../../../lib/lib/EnhanceItem');

module.exports = {
  listeners: {
    spawn: (state) => function () {
      EnhanceItem.enhance(this, 'uncommon');
    },
  },
};
