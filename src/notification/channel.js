class BaseChannel {
  async send(notification) {
    throw new Error('send() must be implemented by subclass');
  }
}

module.exports = BaseChannel;
