import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/ui/EmptyState';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { ConfirmDialog } from '@/components/ui/StatusIndicator';
import { assessments, classes } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, FileText, Users, TrendingUp, Clock,
  Search, Download, MoreVertical,
  ChevronDown, ChevronRight, Eye, Check,
  Leaf, FlaskConical, Atom, BarChart3, Target,
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

/* ─── Custom Molecule Icon for Glucose matching reference image ─── */
function MoleculeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="7" cy="17" r="2.8" />
      <circle cx="17" cy="17" r="2.8" />
      <circle cx="12" cy="7" r="2.8" />
      <line x1="9.2" y1="14.8" x2="10.8" y2="9.5" />
      <line x1="14.8" y1="14.8" x2="13.2" y2="9.5" />
      <line x1="9.8" y1="17" x2="14.2" y2="17" />
    </svg>
  );
}

/* ─── Concepts Needing Support Data ───────────────────────────── */
interface SupportStudent {
  id: string;
  name: string;
  initials: string;
  score: number;
  status: 'needs-support';
  timeTaken: number;
  avatarColor: { bg: string; text: string };
}

interface ConceptItem {
  id: string;
  name: string;
  subtitle: string;
  studentCount: number;
  avgScore: number;
  classAvg: number;
  iconType: 'molecule' | 'leaf' | 'flask' | 'atom';
  students: SupportStudent[];
}

