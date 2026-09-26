import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CheckCircle, TrendingDown, TrendingUp, ShieldAlert } from 'lucide-react';
import { classes, teachers } from '@/data/mockData';
import { principalWeakStudents } from '@/data/principalMockData';

const alerts = [
  {
    id: 'a1',
    label: 'Weak students',
    class: 'Algebra I · P2',
    metric: '3 → 6',
    link: '/principal/classes?grade=Grade%209&class=c5',
  },
  {
    id: 'a2',
    label: 'Concept gap',
    class: 'Algebra II · P3',
    metric: 'Vertex Form 42%',
    link: '/principal/weak-students?class=c1',
  },
  {
    id: 'a3',
    label: 'Average dropped',
    class: 'Geometry · P5',
    metric: '74% → 69%',
    link: '/principal/classes?grade=Grade%209&class=c2',
  },
  {
    id: 'a4',
    label: 'Incomplete',
    class: 'Pre-Calculus · P7',
    metric: '6 pending',
    link: '/principal/assessments',
  },
];

const recentChanges = [
  { id: 'r1', icon: 'up',   text: 'Pre-Calculus average +4% → 85%',             link: '/principal/classes?grade=Grade%2011&class=c3' },
  { id: 'r2', icon: 'up',   text: '3 students exited Geometry support group',    link: '/principal/weak-students?class=c2' },
  { id: 'r3', icon: 'down', text: 'Algebra I average declined to 68%',           link: '/principal/classes?grade=Grade%209&class=c5' },
  { id: 'r4', icon: 'done', text: 'Quadratic Equations: 28/28 · 82% pass rate', link: '/principal/assessments' },
];

export function PrincipalDashboard() {
  const navigate = useNavigate();

  const totalStudents = classes.reduce((s, c) => s + c.studentCount, 0);

  const snapshot = [
    { label: 'Students',    value: totalStudents },
    { label: 'Teachers',    value: teachers.length },
    { label: 'Classes',     value: classes.length },
    { label: 'Avg Score',   value: '76%' },
    { label: 'Pass Rate',   value: '80%' },
    { label: 'Completion',  value: '91%' },
  ];

  return (
    <div className="space-y-7">

      {/* Header */}
      <div>
        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-xs text-slate-400 mt-0.5">Oakridge High School · Sep 2025</p>
      </div>

      {/* Snapshot row */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
        {snapshot.map((s) => (
          <div key={s.label} className="bg-white px-4 py-3.5">
            <p className="text-xl font-bold text-slate-900 leading-none">{s.value}</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-wide mt-1.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Learning health */}
      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3">
        <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">School Health</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">Needs Attention</span>
          </div>
          <span className="text-xs text-slate-500">2 classes below benchmark · 14 students with concept gaps</span>
        </div>
        <button onClick={() => navigate('/principal/insights')} className="text-xs font-semibold text-teal-700 hover:text-teal-900 shrink-0 inline-flex items-center gap-1">
          AI Review <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Alerts & Recent side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Important Alerts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Important Alerts</h2>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{alerts.length} items</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
            {alerts.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => navigate(a.link)}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 group"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-900">{a.label}</span>
                  <span className="text-xs text-slate-400 mx-1.5">·</span>
                  <span className="text-xs text-slate-600">{a.class}</span>
                </div>
                <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded shrink-0">{a.metric}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-teal-600 shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Changes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Recent Changes</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
            {recentChanges.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => navigate(c.link)}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 group"
              >
                <span className="shrink-0">
                  {c.icon === 'up'   && <TrendingUp   className="h-3.5 w-3.5 text-emerald-500" />}
                  {c.icon === 'down' && <TrendingDown  className="h-3.5 w-3.5 text-red-500" />}
                  {c.icon === 'done' && <CheckCircle   className="h-3.5 w-3.5 text-teal-500" />}
                </span>
                <span className="flex-1 text-xs text-slate-700 font-medium">{c.text}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-teal-600 shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
