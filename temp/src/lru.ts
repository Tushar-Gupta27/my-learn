class InMemoryLru<Key, Value = unknown> {
  private readonly capacity: number;
  private readonly cache: Map<Key, Value>;

  constructor(capacity: number = 4096) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  private setMostRecentlyUsed(key: Key, value: Value) {
    this.cache.delete(key);
    this.cache.set(key, value);
  }

  public get(key: Key): Value | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    const value = this.cache.get(key);

    if (!value) {
      return undefined;
    }

    this.setMostRecentlyUsed(key, value);

    return value;
  }

  public set(key: Key, value: Value): void {
    this.setMostRecentlyUsed(key, value);

    if (this.cache.size > this.capacity) {
      const oldestKeyResult = this.cache.keys().next();
      if (!oldestKeyResult.done) {
        this.cache.delete(oldestKeyResult.value);
      }
    }
  }

  public delete(key: Key): void {
    this.cache.delete(key);
  }
}

export default InMemoryLru;
//In JS Maps -> order of insertion is remembered, so the first key is always the oldest, so when get/set a key, we delete & add it again so as to keep it in the end (latest)
//LRU in JS -> https://x.com/dillon_mulroy/status/1967456043853926539?t=FYR6MYfWDQ55esGMifdsHw&s=08
