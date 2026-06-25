import { useMemo, useState } from 'react';
import { ItemCard } from '../components/ItemCard';
import { SearchBar } from '../components/SearchBar';
import { useStore } from '../hooks/useStore';

export function SearchPage() {
  const { items, isLoading, error } = useStore();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      item =>
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <div className="space-y-4">
      <SearchBar value={query} onChange={setQuery} />

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {isLoading ? (
        <p className="text-center text-gray-400 py-12">Indlæser...</p>
      ) : results.length === 0 ? (
        <p className="text-center text-gray-400 py-12">
          {query ? 'Ingen genstande matcher din søgning.' : 'Ingen genstande endnu — tilføj din første!'}
        </p>
      ) : (
        <div className="space-y-2">
          {results.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
          <p className="text-xs text-center text-gray-300 pt-2">
            {results.length} af {items.length} genstand{items.length !== 1 ? 'e' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
