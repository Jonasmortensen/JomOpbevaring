import type { Store, StorageAdapter } from './types';

const KEY = 'jom_store';
const EMPTY: Store = { version: 1, items: [] };

export class LocalAdapter implements StorageAdapter {
  async load(): Promise<Store> {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Store) : { ...EMPTY };
    } catch {
      return { ...EMPTY };
    }
  }

  async save(store: Store): Promise<void> {
    localStorage.setItem(KEY, JSON.stringify(store));
  }
}
