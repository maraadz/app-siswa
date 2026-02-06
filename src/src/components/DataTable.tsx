interface Column {
  key: string;
  label: string;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  emptyMessage?: string;
}

export default function DataTable({
  columns,
  data,
  emptyMessage = 'Belum ada data'
}: DataTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map(col => (
                <th key={col.key} style={{ width: col.width }}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-sm">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
