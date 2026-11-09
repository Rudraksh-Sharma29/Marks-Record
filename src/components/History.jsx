import React, { useState } from 'react';
import { useTests } from '../context/TestContext';
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

const History = () => {
  const { tests, deleteTest, setEditingTest, setActiveSection } = useTests();
  const [sortField, setSortField] = useState('index');
  const [sortDir, setSortDir] = useState('asc');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const sorted = [...tests].map((t, i) => ({ ...t, index: i + 1 })).sort((a, b) => {
    let av = a[sortField], bv = b[sortField];
    if (sortField === 'pct') { av = a.marks / a.maxMarks; bv = b.marks / b.maxMarks; }
    if (sortField === 'date') { av = new Date(a.date); bv = new Date(b.date); }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleEdit = (test) => {
    setEditingTest(test);
    setActiveSection('add');
  };

  const handleDelete = (id) => {
    deleteTest(id);
    setConfirmDelete(null);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="sort-icon">↕</span>;
    return sortDir === 'asc' ? <ChevronUp size={13} className="sort-icon--active" /> : <ChevronDown size={13} className="sort-icon--active" />;
  };

  if (tests.length === 0) {
    return (
      <div className="history">
        <div className="page-header">
          <h1>Test History</h1>
        </div>
        <div className="empty-state">
          <p>No mock tests recorded yet.</p>
          <button className="btn btn--primary" onClick={() => setActiveSection('add')}>Add First Test</button>
        </div>
      </div>
    );
  }

  return (
    <div className="history">
      <div className="page-header">
        <h1>Test History</h1>
        <p className="page-subtitle">{tests.length} mock test{tests.length !== 1 ? 's' : ''} recorded</p>
      </div>

      <div className="table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              {[
                { field: 'index', label: '#' },
                { field: 'name', label: 'Test Name' },
                { field: 'date', label: 'Date' },
                { field: 'marks', label: 'Marks' },
                { field: 'maxMarks', label: 'Max' },
                { field: 'pct', label: '%' },
                { field: 'gateScore', label: 'GATE Score' },
                { field: 'rank', label: 'Rank' },
                { field: 'remarks', label: 'Remarks' },
              ].map(col => (
                <th key={col.field} onClick={() => handleSort(col.field)} className="sortable">
                  {col.label} <SortIcon field={col.field} />
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) => {
              const pct = ((t.marks / t.maxMarks) * 100).toFixed(1);
              return (
                <tr key={t.id}>
                  <td className="td-num">{t.index}</td>
                  <td className="td-name">{t.name}</td>
                  <td className="td-date">
                    {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>{t.marks}</td>
                  <td>{t.maxMarks}</td>
                  <td>
                    <span className={`pct-badge ${parseFloat(pct) >= 60 ? 'good' : parseFloat(pct) >= 40 ? 'avg' : 'low'}`}>
                      {pct}%
                    </span>
                  </td>
                  <td>{t.gateScore || '—'}</td>
                  <td>{t.rank || '—'}</td>
                  <td className="td-remarks">{t.remarks || '—'}</td>
                  <td>
                    <div className="action-btns">
                      <button className="icon-btn icon-btn--edit" onClick={() => handleEdit(t)} title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button className="icon-btn icon-btn--delete" onClick={() => setConfirmDelete(t.id)} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Test?</h3>
            <p>This action cannot be undone. The test record will be permanently removed.</p>
            <div className="modal-actions">
              <button className="btn btn--ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn--danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
