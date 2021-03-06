/**
 * Have an NPC speak phrases over time
 */
module.exports = {
  config: {
    name: 'Speaking',
    type: 'speaking',
    tickInterval: 3,
    persists: false,
  },
  state: {
    messageList: [],
    remainingMessages: [],
    outputFn: null,
  },
  listeners: {
    effectActivated() {
      if (typeof this.state.outputFn !== 'function') {
        throw new Error('Speak effect has no outputFn configured');
      }

      // copy original message list to remainingMessages
      this.state.remainingMessages = this.state.messageList.concat([]);
    },

    updateTick() {
      if (!this.state.remainingMessages.length) {
        return this.remove();
      }

      const message = this.state.remainingMessages.shift();
      this.state.outputFn(message);
    },
  },
};
