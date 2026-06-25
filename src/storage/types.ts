export interface Item {
  id: string;
  name: string;
  location: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  version: 1;
  items: Item[];
}

export interface StorageAdapter {
  load(): Promise<Store>;
  save(store: Store): Promise<void>;
}

export interface GitHubSettings {
  token: string;
  owner: string;
  repo: string;
  filePath: string;
  branch: string;
}
