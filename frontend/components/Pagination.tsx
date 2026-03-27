'use client';

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  loading?: boolean;
  showItemCount?: boolean;
};

export function Pagination({
  currentPage,
  totalItems,
  perPage,
  onPageChange,
  itemLabel = 'items',
  loading = false,
  showItemCount = true,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  if (totalItems <= 0 || totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-white/10">
      {showItemCount && (
        <p className="text-musify-text-muted text-[13px] order-2 sm:order-1">
          Showing <span className="text-white/80 font-medium">{start}–{end}</span> of <span className="text-white/80 font-medium">{totalItems.toLocaleString()}</span> {itemLabel}
        </p>
      )}
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed transition border border-white/5 hover:border-white/10"
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <div className="flex items-center gap-1 px-2">
          <span className="px-3 py-2 rounded-lg bg-musify-teal/20 text-musify-teal text-[13px] font-semibold min-w-[88px] text-center">
            {currentPage} / {totalPages}
          </span>
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || loading}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed transition border border-white/5 hover:border-white/10"
          aria-label="Next page"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
