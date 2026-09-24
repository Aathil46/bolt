import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { principalInterventions, type InterventionItem } from '@/data/principalMockData';
import {
  Target, CheckCircle2, Clock, Plus, Filter,
  ArrowRight, TrendingUp, AlertTriangle, X, Check,
} from 'lucide-react';

export function PrincipalInterventions() {
  const navigate = useNavigate();
  const [interventions, setInterventions] = useState<InterventionItem[]>(principalInterventions);
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state for logging a new intervention
  const [formProblem, setFormProblem] = useState('');
  const [formTarget, setFormTarget] = useState('');
  const [formAction, setFormAction] = useState('');
  const [formTeacher, setFormTeacher] = useState('Sarah Mitchell');

  const filtered = interventions.filter(item => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const inProgressCount = interventions.filter(i => i.status === 'in-progress').length;
  const completedCount = interventions.filter(i => i.status === 'completed').length;

  const handleAddIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProblem || !formAction) return;

    const newItem: InterventionItem = {
      id: `int-${Date.now()}`,
      problem: formProblem,
      targetType: 'class',
      targetName: formTarget || 'General Class Cohort',
      action: formAction,
      responsibleTeacher: formTeacher,
      status: 'in-progress',
      startDate: 'Today',
      outcome: 'Intervention plan active; pending follow-up review assessment.',
      measurableChange: 'Tracking initiated',
    };

    setInterventions([newItem, ...interventions]);
    setModalOpen(false);
    setFormProblem('');
    setFormTarget('');
    setFormAction('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ──── Header ────────────────────────────────────────── */}
      <PageHeader
        title="Action &amp; Intervention Status"
        description="Connect school learning problems to concrete instructional actions and track measurable outcomes."
        action={
          <Button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Log Action / Intervention</span>
          </Button>
        }
      />

      {/* ──── Core Workflow Flow Banner ─────────────────────── */}
      <div className="rounded-2xl border border-brand-200/80 bg-gradient-to-r from-brand-50/70 via-white to-brand-50/40 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Core Principal Direction: Identify → Act → Measure</h3>
            <p className="text-2xs text-slate-600 mt-0.5">
              Move beyond passive charts by monitoring remediation actions through to student concept recovery.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-brand-200 text-xs font-semibold text-brand-700 shadow-2xs">
            <Clock className="h-3.5 w-3.5 text-warning-500" />
            <span>{inProgressCount} Active</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-brand-200 text-xs font-semibold text-brand-700 shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-success-500" />
            <span>{completedCount} Resolved</span>
          </div>
        </div>
      </div>

      {/* ──── Filters ───────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Actions ({interventions.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('in-progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              statusFilter === 'in-progress'
                ? 'bg-warning-500 text-white shadow-xs font-bold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-success-600 text-white shadow-xs font-bold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/principal/weak-students')}
          className="text-xs text-slate-600"
        >
          View Weak Students Cohort
        </Button>
      </div>

      {/* ──── Lightweight Interventions Table / Cards ────────── */}
      <div className="space-y-4">
        {filtered.map(item => (
          <Card key={item.id} className="p-5 overflow-hidden transition-all hover:border-slate-300">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={item.status === 'completed' ? 'success' : 'warning'} size="sm" dot>
                    {item.status === 'completed' ? 'Resolved / Completed' : 'In Progress'}
                  </Badge>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                    Target: {item.targetName}
                  </span>
                  <span className="text-2xs text-slate-300">•</span>
                  <span className="text-2xs text-slate-500">Initiated: {item.startDate}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {item.problem}
                </h4>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs text-slate-700">
                  <p className="font-semibold text-slate-900 mb-0.5">Remediation Action:</p>
                  <p className="leading-relaxed">{item.action}</p>
                  <p className="text-2xs text-slate-500 mt-1.5">
                    Lead Educator: <strong className="text-slate-700">{item.responsibleTeacher}</strong>
                  </p>
                </div>
              </div>

              {/* Outcome or Measurable Change */}
              <div className="lg:w-72 flex-shrink-0 rounded-xl border border-slate-200 bg-white p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <TrendingUp className="h-3.5 w-3.5 text-brand-600" />
                  <span>Observed Outcome</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.outcome || 'Data collection in progress.'}
                </p>
                {item.measurableChange && (
                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-2xs">
                    <span className="text-slate-400">Measured Delta:</span>
                    <span className="font-bold text-success-600 bg-success-50 px-2 py-0.5 rounded-full border border-success-200">
                      {item.measurableChange}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ──── Log Intervention Modal ─────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Log Action / Intervention</h3>
            <p className="text-xs text-slate-500 mb-4">
              Document a concrete remediation step for a learning problem.
            </p>

            <form onSubmit={handleAddIntervention} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Problem Identified *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Synthetic Division learning gaps in Grade 10"
                  value={formProblem}
                  onChange={e => setFormProblem(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target (Class, Students, or Concept)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Algebra II - Period 3"
                  value={formTarget}
                  onChange={e => setFormTarget(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Action / Intervention Taken *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the instructional action, review quiz, peer tutoring, or adapted pacing..."
                  value={formAction}
                  onChange={e => setFormAction(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Responsible Teacher
                </label>
                <select
                  value={formTeacher}
                  onChange={e => setFormTeacher(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Sarah Mitchell">Sarah Mitchell (Algebra II, Geometry, Pre-Calc)</option>
                  <option value="Emily Rodriguez">Emily Rodriguez (Algebra I)</option>
                  <option value="Michael Torres">Michael Torres (Statistics)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Log Intervention
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
