'use client';

type Column = {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
};
type AdminTableProps = {
  columns: Column[];
  data: Record<string, unknown>[];
  actions?: (row: Record<string, unknown>) => React.ReactNode;
};

export function AdminTable({ columns, data, actions }: AdminTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4 text-white/50 text-xs font-semibold uppercase tracking-widest">
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-6 py-4 text-white/50 text-xs font-semibold uppercase tracking-widest text-right">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
            >
              {columns.map((col) => {
                const value = row[col.key];
                const content = col.render ? col.render(value, row) : String(value ?? '-');
                return (
                  <td key={col.key} className="px-6 py-4 text-white/90 text-sm font-medium">
                    {content}
                  </td>
                );
              })}
              {actions && (
                <td className="px-6 py-4 text-right">{actions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-white/50 text-sm font-medium">No data to display</p>
        </div>
      )}
    </div>
  );
}