const SUPPORT_CONCEPTS: ConceptItem[] = [
  {
    id: 'glucose',
    name: 'Glucose',
    subtitle: 'Cellular respiration and energy',
    studentCount: 2,
    avgScore: 32,
    classAvg: 32,
    iconType: 'molecule',
    students: [
      {
        id: 's-aathil',
        name: 'Aathil',
        initials: 'AA',
        score: 28,
        status: 'needs-support',
        timeTaken: 42,
        avatarColor: { bg: 'bg-[#dbeafe]', text: 'text-[#1d4ed8]' },
      },
      {
        id: 's-jeffy',
        name: 'Jeffy',
        initials: 'JF',
        score: 36,
        status: 'needs-support',
        timeTaken: 38,
        avatarColor: { bg: 'bg-[#ede9fe]', text: 'text-[#5b21b6]' },
      },
    ],
  },
  {
    id: 'photosynthesis',
    name: 'Photosynthesis',
    subtitle: 'Process and equation',
    studentCount: 2,
    avgScore: 38,
    classAvg: 38,
    iconType: 'leaf',
    students: [
      {
        id: 's3',
        name: 'Liam Smith',
        initials: 'LS',
        score: 34,
        status: 'needs-support',
        timeTaken: 42,
        avatarColor: { bg: 'bg-[#d1fae5]', text: 'text-[#065f46]' },
      },
      {
        id: 's4',
        name: 'Emma Davis',
        initials: 'ED',
        score: 42,
        status: 'needs-support',
        timeTaken: 36,
        avatarColor: { bg: 'bg-[#fce7f3]', text: 'text-[#be185d]' },
      },
    ],
  },
  {
    id: 'nitrogen',
    name: 'Nitrogen',
    subtitle: 'Nitrogen cycle and compounds',
    studentCount: 1,
    avgScore: 46,
    classAvg: 46,
    iconType: 'flask',
    students: [
      {
        id: 's5',
        name: 'Noah Wilson',
        initials: 'NW',
        score: 46,
        status: 'needs-support',
        timeTaken: 39,
        avatarColor: { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
      },
    ],
  },
  {
    id: 'chemical-bonding',
    name: 'Chemical Bonding',
    subtitle: 'Ionic and covalent bonds',
    studentCount: 1,
    avgScore: 52,
    classAvg: 52,
    iconType: 'atom',
    students: [
      {
        id: 's26',
        name: 'Nora Bennett',
        initials: 'NB',
        score: 52,
        status: 'needs-support',
        timeTaken: 47,
        avatarColor: { bg: 'bg-[#fee2e2]', text: 'text-[#991b1b]' },
      },
    ],
  },
];

/* ─── Richer student seed data for standard table ────────────────── */
interface StudentRow {
  id: string;
  name: string;
  initials: string;
  score: number | null;
  status: 'passed' | 'needs-support' | 'in-progress' | 'not-started';
  timeTaken: number | null;
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
type TabKey  = 'all' | 'completed' | 'in-progress' | 'not-started' | 'needing-support';
type ConceptSortKey = 'most-support' | 'lowest-score' | 'highest-score' | 'az';

const SORT_LABELS: Record<SortKey, string> = {
  recent:  'Recent Submission',
  az:      'A to Z (Name)',
  za:      'Z to A (Name)',
  highest: 'Highest Score',
  lowest:  'Lowest Score',
};

const CONCEPT_SORT_LABELS: Record<ConceptSortKey, string> = {
  'most-support':  'Most Needing Support',
  'lowest-score':  'Lowest Avg Score',
  'highest-score': 'Highest Avg Score',
  'az':            'Concept Name (A-Z)',
};

export function AssessmentDetail() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  // Opens directly to 'all' (first section: All Students) when clicking View Results
  const [tab,                 setTab]                 = useState<TabKey>('all');
  const [search,              setSearch]              = useState('');
  const [sortKey,             setSortKey]             = useState<SortKey>('recent');
  const [showPublish,         setShowPublish]         = useState(false);

  // Students Needing Support Section State
  const [selectedConceptId,   setSelectedConceptId]   = useState<string>('glucose');
  const [conceptSortKey,      setConceptSortKey]      = useState<ConceptSortKey>('most-support');
  const [supportStudentSearch,setSupportStudentSearch]= useState('');

  /* ── find assessment ── */
  const assessment = assessments.find(a => a.id === assessmentId) ?? assessments[0];
  const cls = classes.find(c => c.id === assessment?.classId);

  if (!assessment) {
    return (
      <EmptyState
        icon={<FileText className="h-6 w-6" />}
        title="Assessment not found"
        action={
          <button
            onClick={() => navigate('/teacher/assessments')}
            className="h-9 px-4 rounded-xl bg-[#0d9488] text-white text-sm font-medium cursor-pointer"
          >
            Back to Assessments
          </button>
        }
      />
    );
  }

  /* ── student counts & stats ── */
  const completedCount   = 21;
  const inProgressCount  = 4;
  const notStartedCount  = 3;
  const totalStudents    = 28;
  const completionPct    = 75;
  const avgScore         = 73;
  const passRate         = 62;
  const needingSupportCount = 6;

  /* ── standard table filter & sort ── */
  const tabFiltered = useMemo(() => {
    if (tab === 'completed')    return seedStudents.filter(s => s.status === 'passed' || s.status === 'needs-support');
    if (tab === 'in-progress')  return seedStudents.filter(s => s.status === 'in-progress');
    if (tab === 'not-started')  return seedStudents.filter(s => s.status === 'not-started');
    return seedStudents;
  }, [tab]);

  const searched = useMemo(() => {
    if (!search.trim()) return tabFiltered;
    return tabFiltered.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  }, [tabFiltered, search]);

  const sorted = useMemo(() => {
    const arr = [...searched];
    if (sortKey === 'az')      return arr.sort((a, b) => a.name.localeCompare(b.name));
    if (sortKey === 'za')      return arr.sort((a, b) => b.name.localeCompare(a.name));
    if (sortKey === 'highest') return arr.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    if (sortKey === 'lowest')  return arr.sort((a, b) => (a.score ?? 999) - (b.score ?? 999));
    return arr;
  }, [searched, sortKey]);

  /* ── support concepts sorted ── */
  const sortedConcepts = useMemo(() => {
    const arr = [...SUPPORT_CONCEPTS];
    if (conceptSortKey === 'most-support') {
      return arr.sort((a, b) => b.studentCount - a.studentCount || a.avgScore - b.avgScore);
    }
    if (conceptSortKey === 'lowest-score') {
      return arr.sort((a, b) => a.avgScore - b.avgScore);
    }
    if (conceptSortKey === 'highest-score') {
      return arr.sort((a, b) => b.avgScore - a.avgScore);
    }
    if (conceptSortKey === 'az') {
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    }
    return arr;
  }, [conceptSortKey]);

  const selectedConcept = useMemo(() => {
    return SUPPORT_CONCEPTS.find(c => c.id === selectedConceptId) || SUPPORT_CONCEPTS[0];
  }, [selectedConceptId]);

  /* ── filtered support students for selected concept ── */
  const filteredConceptStudents = useMemo(() => {
    if (!supportStudentSearch.trim()) return selectedConcept.students;
    return selectedConcept.students.filter(s =>
      s.name.toLowerCase().includes(supportStudentSearch.toLowerCase())
    );
  }, [selectedConcept, supportStudentSearch]);

  const isRedTheme = tab === 'needing-support';

  return (
    <div className="space-y-6 pb-12">

      {/* ──── Breadcrumb back link ──────────────────────────── */}
      <button
        onClick={() => navigate('/teacher/results')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to Results &amp; Analytics</span>
      </button>

      {/* ──── Assessment header card ────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Document icon */}
            <div className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors border",
              isRedTheme
                ? "bg-[#fef2f2] border-red-100 text-[#dc2626]"
                : "bg-[#f0fdfa] border-[#ccfbf1] text-[#0d9488]"
            )}>
              <FileText className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-slate-900">{assessment.title}</h1>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors",
                  isRedTheme
                    ? "bg-[#fee2e2] text-[#b91c1c] border-red-200/70"
                    : "bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]/60"
                )}>
                  Published
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                <span>{cls?.name ?? 'Algebra II - Period 3'}</span>
                <span className="text-slate-300">|</span>
                <span>{totalStudents} students</span>
                <span className="text-slate-300">|</span>
                <span>{assessment.questionCount ?? 6} questions</span>
                <span className="text-slate-300">|</span>
                <span>{assessment.duration ?? 45} min</span>
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
              className="h-9 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Download Report
            </button>
          </div>
        </div>
      </div>

      {/* ──── 4 KPI stat cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Average Score */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5 flex items-center gap-4 transition-all">
          <div className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
            isRedTheme ? "bg-[#fef2f2] text-[#dc2626]" : "bg-[#f0fdfa] text-[#0d9488]"
          )}>
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Average Score</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{avgScore}%</p>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5 flex items-center gap-4 transition-all">
          <div className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
            isRedTheme ? "bg-[#fef2f2] text-[#dc2626]" : "bg-[#fef2f2] text-[#dc2626]"
          )}>
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pass Rate</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{passRate}%</p>
          </div>
        </div>

        {/* Completed Students */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5 flex items-center gap-4 transition-all">
          <div className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
            isRedTheme ? "bg-[#fef2f2] text-[#dc2626]" : "bg-[#f0fdfa] text-[#0d9488]"
          )}>
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Completed Students</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{completedCount} / {totalStudents}</p>
            <p className="text-xs text-slate-400 mt-0.5">{completionPct}% completion</p>
          </div>
        </div>

        {/* In Progress */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5 flex items-center gap-4 transition-all">
          <div className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
            isRedTheme ? "bg-[#fef2f2] text-[#dc2626]" : "bg-[#fffbeb] text-[#d97706]"
          )}>
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">In Progress</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{inProgressCount} students</p>
            <p className="text-xs text-slate-400 mt-0.5">{Math.round((inProgressCount / totalStudents) * 100)}% of class</p>
          </div>
        </div>

      </div>

      {/* ──── Horizontal Tab Bar ────────────────────────────── */}
      <div className="border-b border-slate-200 flex items-center gap-6 overflow-x-auto pt-2">
        <button
          type="button"
          onClick={() => { setTab('all'); setSearch(''); }}
          className={cn(
            'pb-3 text-sm font-medium transition-all cursor-pointer whitespace-nowrap border-b-2',
            tab === 'all'
              ? 'border-[#0d9488] text-[#0d9488] font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          )}
        >
          All Students ({totalStudents})
        </button>

        <button
          type="button"
          onClick={() => { setTab('completed'); setSearch(''); }}
          className={cn(
            'pb-3 text-sm font-medium transition-all cursor-pointer whitespace-nowrap border-b-2',
            tab === 'completed'
              ? 'border-[#0d9488] text-[#0d9488] font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          )}
        >
          Completed ({completedCount})
        </button>

        <button
          type="button"
          onClick={() => { setTab('in-progress'); setSearch(''); }}
          className={cn(
            'pb-3 text-sm font-medium transition-all cursor-pointer whitespace-nowrap border-b-2',
            tab === 'in-progress'
              ? 'border-[#0d9488] text-[#0d9488] font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          )}
        >
          In Progress ({inProgressCount})
        </button>

        <button
          type="button"
          onClick={() => { setTab('not-started'); setSearch(''); }}
          className={cn(
            'pb-3 text-sm font-medium transition-all cursor-pointer whitespace-nowrap border-b-2',
            tab === 'not-started'
              ? 'border-[#0d9488] text-[#0d9488] font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          )}
        >
          Not Started ({notStartedCount})
        </button>

        {/* Students Needing Support tab with Red/Black Theme */}
        <button
          type="button"
          onClick={() => { setTab('needing-support'); }}
          className={cn(
            'pb-3 text-sm transition-all cursor-pointer whitespace-nowrap border-b-2 flex items-center gap-2',
            tab === 'needing-support'
              ? 'border-[#dc2626] text-[#dc2626] font-bold'
              : 'border-transparent text-slate-600 hover:text-[#dc2626] font-medium'
          )}
        >
          <Users className={cn('h-4 w-4', tab === 'needing-support' ? 'text-[#dc2626]' : 'text-slate-400')} />
          <span>Students Needing Support ({needingSupportCount})</span>
        </button>
      </div>

      {/* ──── SECTION CONTENT: Students Needing Support OR Standard Table ──── */}
      {tab === 'needing-support' ? (
        /* ════════════ STUDENTS NEEDING SUPPORT SECTION (RED/BLACK/WHITE THEME) ════════════ */
        <div className="space-y-6 animate-fade-in">

          {/* 1. Header Banner */}
          <div className="rounded-2xl border border-red-200/70 bg-gradient-to-r from-red-50 via-red-50/60 to-pink-50/40 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-red-100/90 text-red-600 flex items-center justify-center flex-shrink-0 shadow-xs">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Students Needing Support</h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  These are the concepts where students are struggling in this assessment.
                </p>
              </div>
            </div>

            {/* Right Badge */}
            <div className="self-start sm:self-center flex items-center gap-3 px-4 py-2.5 rounded-xl bg-red-100/80 border border-red-200/80 shadow-2xs">
              <div className="h-7 w-7 rounded-full bg-red-200/80 text-red-700 flex items-center justify-center flex-shrink-0">
                <Users className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">6 students need support</p>
                <p className="text-2xs font-medium text-red-700">across 4 concepts</p>
              </div>
            </div>
          </div>

          {/* 2. Main 2-Column Grid: Concepts on Left, Students on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* LEFT COLUMN: Concepts (4) */}
            <div className="lg:col-span-5 space-y-3">
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-2 pb-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Concepts ({sortedConcepts.length})
                </h3>

                {/* Sort dropdown */}
                <Dropdown
                  align="right"
                  trigger={
                    <button
                      type="button"
                      className="h-8 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>Sort by: {CONCEPT_SORT_LABELS[conceptSortKey]}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  }
                >
                  {(Object.keys(CONCEPT_SORT_LABELS) as ConceptSortKey[]).map(k => (
                    <DropdownItem
                      key={k}
                      onClick={() => setConceptSortKey(k)}
                      icon={conceptSortKey === k ? <Check className="h-3.5 w-3.5 text-red-600" /> : <span className="h-3.5 w-3.5" />}
                    >
                      {CONCEPT_SORT_LABELS[k]}
                    </DropdownItem>
                  ))}
                </Dropdown>
              </div>

              {/* Concept list */}
              <div className="space-y-3">
                {sortedConcepts.map(c => {
                  const isSelected = selectedConceptId === c.id;

                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedConceptId(c.id);
                        setSupportStudentSearch('');
                      }}
                      className={cn(
                        'rounded-2xl border p-4 transition-all cursor-pointer relative overflow-hidden text-left group',
                        isSelected
                          ? 'border-red-300 bg-[#fffdfd] shadow-sm'
                          : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
                      )}
                    >
                      {/* Left red accent indicator bar on active card */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#dc2626]" />
                      )}

                      <div className="flex items-center justify-between gap-3">
                        {/* Icon & Title */}
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className={cn(
                            'h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
                            isSelected
                              ? 'bg-[#fee2e2] text-[#dc2626]'
                              : c.iconType === 'molecule'
                                ? 'bg-red-50 text-red-600'
                                : c.iconType === 'leaf'
                                  ? 'bg-slate-100 text-slate-700'
                                  : c.iconType === 'flask'
                                    ? 'bg-slate-100 text-slate-700'
                                    : 'bg-red-50/80 text-red-600'
                          )}>
                            {c.iconType === 'molecule' && <MoleculeIcon className="h-5 w-5" />}
                            {c.iconType === 'leaf' && <Leaf className="h-5 w-5" />}
                            {c.iconType === 'flask' && <FlaskConical className="h-5 w-5" />}
                            {c.iconType === 'atom' && <Atom className="h-5 w-5" />}
                          </div>

                          <div className="min-w-0">
                            <h4 className={cn(
                              'text-sm font-bold truncate transition-colors',
                              isSelected ? 'text-slate-900 font-extrabold' : 'text-slate-900 group-hover:text-red-600'
                            )}>
                              {c.name}
                            </h4>
                            <p className="text-xs text-slate-500 truncate mt-0.5 font-normal">
                              {c.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Right counts & score */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-xs font-semibold text-slate-700">
                              {c.studentCount} {c.studentCount === 1 ? 'student' : 'students'}
                            </p>
                            <div className="flex items-center gap-1.5 justify-end mt-1">
                              <span className="w-1 h-3 rounded-full bg-red-600 inline-block" />
                              <span className="font-bold text-red-600 text-xs">{c.avgScore}%</span>
                              <span className="text-slate-400 text-xs">avg. score</span>
                            </div>
                          </div>

                          <ChevronRight className={cn(
                            'h-4 w-4 transition-transform',
                            isSelected ? 'text-red-600 translate-x-0.5' : 'text-slate-400 group-hover:text-slate-600'
                          )} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: Selected Concept Details + Students Table */}
            <div className="lg:col-span-7 space-y-5">

              {/* 1. Selected Concept Header Card */}
              <div className="rounded-2xl border border-red-200/70 bg-gradient-to-r from-red-50/40 via-white to-white p-5 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-12 w-12 rounded-xl bg-[#fee2e2] text-[#dc2626] flex items-center justify-center flex-shrink-0 shadow-xs">
                    {selectedConcept.iconType === 'molecule' && <MoleculeIcon className="h-6 w-6" />}
                    {selectedConcept.iconType === 'leaf' && <Leaf className="h-6 w-6" />}
                    {selectedConcept.iconType === 'flask' && <FlaskConical className="h-6 w-6" />}
                    {selectedConcept.iconType === 'atom' && <Atom className="h-6 w-6" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 truncate">
                      {selectedConcept.name}
                    </h3>
                    <p className="text-sm text-slate-500 truncate mt-0.5">
                      {selectedConcept.subtitle}
                    </p>
                  </div>
                </div>

                {/* Class average stat block */}
                <div className="flex items-center gap-3.5 flex-shrink-0 pl-3">
                  <div className="h-11 w-11 rounded-xl bg-[#fef2f2] text-[#dc2626] flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-[#dc2626] tracking-tight">
                      {selectedConcept.classAvg}%
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      Class average
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Students Needing Support Table Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                {/* Table Toolbar */}
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    Students needing support ({filteredConceptStudents.length})
                  </h4>

                  {/* Search inside concept students */}
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={supportStudentSearch}
                      onChange={e => setSupportStudentSearch(e.target.value)}
                      className="h-8 w-full sm:w-56 pl-8 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[580px]">
                    <thead className="bg-slate-50/50">
                      <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                        <th className="py-3 pl-5 pr-3 w-8">#</th>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Time Taken</th>
                        <th className="py-3 pr-5 pl-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredConceptStudents.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                            No students found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredConceptStudents.map((st, idx) => (
                          <tr key={st.id} className="hover:bg-slate-50/60 transition-colors group">
                            {/* # */}
                            <td className="py-3.5 pl-5 pr-3 text-xs text-slate-400 font-medium">
                              {idx + 1}
                            </td>

                            {/* Student */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                                  st.avatarColor.bg, st.avatarColor.text
                                )}>
                                  {st.initials}
                                </div>
                                <span className="font-medium text-slate-900">{st.name}</span>
                              </div>
                            </td>

                            {/* Score */}
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-[#dc2626] text-sm">
                                {st.score}%
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fee2e2] text-[#dc2626] border border-[#fecaca]">
                                Needs Support
                              </span>
                            </td>

                            {/* Time Taken */}
                            <td className="py-3.5 px-4 text-slate-600 text-sm">
                              {st.timeTaken} min
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 pr-5 pl-2 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => navigate(`/teacher/results/${st.id}`)}
                                  className="h-7 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
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
                                    onClick={() => navigate(`/teacher/results/${st.id}`)}
                                  >
                                    View Detailed Result
                                  </DropdownItem>
                                </Dropdown>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* ════════════ STANDARD RESULTS TABLE VIEW (ASSESSAI TEAL THEME) ════════════ */
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden animate-fade-in">

          {/* Table toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm font-semibold text-slate-800">
              {tab === 'all' && `All Students (${totalStudents})`}
              {tab === 'completed' && `Completed Students (${completedCount})`}
              {tab === 'in-progress' && `In Progress (${inProgressCount})`}
              {tab === 'not-started' && `Not Started (${notStartedCount})`}
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
              <Dropdown
                align="right"
                trigger={
                  <button
                    type="button"
                    className="h-8 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{SORT_LABELS[sortKey]}</span>
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
      )}

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
