import React from 'react';
import { useTests } from '../context/TestContext';
import {
  LayoutDashboard, PlusCircle, History, BarChart2, Moon, Sun, GraduationCap
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'add', label: 'Add Mock Test', icon: PlusCircle },
  { id: 'history', label: 'Test History', icon: History },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const { activeSection, setActiveSection, theme, toggleTheme } = useTests();

  const handleNav = (id) => {
    setActiveSection(id);
    onClose && onClose();
  };

  return (
    <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar__logo">
        <GraduationCap size={24} />
        <span>GATE CS Tracker</span>
      </div>

      <nav className="sidebar__nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`sidebar__nav-item ${activeSection === id ? 'sidebar__nav-item--active' : ''}`}
            onClick={() => handleNav(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
