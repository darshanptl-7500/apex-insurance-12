/**
 * Minimal client-side CSV export used by the Reporting module's "Export CSV"
 * buttons. Avoids pulling in a library for what is a handful of rows.
 */
export function exportToCsv(filename: string, rows: Array<{ [key: string]: any }>): void {
  if (!rows || rows.length === 0) {
    return;
  }

  const headers = Object.keys(rows[0]);
  const escapeCell = (value: any): string => {
    const str = value === null || value === undefined ? '' : String(value);
    if (/[",\n]/.test(str)) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const lines = [
    headers.join(','),
    ...rows.map(row => headers.map(h => escapeCell(row[h])).join(','))
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
