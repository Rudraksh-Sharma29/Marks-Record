const STORAGE_KEY = 'gate_cs_tracker_tests';

export const loadTests = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveTests = (tests) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
  } catch (e) {
    console.error('Failed to save tests:', e);
  }
};

export const exportToJSON = (tests) => {
  const blob = new Blob([JSON.stringify(tests, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gate_cs_tracker_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToCSV = (tests) => {
  const headers = ['Test No', 'Test Name', 'Date', 'Marks Obtained', 'Maximum Marks', 'Percentage', 'GATE Score', 'Rank', 'Remarks'];
  const rows = tests.map((t, i) => [
    i + 1,
    t.name,
    t.date,
    t.marks,
    t.maxMarks,
    ((t.marks / t.maxMarks) * 100).toFixed(2),
    t.gateScore || '',
    t.rank || '',
    t.remarks || '',
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gate_cs_tracker_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data)) resolve(data);
        else reject(new Error('Invalid JSON format'));
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.readAsText(file);
  });
};

export const importFromCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const lines = e.target.result.split('\n').filter(Boolean);
        const rows = lines.slice(1).map(line => {
          const cols = line.split(',').map(c => c.replace(/^"|"$/g, '').replace(/""/g, '"'));
          return {
            id: Date.now() + Math.random(),
            name: cols[1] || '',
            date: cols[2] || '',
            marks: parseFloat(cols[3]) || 0,
            maxMarks: parseFloat(cols[4]) || 100,
            gateScore: cols[6] || '',
            rank: cols[7] || '',
            remarks: cols[8] || '',
          };
        });
        resolve(rows);
      } catch {
        reject(new Error('Invalid CSV file'));
      }
    };
    reader.readAsText(file);
  });
};
