import { type FormEvent, useState } from 'react';
import { AutocompleteInput } from '../components/AutocompleteInput';
import { useStore } from '../hooks/useStore';

export function AddItemPage() {
  const { addItem, isSaving, error, locations, categories } = useStore();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await addItem({ name: name.trim(), location: location.trim(), category: category.trim() });
    setName('');
    setLocation('');
    setCategory('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Tilføj genstand</h2>

      {success && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
          Gemt!
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      <form onSubmit={e => { void handleSubmit(e); }} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Navn <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="f.eks. Stiksav"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Placering <span className="text-red-400">*</span>
          </label>
          <AutocompleteInput
            id="location"
            value={location}
            onChange={setLocation}
            suggestions={locations}
            placeholder="f.eks. Skur > Øverste hylde > Rød kasse"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Kategori
          </label>
          <AutocompleteInput
            id="category"
            value={category}
            onChange={setCategory}
            suggestions={categories}
            placeholder="f.eks. Elværktøj"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? 'Gemmer...' : 'Tilføj genstand'}
        </button>
      </form>
    </div>
  );
}
