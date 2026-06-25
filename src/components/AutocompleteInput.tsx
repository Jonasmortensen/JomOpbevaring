import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

interface Props {
  id?: string;
  value: string;
  onChange(value: string): void;
  suggestions: string[];
  placeholder?: string;
  required?: boolean;
}

export function AutocompleteInput({ id, value, onChange, suggestions, placeholder, required }: Props) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = suggestions.filter(
    s => s.toLowerCase().includes(value.toLowerCase()) && s !== value,
  );
  const showDropdown = open && filtered.length > 0;

  const select = (s: string) => {
    onChange(s);
    setOpen(false);
    setHighlighted(-1);
  };

  const handleKey = (e: KeyboardEvent) => {
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, -1));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      select(filtered[highlighted]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        type="text"
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); setHighlighted(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showDropdown && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
          {filtered.map((s, i) => (
            <li
              key={s}
              onMouseDown={() => select(s)}
              className={`px-3 py-2 cursor-pointer text-sm ${
                i === highlighted ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
              }`}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
