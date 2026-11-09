import React, { useState } from 'react';
import { TestProvider, useTests } from './context/TestContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddTest from './components/AddTest';
import History from './components/History';
import Analytics from './components/Analytics';
import './App.css';

const AppContent = () => {
  const { activeSection } = useTests();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = {
    dashboard: <Dashboard />,
    add: <AddTest />,
    history: <History />,
    analytics: <Analytics />,
  };

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-wrapper">
        <Header onMenuClick={() => setSidebarOpen(o => !o)} />
        <main className="main-content">
          {sections[activeSection] || sections.dashboard}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <TestProvider>
      <AppContent />
    </TestProvider>
  );
}

export default App;
