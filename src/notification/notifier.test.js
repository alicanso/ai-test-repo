const NotificationService = require('./notifier');
const BaseChannel = require('./channel');

class MockChannel extends BaseChannel {
  constructor() {
    super();
    this.sent = [];
    this.shouldFail = false;
  }
  async send(notification) {
    if (this.shouldFail) throw new Error('Channel failure');
    this.sent.push(notification);
  }
}

describe('NotificationService', () => {
  let service;
  let mockChannel;

  beforeEach(() => {
    service = new NotificationService();
    mockChannel = new MockChannel();
    service.registerChannel('mock', mockChannel);
  });

  describe('channel registration', () => {
    it('registers a channel', () => {
      expect(service.getChannel('mock')).toBe(mockChannel);
    });

    it('throws for unregistered channel', () => {
      expect(() => service.getChannel('unknown')).toThrow("Channel 'unknown' not registered");
    });
  });

  describe('immediate send', () => {
    it('sends notification immediately via channel', async () => {
      service.setUserPreferences('user1', { channel: 'mock', mode: 'immediate' });
      await service.send('user1', 'login', { ip: '127.0.0.1' });
      expect(mockChannel.sent).toHaveLength(1);
      expect(mockChannel.sent[0].event).toBe('login');
      expect(mockChannel.sent[0].userId).toBe('user1');
    });

    it('includes data in notification', async () => {
      service.setUserPreferences('user1', { channel: 'mock', mode: 'immediate' });
      await service.send('user1', 'purchase', { item: 'widget', price: 9.99 });
      expect(mockChannel.sent[0].data).toEqual({ item: 'widget', price: 9.99 });
    });
  });

  describe('digest send', () => {
    it('queues notification without sending', async () => {
      service.setUserPreferences('user1', { channel: 'mock', mode: 'digest' });
      await service.send('user1', 'update', { item: 'post' });
      expect(mockChannel.sent).toHaveLength(0);
    });

    it('flushes digest as a single batched notification', async () => {
      service.setUserPreferences('user1', { channel: 'mock', mode: 'digest' });
      await service.send('user1', 'update', { item: 'post1' });
      await service.send('user1', 'update', { item: 'post2' });
      await service.flush('user1');
      expect(mockChannel.sent).toHaveLength(1);
      expect(mockChannel.sent[0].notifications).toHaveLength(2);
    });

    it('clears queue after flush', async () => {
      service.setUserPreferences('user1', { channel: 'mock', mode: 'digest' });
      await service.send('user1', 'update', {});
      await service.flush('user1');
      await service.flush('user1');
      expect(mockChannel.sent).toHaveLength(1);
    });

    it('does nothing if queue is empty', async () => {
      service.setUserPreferences('user1', { channel: 'mock', mode: 'digest' });
      await service.flush('user1');
      expect(mockChannel.sent).toHaveLength(0);
    });
  });

  describe('templates', () => {
    it('renders message with registered template', async () => {
      service.setUserPreferences('user1', { channel: 'mock', mode: 'immediate' });
      service.registerTemplate('login', 'User {{userId}} logged in from {{data.ip}}');
      await service.send('user1', 'login', { ip: '127.0.0.1' });
      expect(mockChannel.sent[0].message).toBe('User user1 logged in from 127.0.0.1');
    });

    it('sets message to null when no template registered', async () => {
      service.setUserPreferences('user1', { channel: 'mock', mode: 'immediate' });
      await service.send('user1', 'unknown_event', {});
      expect(mockChannel.sent[0].message).toBeNull();
    });
  });

  describe('retry', () => {
    it('retries on channel failure and succeeds', async () => {
      let attempts = 0;
      class FlakeyChannel extends BaseChannel {
        async send() {
          attempts++;
          if (attempts < 3) throw new Error('transient failure');
        }
      }
      service.registerChannel('flakey', new FlakeyChannel());
      service.setUserPreferences('user1', { channel: 'flakey', mode: 'immediate' });
      await service.send('user1', 'test', {});
      expect(attempts).toBe(3);
    });

    it('throws after exhausting max retries', async () => {
      class AlwaysFailChannel extends BaseChannel {
        async send() { throw new Error('permanent failure'); }
      }
      service.registerChannel('fail', new AlwaysFailChannel());
      service.setUserPreferences('user1', { channel: 'fail', mode: 'immediate' });
      await expect(service.send('user1', 'test', {})).rejects.toThrow('permanent failure');
    });
  });

  describe('time-based digest', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('auto-flushes all digest queues after interval', async () => {
      const timedService = new NotificationService({ digestInterval: 1000 });
      timedService.registerChannel('mock', mockChannel);
      timedService.setUserPreferences('user1', { channel: 'mock', mode: 'digest' });
      await timedService.send('user1', 'update', {});
      expect(mockChannel.sent).toHaveLength(0);
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
      await Promise.resolve();
      expect(mockChannel.sent).toHaveLength(1);
      timedService.stop();
    });

    it('does not fire after stop()', async () => {
      const timedService = new NotificationService({ digestInterval: 500 });
      timedService.registerChannel('mock', mockChannel);
      timedService.setUserPreferences('user1', { channel: 'mock', mode: 'digest' });
      await timedService.send('user1', 'update', {});
      timedService.stop();
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
      expect(mockChannel.sent).toHaveLength(0);
    });
  });
});
