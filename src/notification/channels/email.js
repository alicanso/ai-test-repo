const BaseChannel = require('../channel');

class MockEmailChannel extends BaseChannel {
  constructor() {
    super();
    this.sent = [];
  }

  async send(notification) {
    this.sent.push({ type: 'email', ...notification });
  }
}

module.exports = MockEmailChannel;
