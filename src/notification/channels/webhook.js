const BaseChannel = require('../channel');

class MockWebhookChannel extends BaseChannel {
  constructor() {
    super();
    this.sent = [];
  }

  async send(notification) {
    this.sent.push({ type: 'webhook', ...notification });
  }
}

module.exports = MockWebhookChannel;
