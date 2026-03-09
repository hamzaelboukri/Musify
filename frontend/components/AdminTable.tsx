'use client';

type Column = { key: string; label: string };
type AdminTableProps = {
  columns: Column[];
  data: Record<string, unknown>[];
  actions?: (row: Record<string, unknown>) => React.ReactNode;
};

export function AdminTable({ columns, data, actions }: AdminTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-left">
        <thead className="bg-musify-card">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-white/80 font-medium">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-4 py-3 text-white/80 font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t border-white/5 hover:bg-white/5">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-white/90">
                  {String(row[col.key] ?? '-')}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3">{actions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
