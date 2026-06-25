import type { Item } from '../storage/types';

interface Props {
  item: Item;
}

export function ItemCard({ item }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        {item.category && (
          <span className="shrink-0 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {item.category}
          </span>
        )}
      </div>
      {item.location && (
        <p className="mt-1 text-sm text-gray-500">{item.location}</p>
      )}
    </div>
  );
}
