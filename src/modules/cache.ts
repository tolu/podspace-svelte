function generateKey(key: string) {
  return encodeURIComponent(key);
}

const get = (key: string) => {
  const item = localStorage.getItem(generateKey(key));
  if (item) {
    console.info(`Cache hit on ${key}`);
    return JSON.parse(item);
  }
  console.warn(`Cache miss on ${key}`);
  return null;
};

const set = (key: string, data: any) => {
  localStorage.setItem(generateKey(key), JSON.stringify(data));
};

export const createCache = (key: string) => {
  const _key = generateKey(key + "-");
  return {
    get: (partialKey: string) => get(generateKey(_key + partialKey)),
    set: (partialKey: string, value: any) =>
      set(generateKey(_key + partialKey), value)
  };
};
