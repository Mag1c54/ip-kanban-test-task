import { CloseIcon, SearchIcon } from '../../../shared/components/icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search">
      <SearchIcon className="search__icon" size={16} />
      <input
        className="search__input"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="поиск..."
        aria-label="Поиск задач по описанию или дате"
        autoComplete="off"
        spellCheck={false}
      />
      {value ? (
        <button
          className="search__clear"
          type="button"
          onClick={() => onChange('')}
          aria-label="Очистить поиск"
          title="Очистить поиск"
        >
          <CloseIcon size={12} />
        </button>
      ) : null}
    </div>
  );
}
