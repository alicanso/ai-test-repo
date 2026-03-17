const Template = require('./template');

class NotificationService {
  constructor(options = {}) {
    this.channels = {};
    this.userPrefs = {};
    this.digestQueues = {};
    this.template = new Template();
    this.maxRetries = options.maxRetries !== undefined ? options.maxRetries : 3;
    this._timer = null;
    if (options.digestInterval) {
      this._timer = setInterval(() => this._autoFlush(), options.digestInterval);
    }
  }

  registerChannel(name, channel) {
    this.channels[name] = channel;
  }

  getChannel(name) {
    if (!this.channels[name]) throw new Error(`Channel '${name}' not registered`);
    return this.channels[name];
  }

  setUserPreferences(userId, prefs) {
    this.userPrefs[userId] = prefs;
  }

  registerTemplate(event, tpl) {
    this.template.register(event, tpl);
  }

  async send(userId, event, data) {
    const prefs = this.userPrefs[userId] || { channel: 'default', mode: 'immediate' };
    const message = this.template.render(event, { userId, data });
    const notification = { userId, event, data, message, timestamp: Date.now() };

    if (prefs.mode === 'digest') {
      if (!this.digestQueues[userId]) this.digestQueues[userId] = [];
      this.digestQueues[userId].push(notification);
    } else {
      await this._sendWithRetry(prefs.channel, notification);
    }
  }

  async flush(userId) {
    const queue = this.digestQueues[userId];
    if (!queue || queue.length === 0) return;
    const prefs = this.userPrefs[userId];
    const digest = { userId, notifications: queue, timestamp: Date.now() };
    this.digestQueues[userId] = [];
    await this._sendWithRetry(prefs.channel, digest);
  }

  async _sendWithRetry(channelName, notification, attempt = 0) {
    const channel = this.getChannel(channelName);
    try {
      await channel.send(notification);
    } catch (err) {
      if (attempt + 1 < this.maxRetries) {
        await this._sendWithRetry(channelName, notification, attempt + 1);
      } else {
        throw err;
      }
    }
  }

  _autoFlush() {
    return Promise.all(Object.keys(this.digestQueues).map((uid) => this.flush(uid)));
  }

  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }
}

module.exports = NotificationService;
