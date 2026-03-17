const BaseChannel = require('../channel');

class MockSlackChannel extends BaseChannel {
  constructor() {
    super();
    this.sent = [];
  }

  async send(notification) {
    this.sent.push({ type: 'slack', ...notification });
  }
}

module.exports = MockSlackChannel;
