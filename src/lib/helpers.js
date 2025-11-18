// src/lib/helpers.js
export function toCSV(rows = [], columns = []) {
    // rows: [{a:1,b:2}, ...], columns: [{key:'a', label:'A'}, ...] optional
    if (!rows.length) return "";
  
    const keys = columns && columns.length ? columns.map(c => c.key) : Object.keys(rows[0]);
    const labels = columns && columns.length ? columns.map(c => c.label) : keys;
  
    const escape = (v) => {
      if (v === null || v === undefined) return "";
      const s = String(v);
      // escape quotes
      return `"${s.replace(/"/g, '""')}"`;
    };
  
    const header = labels.map(escape).join(",");
    const body = rows.map(r => keys.map(k => escape(r[k])).join(",")).join("\n");
    return header + "\n" + body;
  }
  
  export function downloadCSV(filename = "export.csv", csvString = "") {
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

