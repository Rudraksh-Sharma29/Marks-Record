import React from 'react';
import { useTests } from '../context/TestContext';
import { TrendingUp, TrendingDown, Minus, Award, Target, BarChart3, ClipboardList } from 'lucide-react';

const StatCard = ({ label, value, sub, icon: Icon, trend, color }) => (
  <div className={`stat-card stat-card--${color}`}>
    <div className="stat-card__header">
      <span className="stat-card__label">{label}</span>
      <div className={`stat-card__icon stat-card__icon--${color}`}>
        <Icon size={18} />
      </div>
    </div>
    <div className="stat-card__value">{value}</div>
    {sub && <div className="stat-card__sub">{sub}</div>}
    {trend !== undefined && trend !== null && (
      <div className={`stat-card__trend ${parseFloat(trend) > 0 ? 'trend--up' : parseFloat(trend) < 0 ? 'trend--down' : 'trend--neutral'}`}>
        {parseFloat(trend) > 0 ? <TrendingUp size={13} /> : parseFloat(trend) < 0 ? <TrendingDown size={13} /> : <Minus size={13} />}
        <span>{parseFloat(trend) > 0 ? '+' : ''}{trend}% vs previous</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const { tests, stats, setActiveSection } = useTests();

  if (!stats) {
    return (
      <div className="dashboard__empty">
        <GraduationCapIcon />
        <h2>No mock tests yet</h2>
        <p>Start tracking your GATE preparation by adding your first mock test.</p>
        <button className="btn btn--primary" onClick={() => setActiveSection('add')}>
          Add First Mock Test
        </button>
      </div>
    );
  }

  const recent = [...tests].reverse().slice(0, 5);

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Your GATE CS preparation at a glance</p>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Total Tests"
          value={stats.total}
          icon={ClipboardList}
          color="blue"
          sub="mock tests attempted"
        />
        <StatCard
          label="Latest Score"
          value={`${stats.latestScore}/${stats.latestMaxMarks}`}
          icon={Target}
          color="purple"
          sub={`${stats.latestPct}%`}
          trend={stats.improvement}
        />
        <StatCard
          label="Highest Score"
          value={`${stats.highestPct}%`}
          icon={Award}
          color="green"
          sub={stats.highestTest?.name}
        />
        <StatCard
          label="Average Score"
          value={`${stats.avgPct}%`}
          icon={BarChart3}
          color="orange"
          sub="across all tests"
        />
      </div>

      {stats.previousScore !== null && (
        <div className="improvement-banner">
          <div className={`improvement-banner__indicator ${parseFloat(stats.improvement) >= 0 ? 'up' : 'down'}`}>
            {parseFloat(stats.improvement) >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          </div>
          <div>
            <div className="improvement-banner__title">
              {parseFloat(stats.improvement) > 0
                ? `You improved by ${stats.improvement}% from your last test!`
                : parseFloat(stats.improvement) < 0
                  ? `You declined by ${Math.abs(stats.improvement)}% from your last test.`
                  : 'Your score is the same as your last test.'}
            </div>
            <div className="improvement-banner__sub">
              Previous: {stats.previousScore}/{stats.previousMaxMarks} ({stats.previousPct}%)
            </div>
          </div>
        </div>
      )}

      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Tests</h2>
          <button className="btn btn--ghost" onClick={() => setActiveSection('history')}>View All</button>
        </div>
        <div className="recent-list">
          {recent.map((t, i) => {
            const pct = ((t.marks / t.maxMarks) * 100).toFixed(1);
            return (
              <div key={t.id} className="recent-item">
                <div className="recent-item__num">#{tests.length - i}</div>
                <div className="recent-item__info">
                  <div className="recent-item__name">{t.name}</div>
                  <div className="recent-item__date">{new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
                <div className="recent-item__score">
                  <span className="recent-item__marks">{t.marks}/{t.maxMarks}</span>
                  <span className={`recent-item__pct ${parseFloat(pct) >= 60 ? 'good' : parseFloat(pct) >= 40 ? 'avg' : 'low'}`}>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const GraduationCapIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

export default Dashboard;
