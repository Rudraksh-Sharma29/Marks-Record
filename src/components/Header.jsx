import React, { useRef } from 'react';
import { useTests } from '../context/TestContext';
import { exportToCSV, exportToJSON, importFromJSON, importFromCSV } from '../utils/storage';
import { Download, Upload, FileJson, FileSpreadsheet, Menu } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const { tests, replaceAll, activeSection } = useTests();
  const jsonRef = useRef();
  const csvRef = useRef();

  const titles = {
    dashboard: 'Dashboard',
    add: 'Add Mock Test',
    history: 'Test History',
    analytics: 'Performance Analytics',
  };

  const handleImport = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imported = type === 'json' ? await importFromJSON(file) : await importFromCSV(file);
      if (window.confirm(`Import ${imported.length} test(s)? This will merge with existing data.`)) {
        replaceAll(imported);
      }
    } catch (err) {
      alert(`Import failed: ${err.message}`);
    }
    e.target.value = '';
  };

  return (
    <header className="header">
      <div className="header__left">
        <button className="hamburger" onClick={onMenuClick} title="Menu">
          <Menu size={20} />
        </button>
        <h2 className="header__title">{titles[activeSection] || ''}</h2>
      </div>

      <div className="header__actions">
        <div className="header__export-group">
          <span className="header__label">Export</span>
          <button className="icon-action-btn" onClick={() => exportToJSON(tests)} title="Export JSON" disabled={!tests.length}>
            <FileJson size={16} />
            <span>JSON</span>
          </button>
          <button className="icon-action-btn" onClick={() => exportToCSV(tests)} title="Export CSV" disabled={!tests.length}>
            <FileSpreadsheet size={16} />
            <span>CSV</span>
          </button>
        </div>

        <div className="header__export-group">
          <span className="header__label">Import</span>
          <button className="icon-action-btn" onClick={() => jsonRef.current.click()} title="Import JSON">
            <Upload size={16} />
            <span>JSON</span>
          </button>
          <button className="icon-action-btn" onClick={() => csvRef.current.click()} title="Import CSV">
            <Upload size={16} />
            <span>CSV</span>
          </button>
        </div>

        <input ref={jsonRef} type="file" accept=".json" style={{ display: 'none' }} onChange={e => handleImport(e, 'json')} />
        <input ref={csvRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={e => handleImport(e, 'csv')} />
      </div>
    </header>
  );
};

export default Header;
