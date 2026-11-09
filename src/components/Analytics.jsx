import React, { useState } from 'react';
import { useTests } from '../context/TestContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Area, AreaChart, Dot
} from 'recharts';

const CustomTooltip = ({ active, payload, label, viewMode }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__title">{d?.name}</div>
      <div className="chart-tooltip__date">{d?.dateLabel}</div>
      <div className="chart-tooltip__score">
        {viewMode === 'pct' ? `${payload[0]?.value?.toFixed(1)}%` : `${d?.marks}/${d?.maxMarks}`}
      </div>
      {d?.delta !== null && d?.delta !== undefined && (
        <div className={`chart-tooltip__delta ${d.delta > 0 ? 'up' : d.delta < 0 ? 'down' : 'neutral'}`}>
          {d.delta > 0 ? '▲' : d.delta < 0 ? '▼' : '—'} {Math.abs(d.delta).toFixed(1)}
          {viewMode === 'pct' ? '%' : ' marks'} vs prev
        </div>
      )}
      {d?.gateScore && <div className="chart-tooltip__gate">GATE Score: {d.gateScore}</div>}
    </div>
  );
};

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  if (!cx || !cy) return null;
  return (
    <circle
      cx={cx} cy={cy} r={5}
      fill={payload.delta > 0 ? '#22c55e' : payload.delta < 0 ? '#ef4444' : '#8b5cf6'}
      stroke="var(--bg-card)"
      strokeWidth={2}
    />
  );
};

const Analytics = () => {
  const { tests } = useTests();
  const [viewMode, setViewMode] = useState('pct'); // 'marks' or 'pct'

  if (tests.length === 0) {
    return (
      <div className="analytics">
        <div className="page-header"><h1>Performance Analytics</h1></div>
        <div className="empty-state"><p>Add mock tests to see analytics and graphs.</p></div>
      </div>
    );
  }

  const data = tests.map((t, i) => {
    const pct = (t.marks / t.maxMarks) * 100;
    const prev = i > 0 ? tests[i - 1] : null;
    const prevPct = prev ? (prev.marks / prev.maxMarks) * 100 : null;
    const prevMarks = prev ? prev.marks : null;
    return {
      index: i + 1,
      name: t.name,
      date: t.date,
      dateLabel: new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      marks: t.marks,
      maxMarks: t.maxMarks,
      pct: parseFloat(pct.toFixed(2)),
      gateScore: t.gateScore || null,
      delta: viewMode === 'pct'
        ? (prevPct !== null ? parseFloat((pct - prevPct).toFixed(2)) : null)
        : (prevMarks !== null ? parseFloat((t.marks - prevMarks).toFixed(2)) : null),
    };
  });

  // Recompute delta based on current viewMode
  const chartData = tests.map((t, i) => {
    const pct = (t.marks / t.maxMarks) * 100;
    const prev = i > 0 ? tests[i - 1] : null;
    const prevPct = prev ? (prev.marks / prev.maxMarks) * 100 : null;
    return {
      index: i + 1,
      name: t.name,
      date: t.date,
      dateLabel: new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      marks: t.marks,
      maxMarks: t.maxMarks,
      pct: parseFloat(pct.toFixed(2)),
      gateScore: t.gateScore || null,
      delta: viewMode === 'pct'
        ? (prevPct !== null ? parseFloat((pct - prevPct).toFixed(2)) : null)
        : (prev !== null ? parseFloat((t.marks - prev.marks).toFixed(2)) : null),
      value: viewMode === 'pct' ? parseFloat(pct.toFixed(2)) : t.marks,
    };
  });

  const hasGateScores = tests.some(t => t.gateScore);
  const gateData = tests
    .map((t, i) => ({ index: i + 1, name: t.name, gateScore: t.gateScore || null }))
    .filter(t => t.gateScore);

  const avg = viewMode === 'pct'
    ? chartData.reduce((s, d) => s + d.pct, 0) / chartData.length
    : chartData.reduce((s, d) => s + d.marks, 0) / chartData.length;

  const xKey = tests.length <= 15 ? 'name' : 'index';

  return (
    <div className="analytics">
      <div className="page-header">
        <h1>Performance Analytics</h1>
        <p className="page-subtitle">Visualize your GATE preparation progress</p>
      </div>

      <div className="chart-card">
        <div className="chart-card__header">
          <h2>Score Progression</h2>
          <div className="view-toggle">
            <button
              className={`view-toggle__btn ${viewMode === 'pct' ? 'active' : ''}`}
              onClick={() => setViewMode('pct')}
            >
              Percentage
            </button>
            <button
              className={`view-toggle__btn ${viewMode === 'marks' ? 'active' : ''}`}
              onClick={() => setViewMode('marks')}
            >
              Raw Marks
            </button>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 60 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey={xKey}
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                angle={-35}
                textAnchor="end"
                interval={0}
                height={70}
              />
              <YAxis
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                domain={viewMode === 'pct' ? [0, 100] : ['auto', 'auto']}
                tickFormatter={v => viewMode === 'pct' ? `${v}%` : v}
              />
              <Tooltip content={<CustomTooltip viewMode={viewMode} />} />
              <ReferenceLine
                y={avg}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                label={{ value: `Avg ${avg.toFixed(1)}${viewMode === 'pct' ? '%' : ''}`, fill: '#f59e0b', fontSize: 11, position: 'right' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                fill="url(#scoreGrad)"
                dot={<CustomDot />}
                activeDot={{ r: 7, fill: '#8b5cf6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-legend">
          <div className="legend-item"><span className="legend-dot" style={{ background: '#22c55e' }}></span>Improvement</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: '#ef4444' }}></span>Decline</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: '#8b5cf6' }}></span>First test</div>
          <div className="legend-item"><span className="legend-line" style={{ borderColor: '#f59e0b' }}></span>Average</div>
        </div>
      </div>

      {hasGateScores && (
        <div className="chart-card">
          <div className="chart-card__header">
            <h2>GATE Score Progression</h2>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={gateData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="index" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
                  formatter={(v, n, p) => [v, 'GATE Score']}
                  labelFormatter={(l) => gateData[l - 1]?.name || `Test ${l}`}
                />
                <Line
                  type="monotone"
                  dataKey="gateScore"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: '#22c55e', stroke: 'var(--bg-card)', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="delta-section">
        <h2>Test-by-Test Change</h2>
        <div className="delta-list">
          {chartData.slice(1).map((d, i) => (
            <div key={d.index} className={`delta-item ${d.delta > 0 ? 'delta-item--up' : d.delta < 0 ? 'delta-item--down' : 'delta-item--neutral'}`}>
              <div className="delta-item__arrow">{d.delta > 0 ? '▲' : d.delta < 0 ? '▼' : '—'}</div>
              <div className="delta-item__info">
                <span className="delta-item__name">{d.name}</span>
                <span className="delta-item__val">
                  {d.delta > 0 ? '+' : ''}{d.delta?.toFixed(1)}{viewMode === 'pct' ? '%' : ' marks'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
