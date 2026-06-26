import { type FormEvent, useState } from 'react';
import type { Item } from '../storage/types';
import { AutocompleteInput } from './AutocompleteInput';
import { useStore } from '../hooks/useStore';

interface Props {
  item: Item;
  onClose(): void;
}

export function EditModal({ item, onClose }: Props) {
  const { updateItem, isSaving, locations, categories } = useStore();
  const [name, setName] = useState(item.name);
  const [location, setLocation] = useState(item.location);
  const [category, setCategory] = useState(item.category);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateItem(item.id, { name: name.trim(), location: location.trim(), category: category.trim() });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 pb-4 sm:pb-0"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl w-full max-w-lg p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Rediger genstand</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Luk"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={e => { void handleSubmit(e); }} className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
              Navn <span className="text-red-400">*</span>
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700 mb-1">
              Placering <span className="text-red-400">*</span>
            </label>
            <AutocompleteInput
              id="edit-location"
              value={location}
              onChange={setLocation}
              suggestions={locations}
              placeholder="f.eks. Skur - Øverste hylde - Rød kasse"
              required
            />
          </div>

          <div>
            <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <AutocompleteInput
              id="edit-category"
              value={category}
              onChange={setCategory}
              suggestions={categories}
              placeholder="f.eks. Elværktøj"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Annuller
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Gemmer...' : 'Gem ændringer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
