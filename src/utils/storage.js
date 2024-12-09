class Storage {
  constructor() {
    this.storage = window.localStorage;
  }

  setItem(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  getItem(key) {
    const value = this.storage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  removeItem(key) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}

export const storage = new Storage();
