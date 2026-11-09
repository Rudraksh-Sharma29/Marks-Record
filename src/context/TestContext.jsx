import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadTests, saveTests } from '../utils/storage';

const TestContext = createContext(null);

export const useTests = () => useContext(TestContext);

export const TestProvider = ({ children }) => {
  const [tests, setTests] = useState(() => loadTests());
  const [activeSection, setActiveSection] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('gate_theme') || 'dark');
  const [editingTest, setEditingTest] = useState(null);

  useEffect(() => {
    saveTests(tests);
  }, [tests]);

  useEffect(() => {
    localStorage.setItem('gate_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const addTest = useCallback((test) => {
    const newTest = { ...test, id: Date.now() + Math.random() };
    setTests(prev => {
      const updated = [...prev, newTest].sort((a, b) => new Date(a.date) - new Date(b.date));
      return updated;
    });
  }, []);

  const updateTest = useCallback((id, updatedTest) => {
    setTests(prev => prev.map(t => t.id === id ? { ...updatedTest, id } : t)
      .sort((a, b) => new Date(a.date) - new Date(b.date)));
  }, []);

  const deleteTest = useCallback((id) => {
    setTests(prev => prev.filter(t => t.id !== id));
  }, []);

  const replaceAll = useCallback((newTests) => {
    const sorted = [...newTests].sort((a, b) => new Date(a.date) - new Date(b.date));
    setTests(sorted);
  }, []);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const stats = React.useMemo(() => {
    if (tests.length === 0) return null;
    const percentages = tests.map(t => (t.marks / t.maxMarks) * 100);
    const latest = tests[tests.length - 1];
    const previous = tests.length > 1 ? tests[tests.length - 2] : null;
    const latestPct = (latest.marks / latest.maxMarks) * 100;
    const prevPct = previous ? (previous.marks / previous.maxMarks) * 100 : null;
    return {
      total: tests.length,
      latestScore: latest.marks,
      latestMaxMarks: latest.maxMarks,
      latestPct: latestPct.toFixed(1),
      highestPct: Math.max(...percentages).toFixed(1),
      highestTest: tests[percentages.indexOf(Math.max(...percentages))],
      avgPct: (percentages.reduce((a, b) => a + b, 0) / percentages.length).toFixed(1),
      previousScore: previous ? previous.marks : null,
      previousMaxMarks: previous ? previous.maxMarks : null,
      previousPct: prevPct ? prevPct.toFixed(1) : null,
      improvement: prevPct !== null ? (latestPct - prevPct).toFixed(1) : null,
    };
  }, [tests]);

  return (
    <TestContext.Provider value={{
      tests, addTest, updateTest, deleteTest, replaceAll,
      activeSection, setActiveSection,
      theme, toggleTheme,
      editingTest, setEditingTest,
      stats,
    }}>
      {children}
    </TestContext.Provider>
  );
};
