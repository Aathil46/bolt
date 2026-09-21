import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/ui/EmptyState';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { ConfirmDialog } from '@/components/ui/StatusIndicator';
import { assessments, classes } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, FileText, Users, TrendingUp, Clock,
  Award, Search, Download, MoreVertical,
  ChevronDown, Eye, Send, Check,
} from 'lucide-react';

/* ─── Avatar colour palette ─────────────────────────────────── */
const AVATAR_COLORS = [
  { bg: 'bg-[#dbeafe]', text: 'text-[#1d4ed8]' }, // blue
  { bg: 'bg-[#fce7f3]', text: 'text-[#be185d]' }, // pink
  { bg: 'bg-[#d1fae5]', text: 'text-[#065f46]' }, // emerald
  { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' }, // amber
  { bg: 'bg-[#ede9fe]', text: 'text-[#5b21b6]' }, // violet
  { bg: 'bg-[#fee2e2]', text: 'text-[#991b1b]' }, // red
  { bg: 'bg-[#ccfbf1]', text: 'text-[#115e59]' }, // teal
  { bg: 'bg-[#ffedd5]', text: 'text-[#9a3412]' }, // orange
  { bg: 'bg-[#e0f2fe]', text: 'text-[#0369a1]' }, // sky
  { bg: 'bg-[#f0fdf4]', text: 'text-[#166534]' }, // green
];

/* ─── Richer student seed data ──────────────────────────────── */
interface StudentRow {
  id: string;
  name: string;
  initials: string;
  score: number | null;
  status: 'passed' | 'needs-support' | 'in-progress' | 'not-started';
  timeTaken: number | null; // minutes
  submittedOn: string | null;
}

const seedStudents: StudentRow[] = [
  { id: 's1',  name: 'Alex Johnson',  initials: 'AJ', score: 92, status: 'passed',        timeTaken: 38, submittedOn: 'Aug 28, 2024, 10:24 AM' },
  { id: 's2',  name: 'Maya Patel',    initials: 'MP', score: 81, status: 'passed',        timeTaken: 41, submittedOn: 'Aug 28, 2024, 11:02 AM' },
  { id: 's3',  name: 'Liam Smith',    initials: 'LS', score: 64, status: 'needs-support', timeTaken: 42, submittedOn: 'Aug 28, 2024, 11:18 AM' },
  { id: 's4',  name: 'Emma Davis',    initials: 'ED', score: 48, status: 'needs-support', timeTaken: 36, submittedOn: 'Aug 28, 2024, 11:45 AM' },
  { id: 's5',  name: 'Noah Wilson',   initials: 'NW', score: 56, status: 'needs-support', timeTaken: 39, submittedOn: 'Aug 28, 2024, 01:12 PM' },
  { id: 's6',  name: 'Sophia Reed',   initials: 'SR', score: 88, status: 'passed',        timeTaken: 35, submittedOn: 'Aug 28, 2024, 01:20 PM' },
  { id: 's7',  name: 'Daniel Kim',    initials: 'DT', score: 70, status: 'in-progress',   timeTaken: null, submittedOn: 'Aug 28, 2024, 02:05 PM' },
  { id: 's8',  name: 'Priya Kapoor',  initials: 'PK', score: null, status: 'in-progress',  timeTaken: null, submittedOn: null },
  { id: 's9',  name: 'James Miller',  initials: 'JM', score: null, status: 'not-started',  timeTaken: null, submittedOn: null },
  { id: 's10', name: 'Chloe Turner',  initials: 'CT', score: 77, status: 'passed',        timeTaken: 44, submittedOn: 'Aug 28, 2024, 02:30 PM' },
  { id: 's11', name: 'Ryan Cooper',   initials: 'RC', score: 91, status: 'passed',        timeTaken: 33, submittedOn: 'Aug 28, 2024, 02:50 PM' },
  { id: 's12', name: 'Olivia Grant',  initials: 'OG', score: 55, status: 'needs-support', timeTaken: 45, submittedOn: 'Aug 28, 2024, 03:10 PM' },
  { id: 's13', name: 'Ethan Brooks',  initials: 'EB', score: null, status: 'not-started',  timeTaken: null, submittedOn: null },
  { id: 's14', name: 'Ava Martinez',  initials: 'AM', score: 84, status: 'passed',        timeTaken: 40, submittedOn: 'Aug 28, 2024, 03:25 PM' },
  { id: 's15', name: 'Lucas Scott',   initials: 'LS', score: 73, status: 'passed',        timeTaken: 37, submittedOn: 'Aug 28, 2024, 03:45 PM' },
  { id: 's16', name: 'Mia Foster',    initials: 'MF', score: 60, status: 'needs-support', timeTaken: 43, submittedOn: 'Aug 28, 2024, 04:00 PM' },
  { id: 's17', name: 'Aiden Hayes',   initials: 'AH', score: 95, status: 'passed',        timeTaken: 29, submittedOn: 'Aug 28, 2024, 04:15 PM' },
  { id: 's18', name: 'Isabella Chen', initials: 'IC', score: 67, status: 'needs-support', timeTaken: 41, submittedOn: 'Aug 28, 2024, 04:30 PM' },
  { id: 's19', name: 'Jackson Bell',  initials: 'JB', score: null, status: 'in-progress',  timeTaken: null, submittedOn: null },
  { id: 's20', name: 'Zoey Adams',    initials: 'ZA', score: 82, status: 'passed',        timeTaken: 38, submittedOn: 'Aug 28, 2024, 04:55 PM' },
  { id: 's21', name: 'Sebastian Park',initials: 'SP', score: 76, status: 'passed',        timeTaken: 42, submittedOn: 'Aug 28, 2024, 05:10 PM' },
  { id: 's22', name: 'Harper King',   initials: 'HK', score: 58, status: 'needs-support', timeTaken: 45, submittedOn: 'Aug 28, 2024, 05:30 PM' },
  { id: 's23', name: 'Elijah Stone',  initials: 'ES', score: null, status: 'not-started',  timeTaken: null, submittedOn: null },
  { id: 's24', name: 'Scarlett Ross', initials: 'SR', score: 89, status: 'passed',        timeTaken: 36, submittedOn: 'Aug 28, 2024, 05:50 PM' },
  { id: 's25', name: 'Logan Hughes',  initials: 'LH', score: 71, status: 'passed',        timeTaken: 40, submittedOn: 'Aug 28, 2024, 06:00 PM' },
  { id: 's26', name: 'Nora Bennett',  initials: 'NB', score: 44, status: 'needs-support', timeTaken: 47, submittedOn: 'Aug 28, 2024, 06:15 PM' },
  { id: 's27', name: 'Carter Reed',   initials: 'CR', score: null, status: 'in-progress',  timeTaken: null, submittedOn: null },
  { id: 's28', name: 'Luna Ward',     initials: 'LW', score: 87, status: 'passed',        timeTaken: 34, submittedOn: 'Aug 28, 2024, 06:35 PM' },
];

type SortKey = 'recent' | 'az' | 'za' | 'highest' | 'lowest';
type TabKey  = 'all' | 'completed' | 'in-progress' | 'not-started';

const SORT_LABELS: Record<SortKey, string> = {
  recent:  'Recent Submission',
  az:      'A to Z (Name)',
  za:      'Z to A (Name)',
  highest: 'Highest Score',
  lowest:  'Lowest Score',
};

export function AssessmentDetail() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [tab,         setTab]         = useState<TabKey>('all');
  const [search,      setSearch]      = useState('');
  const [sortKey,     setSortKey]     = useState<SortKey>('recent');
  const [sortOpen,    setSortOpen]    = useState(false);
  const [showPublish, setShowPublish] = useState(false);

  /* ── find assessment ── */
  const assessment = assessments.find(a => a.id === assessmentId);
  if (!assessment) {
    return (
      <EmptyState
        icon={<FileText className="h-6 w-6" />}
        title="Assessment not found"
        action={
          <button
            onClick={() => navigate('/teacher/assessments')}
            className="h-9 px-4 rounded-xl bg-[#0d9488] text-white text-sm font-medium"
          >
            Back to Assessments
          </button>
        }
      />
    );
  }

  const cls = classes.find(c => c.id === assessment.classId);

  /* ── counts ── */
  const completedCount   = seedStudents.filter(s => s.status === 'passed' || s.status === 'needs-support').length;
  const inProgressCount  = seedStudents.filter(s => s.status === 'in-progress').length;
  const notStartedCount  = seedStudents.filter(s => s.status === 'not-started').length;
  const totalStudents    = seedStudents.length;
  const completionPct    = Math.round((completedCount / totalStudents) * 100);

  /* ── stats ── */
  const completedScores = seedStudents.filter(s => s.score !== null).map(s => s.score as number);
  const avgScore  = completedScores.length ? Math.round(completedScores.reduce((a, b) => a + b, 0) / completedScores.length) : 0;
  const passCount = seedStudents.filter(s => s.status === 'passed').length;
  const passRate  = Math.round((passCount / completedCount) * 100) || 0;

  /* ── filter by tab ── */
  const tabFiltered = useMemo(() => {
    if (tab === 'completed')    return seedStudents.filter(s => s.status === 'passed' || s.status === 'needs-support');
    if (tab === 'in-progress')  return seedStudents.filter(s => s.status === 'in-progress');
    if (tab === 'not-started')  return seedStudents.filter(s => s.status === 'not-started');
    return seedStudents;
  }, [tab]);

  /* ── filter by search ── */
  const searched = useMemo(() => {
    if (!search.trim()) return tabFiltered;
    return tabFiltered.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  }, [tabFiltered, search]);

  /* ── sort ── */
  const sorted = useMemo(() => {
    const arr = [...searched];
    if (sortKey === 'az')      return arr.sort((a, b) => a.name.localeCompare(b.name));
    if (sortKey === 'za')      return arr.sort((a, b) => b.name.localeCompare(a.name));
    if (sortKey === 'highest') return arr.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    if (sortKey === 'lowest')  return arr.sort((a, b) => (a.score ?? 999) - (b.score ?? 999));
    return arr; // recent = default order
  }, [searched, sortKey]);

  /* ── tab label helper ── */
  const tabCount = (t: TabKey) => {
    if (t === 'all')          return totalStudents;
    if (t === 'completed')    return completedCount;
    if (t === 'in-progress')  return inProgressCount;
    if (t === 'not-started')  return notStartedCount;
    return 0;
  };

  return (
    <div className="space-y-6 pb-10">

      {/* ──── Breadcrumb back link ──────────────────────────── */}
      <button
        onClick={() => navigate('/teacher/results')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Results &amp; Analytics
      </button>

      {/* ──── Assessment header card ────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Document icon */}
            <div className="h-12 w-12 rounded-xl bg-[#f0fdfa] border border-[#ccfbf1] flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-[#0d9488]" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-slate-900">{assessment.title}</h1>
                {assessment.status === 'published' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]/60">
                    Published
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    Draft
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span>{cls?.name ?? 'Class 8A'}</span>
                <span className="text-slate-300">|</span>
                <span>{totalStudents} students</span>
                <span className="text-slate-300">|</span>
                <span>{assessment.questionCount} questions</span>
                <span className="text-slate-300">|</span>
                <span>{assessment.duration} min</span>
                <span className="text-slate-300">|</span>
                <span>{assessment.publishedAt ?? 'Aug 28, 2024'}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              className="h-9 w-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (assessment.status === 'draft') setShowPublish(true);
              }}
              className="h-9 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Download Report
            </button>
            {assessment.status === 'draft' && (
              <button
                type="button"
                onClick={() => setShowPublish(true)}
                className="h-9 px-4 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
                Publish
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ──── 4 stat cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">

        {/* Average Score */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-[#f0fdfa] flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-[#0d9488]" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Average Score</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{avgScore}%</p>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-[#fef2f2] flex items-center justify-center flex-shrink-0">
            <Award className="h-5 w-5 text-[#dc2626]" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pass Rate</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{passRate}%</p>
          </div>
        </div>

        {/* Completed Students */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-[#f0fdfa] flex items-center justify-center flex-shrink-0">
            <Users className="h-5 w-5 text-[#0d9488]" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Completed Students</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{completedCount} / {totalStudents}</p>
            <p className="text-xs text-slate-400 mt-0.5">{completionPct}% completion</p>
          </div>
        </div>

        {/* In Progress */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-[#fffbeb] flex items-center justify-center flex-shrink-0">
            <Clock className="h-5 w-5 text-[#d97706]" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">In Progress</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{inProgressCount} students</p>
            <p className="text-xs text-slate-400 mt-0.5">{Math.round((inProgressCount / totalStudents) * 100)}% of class</p>
          </div>
        </div>

      </div>

      {/* ──── Student performance table ─────────────────────── */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">

        {/* Table toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          {/* Tabs */}
          <div className="flex items-center gap-1 flex-wrap">
            {(['all', 'completed', 'in-progress', 'not-started'] as TabKey[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); setSearch(''); }}
                className={cn(
                  'h-8 px-3 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap',
                  tab === t
                    ? 'bg-[#e6f7f5] text-[#0d9488] font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                {t === 'all'         ? `All Students (${tabCount(t)})`  :
                 t === 'completed'   ? `Completed (${tabCount(t)})`      :
                 t === 'in-progress' ? `In Progress (${tabCount(t)})`    :
                                      `Not Started (${tabCount(t)})`}
              </button>
            ))}
          </div>

          {/* Search + Sort + Export */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search */}
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-8 w-44 pl-8 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition-all"
              />
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="hidden sm:inline">Sort by</span>
              <Dropdown
                align="right"
                trigger={
                  <button
                    type="button"
                    className="h-8 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {SORT_LABELS[sortKey]}
                    {sortKey === 'recent' && <Check className="h-3.5 w-3.5 text-[#0d9488]" />}
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                }
              >
                {(Object.keys(SORT_LABELS) as SortKey[]).map(k => (
                  <DropdownItem
                    key={k}
                    onClick={() => setSortKey(k)}
                    icon={sortKey === k ? <Check className="h-3.5 w-3.5 text-[#0d9488]" /> : <span className="h-3.5 w-3.5" />}
                  >
                    {SORT_LABELS[k]}
                  </DropdownItem>
                ))}
              </Dropdown>
            </div>

            {/* Export */}
            <button
              type="button"
              className="h-8 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto overflow-y-auto max-h-[520px]">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                <th className="py-3 pl-5 pr-3 w-8">#</th>
                <th className="py-3 px-4 w-[28%]">Student</th>
                <th className="py-3 px-4 w-[10%]">Score</th>
                <th className="py-3 px-4 w-[14%]">Status</th>
                <th className="py-3 px-4 w-[12%]">Time Taken</th>
                <th className="py-3 px-4 w-[22%]">Submitted On</th>
                <th className="py-3 pr-5 pl-2 w-[14%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-14 text-slate-400">
                    No students match your search.
                  </td>
                </tr>
              ) : (
                sorted.map((student, idx) => {
                  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  return (
                    <tr
                      key={student.id}
                      className="group hover:bg-slate-50/60 transition-colors"
                    >
                      {/* # */}
                      <td className="py-3.5 pl-5 pr-3 text-xs text-slate-400 font-medium">
                        {idx + 1}
                      </td>

                      {/* Student */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                            color.bg, color.text
                          )}>
                            {student.initials}
                          </div>
                          <span className="font-medium text-slate-900">{student.name}</span>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {student.score !== null ? `${student.score}%` : '—'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={student.status} />
                      </td>

                      {/* Time Taken */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {student.timeTaken !== null ? `${student.timeTaken} min` : '—'}
                      </td>

                      {/* Submitted On */}
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {student.submittedOn ?? '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pr-5 pl-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/teacher/results/${student.id}`)}
                            className="h-7 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
                          >
                            View Details
                          </button>
                          <Dropdown
                            align="right"
                            trigger={
                              <button
                                type="button"
                                className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            }
                          >
                            <DropdownItem
                              icon={<Eye className="h-4 w-4" />}
                              onClick={() => navigate(`/teacher/results/${student.id}`)}
                            >
                              View Details
                            </DropdownItem>
                            <DropdownItem
                              icon={<Download className="h-4 w-4" />}
                              onClick={() => {}}
                            >
                              Export Result
                            </DropdownItem>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-white">
          <p className="text-xs text-slate-500">Showing {sorted.length} students</p>
        </div>
      </div>

      {/* ──── Publish confirm ───────────────────────────────── */}
      <ConfirmDialog
        open={showPublish}
        onClose={() => setShowPublish(false)}
        onConfirm={() => navigate('/teacher/assessments')}
        title="Publish Assessment?"
        message="Students will be notified immediately and can begin taking the assessment. This action cannot be undone."
        confirmLabel="Publish"
      />
    </div>
  );
}

/* ─── Status badge component ─────────────────────────────────── */
function StatusBadge({ status }: { status: StudentRow['status'] }) {
  if (status === 'passed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#f0fdf4] text-[#15803d]">
        Passed
      </span>
    );
  }
  if (status === 'needs-support') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#fff1f2] text-[#be123c]">
        Needs Support
      </span>
    );
  }
  if (status === 'in-progress') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#fffbeb] text-[#92400e]">
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-500">
      Not Started
    </span>
  );
}
