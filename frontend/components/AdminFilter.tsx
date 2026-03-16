'use client';

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const ClearIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const FilterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
  </svg>
);

type AdminFilterProps = {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (v: string) => void;
  roleFilter?: { value: string; onChange: (v: string) => void };
  bannedFilter?: { value: string; onChange: (v: string) => void };
  resultCount?: number;
  totalCount?: number;
  onClear?: () => void;
};

export function AdminFilter({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  roleFilter,
  bannedFilter,
  resultCount,
  totalCount,
  onClear,
}: AdminFilterProps) {
  const hasFilters = searchValue || (roleFilter?.value && roleFilter.value !== 'all') || (bannedFilter?.value && bannedFilter.value !== 'all') || (bannedFilter?.value && bannedFilter.value !== '');
  const showClear = hasFilters && onClear;

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 border-b border-white/10 bg-white/5">
      <div className="relative flex-1 min-w-[200px]">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-musify-card border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-musify-teal/50"
        />
      </div>
      {roleFilter && (
        <div className="flex items-center gap-2">
          <FilterIcon className="w-4 h-4 text-white/50" />
          <select
            value={roleFilter.value}
            onChange={(e) => roleFilter.onChange(e.target.value)}
            className="px-4 py-2 rounded-xl bg-musify-card border border-white/10 text-white text-sm focus:outline-none focus:border-musify-teal/50"
          >
            <option value="all">All roles</option>
            <option value="USER">User</option>
            <option value="SINGER">Singer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      )}
      {bannedFilter && (
        <select
          value={bannedFilter.value}
          onChange={(e) => bannedFilter.onChange(e.target.value)}
          className="px-4 py-2 rounded-xl bg-musify-card border border-white/10 text-white text-sm focus:outline-none focus:border-musify-teal/50"
        >
          <option value="all">All status</option>
          <option value="yes">Banned</option>
          <option value="no">Active</option>
        </select>
      )}
      {resultCount !== undefined && totalCount !== undefined && (
        <span className="text-white/50 text-sm">
          {resultCount} of {totalCount} results
        </span>
      )}
      {showClear && (
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition text-sm"
        >
          <ClearIcon className="w-4 h-4" />
          Clear filters
        </button>
      )}
    </div>
  );
}
