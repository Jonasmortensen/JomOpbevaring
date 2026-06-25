import type { Store, StorageAdapter, GitHubSettings } from './types';

const EMPTY_STORE: Store = { version: 1, items: [] };

// btoa/atob don't handle non-ASCII (e.g. Danish æøå) — use this pair instead
function encodeBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function decodeBase64(b64: string): string {
  return decodeURIComponent(escape(atob(b64.replace(/\n/g, ''))));
}

export class GitHubAdapter implements StorageAdapter {
  private sha: string | null = null;

  constructor(private settings: GitHubSettings) {}

  private get apiUrl() {
    const { owner, repo, filePath } = this.settings;
    return `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  }

  private get headers(): HeadersInit {
    return {
      Authorization: `Bearer ${this.settings.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  async load(): Promise<Store> {
    const res = await fetch(`${this.apiUrl}?ref=${this.settings.branch}`, {
      headers: this.headers,
    });

    if (res.status === 404) return { ...EMPTY_STORE };

    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { message?: string };
      throw new Error(`GitHub load failed (${res.status}): ${err.message ?? res.statusText}`);
    }

    const data = await res.json() as { sha: string; content: string };
    this.sha = data.sha;
    return JSON.parse(decodeBase64(data.content)) as Store;
  }

  async save(store: Store): Promise<void> {
    const body: Record<string, unknown> = {
      message: `chore: update items`,
      content: encodeBase64(JSON.stringify(store, null, 2)),
      branch: this.settings.branch,
    };

    if (this.sha) body.sha = this.sha;

    const res = await fetch(this.apiUrl, {
      method: 'PUT',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { message?: string };
      throw new Error(`GitHub save failed (${res.status}): ${err.message ?? res.statusText}`);
    }

    const data = await res.json() as { content: { sha: string } };
    this.sha = data.content.sha;
  }
}
