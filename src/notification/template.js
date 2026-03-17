class Template {
  constructor() {
    this.templates = {};
  }

  register(name, tpl) {
    this.templates[name] = tpl;
  }

  render(name, data) {
    const tpl = this.templates[name];
    if (!tpl) return null;
    return tpl.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
      const value = key.split('.').reduce((obj, k) => obj?.[k], data);
      return value !== undefined && value !== null ? value : '';
    });
  }
}

module.exports = Template;
