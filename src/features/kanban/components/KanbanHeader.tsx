import { SearchBar } from './SearchBar';

interface KanbanHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function KanbanHeader({ query, onQueryChange }: KanbanHeaderProps) {
  return (
    <header className="app__header">
      <h1 className="app__title">Your tasks</h1>
      <SearchBar value={query} onChange={onQueryChange} />
    </header>
  );
}
