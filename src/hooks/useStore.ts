import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Item, Store, StorageAdapter, GitHubSettings } from '../storage/types';
import { GitHubAdapter } from '../storage/github';
import { LocalAdapter } from '../storage/local';

const SETTINGS_KEY = 'jom_settings';

export function loadSettings(): GitHubSettings | null {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as GitHubSettings) : null;
  } catch {
    return null;
  }
}

function createAdapter(): StorageAdapter {
  const s = loadSettings();
  if (s?.token && s?.owner && s?.repo) return new GitHubAdapter(s);
  return new LocalAdapter();
}

interface StoreContextValue {
  items: Item[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  isConfigured: boolean;
  locations: string[];
  categories: string[];
  addItem(draft: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<void>;
  reload(): void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [adapter, setAdapter] = useState<StorageAdapter>(createAdapter);
  const [store, setStore] = useState<Store>({ version: 1, items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adapter.load();
      setStore(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [adapter]);

  useEffect(() => { void loadData(); }, [loadData]);

  useEffect(() => {
    const handler = () => setAdapter(createAdapter());
    window.addEventListener('jom_settings_changed', handler);
    return () => window.removeEventListener('jom_settings_changed', handler);
  }, []);

  const addItem = useCallback(async (draft: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const item: Item = { ...draft, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
    const next: Store = { ...store, items: [...store.items, item] };
    setStore(next);
    setIsSaving(true);
    setError(null);
    try {
      await adapter.save(next);
    } catch (e) {
      setStore(store);
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  }, [adapter, store]);

  const locations = useMemo(
    () => [...new Set(store.items.map(i => i.location).filter(Boolean))].sort(),
    [store.items],
  );

  const categories = useMemo(
    () => [...new Set(store.items.map(i => i.category).filter(Boolean))].sort(),
    [store.items],
  );

  const isConfigured = useMemo(() => {
    const s = loadSettings();
    return !!(s?.token && s?.owner && s?.repo);
  }, [adapter]);

  const value: StoreContextValue = {
    items: store.items,
    isLoading,
    isSaving,
    error,
    isConfigured,
    locations,
    categories,
    addItem,
    reload: loadData,
  };

  return createElement(StoreContext.Provider, { value }, children);
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
