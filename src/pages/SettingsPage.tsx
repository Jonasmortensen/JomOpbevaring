import { type ChangeEvent, type FormEvent, useState } from 'react';

const SETTINGS_KEY = 'jom_settings';

interface Settings {
  token: string;
  owner: string;
  repo: string;
  filePath: string;
  branch: string;
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw
      ? (JSON.parse(raw) as Settings)
      : { token: '', owner: '', repo: '', filePath: 'data/items.json', branch: 'main' };
  } catch {
    return { token: '', owner: '', repo: '', filePath: 'data/items.json', branch: 'main' };
  }
}

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof Settings) => (e: ChangeEvent<HTMLInputElement>) =>
    setSettings(s => ({ ...s, [key]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('jom_settings_changed'));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Indstillinger</h2>
      <p className="text-sm text-gray-500 mb-4">
        Konfigurer GitHub-lagring. Dit token gemmes kun i denne browser.
      </p>

      {saved && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
          Indstillinger gemt.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub personlig adgangstoken
          </label>
          <input
            type="password"
            value={settings.token}
            onChange={set('token')}
            placeholder="ghp_..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
          <p className="mt-1 text-xs text-gray-400">
            Kræver <strong>Contents</strong>-tilladelse (læse &amp; skrive) på repositoryet.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ejer</label>
            <input
              type="text"
              value={settings.owner}
              onChange={set('owner')}
              placeholder="github-username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Repository</label>
            <input
              type="text"
              value={settings.repo}
              onChange={set('repo')}
              placeholder="JomOpbevaring"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gren</label>
            <input
              type="text"
              value={settings.branch}
              onChange={set('branch')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filsti</label>
            <input
              type="text"
              value={settings.filePath}
              onChange={set('filePath')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Gem indstillinger
        </button>
      </form>
    </div>
  );
}
