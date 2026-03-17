const Template = require('./template');

describe('Template', () => {
  let t;
  beforeEach(() => { t = new Template(); });

  it('renders a simple template', () => {
    t.register('greeting', 'Hello {{name}}!');
    expect(t.render('greeting', { name: 'World' })).toBe('Hello World!');
  });

  it('renders nested dot-path data', () => {
    t.register('login', 'Login from {{data.ip}}');
    expect(t.render('login', { data: { ip: '1.2.3.4' } })).toBe('Login from 1.2.3.4');
  });

  it('replaces multiple placeholders', () => {
    t.register('msg', '{{a}} and {{b}}');
    expect(t.render('msg', { a: 'foo', b: 'bar' })).toBe('foo and bar');
  });

  it('returns null for unknown template', () => {
    expect(t.render('unknown', {})).toBeNull();
  });

  it('replaces missing path with empty string', () => {
    t.register('msg', 'val={{missing}}');
    expect(t.render('msg', {})).toBe('val=');
  });
});
