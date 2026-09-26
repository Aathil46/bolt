import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { classes, assessments } from '@/data/mockData';
import { principalWeakStudents } from '@/data/principalMockData';
import {
  ArrowLeft, Search, TrendingUp, Target, Users, Clock,
  FileText, CheckCircle2, AlertTriangle, ChevronRight, Download,
} from 'lucide-react';

const STUDENT_NAMES = [
  'Alex Chen', 'Maya Patel', 'Jordan Lee', 'Sam Rodriguez', 'Taylor Kim',
  'Morgan Walsh', 'Casey Nguyen', 'Riley Johnson', 'Jamie Garcia', 'Drew Thompson',
  'Skylar Brown', 'Quinn Davis', 'Avery Martinez', 'Reese Wilson', 'Phoenix Anderson',
  'Sage O\'Connor', 'River Cooper', 'Kai Bennett', 'Iris Foster', 'Luna Reyes',
  'Owen Sullivan', 'Emma Brooks', 'Noah Price', 'Zoe Hayes', 'Ethan Coleman',
  'Aria Sanders', 'Leo Mitchell', 'Ivy Parker', 'Casey Diaz', 'Jamie Rivera',
  'Riley Smith', 'Avery Brooks',
];

/* ─── Avatar color palette matching Teacher section ─────────── */
const AVATAR_COLORS = [
  { bg: 'bg-[#dbeafe]', text: 'text-[#1d4ed8]' },
  { bg: 'bg-[#fce7f3]', text: 'text-[#be185d]' },
  { bg: 'bg-[#d1fae5]', text: 'text-[#065f46]' },
  { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
  { bg: 'bg-[#ede9fe]', text: 'text-[#5b21b6]' },
  { bg: 'bg-[#fee2e2]', text: 'text-[#991b1b]' },
  { bg: 'bg-[#ccfbf1]', text: 'text-[#115e59]' },
  { bg: 'bg-[#ffedd5]', text: 'text-[#9a3412]' },
  { bg: 'bg-[#e0f2fe]', text: 'text-[#0369a1]' },
  { bg: 'bg-[#f0fdf4]', text: 'text-[#166534]' },
];

/* ─── Class Assessment Model ─────────────────────────────────── */
interface ClassAssessmentItem {
  id: string;
  name: string;
  date: string;
  completed: string;
  completedCount: number;
  totalCount: number;
  avgScore: number;
  passRate: number;
  questionCount: number;
  duration: number;
  concepts: string[];
}

export function PrincipalClasses() {
  const [searchParams] = useSearchParams();

  // 1. Available Grades (only grades that actually have classes)
  const availableGrades = useMemo(() => {
    const gradesSet = new Set(classes.map((c) => c.grade));
    return Array.from(gradesSet).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });
  }, []);

  // Sync initial selection from search params or default to Grade 9
  const initialGrade = useMemo(() => {
    const paramGrade = searchParams.get('grade');
    if (paramGrade && availableGrades.includes(paramGrade)) return paramGrade;
    const paramClass = searchParams.get('class');
    if (paramClass) {
      const c = classes.find((cl) => cl.id === paramClass);
      if (c && availableGrades.includes(c.grade)) return c.grade;
    }
    return availableGrades[0] ?? 'Grade 9';
  }, [availableGrades, searchParams]);

  const [selectedGrade, setSelectedGrade] = useState<string>(initialGrade);

  // 2. Classes belonging to selected grade
  const classesInGrade = useMemo(() => {
    return classes.filter((c) => c.grade === selectedGrade);
  }, [selectedGrade]);

  // Sync initial class
  const initialClassId = useMemo(() => {
    const paramClass = searchParams.get('class');
    if (paramClass && classesInGrade.some((c) => c.id === paramClass)) return paramClass;
    return classesInGrade[0]?.id ?? null;
  }, [classesInGrade, searchParams]);

  const [selectedClassId, setSelectedClassId] = useState<string | null>(initialClassId);

  // Selected class record
  const selectedClass = useMemo(() => {
    if (!selectedClassId) return null;
    return classesInGrade.find((c) => c.id === selectedClassId) ?? classesInGrade[0] ?? null;
  }, [classesInGrade, selectedClassId]);

  // 3. Compact performance metrics (Only the 4 specified)
  const classWeakStudents = useMemo(() => {
    if (!selectedClass) return [];
    return principalWeakStudents.filter((s) => s.classId === selectedClass.id);
  }, [selectedClass]);

  const passPercentage = useMemo(() => {
    if (!selectedClass) return 0;
    if (selectedClass.id === 'c2') return 79;
    if (selectedClass.id === 'c5') return 72;
    if (selectedClass.id === 'c1') return 82;
    if (selectedClass.id === 'c3') return 92;
    if (selectedClass.id === 'c4') return 86;
    return Math.round(selectedClass.avgPerformance >= 75 ? 82 : 70);
  }, [selectedClass]);

  // 4. Assessments conducted for the selected class
  const classAssessments: ClassAssessmentItem[] = useMemo(() => {
    if (!selectedClass) return [];

    if (selectedClass.id === 'c2') {
      return [
        {
          id: 'a4',
          name: 'Triangle Congruence',
          date: 'Sep 12',
          completed: '31/31',
          completedCount: 31,
          totalCount: 31,
          avgScore: 74,
          passRate: 77,
          questionCount: 10,
          duration: 50,
          concepts: ['SSS', 'SAS', 'ASA', 'AAS', 'HL Theorem'],
        },
        {
          id: 'a7-c2',
          name: 'Geometry Basics',
          date: 'Sep 5',
          completed: '30/31',
          completedCount: 30,
          totalCount: 31,
          avgScore: 69,
          passRate: 70,
          questionCount: 8,
          duration: 40,
          concepts: ['Angles & Lines', 'Parallel Transversals', 'Coordinate Proofs'],
        },
      ];
    }

    if (selectedClass.id === 'c5') {
      return [
        {
          id: 'a-c5-1',
          name: 'Linear Inequalities & Graphs',
          date: 'Sep 10',
          completed: '29/30',
          completedCount: 29,
          totalCount: 30,
          avgScore: 68,
          passRate: 72,
          questionCount: 8,
          duration: 45,
          concepts: ['Linear Inequalities', 'Graphing Quadratics', 'Slope-Intercept'],
        },
        {
          id: 'a-c5-2',
          name: 'Solving Equations Foundations',
          date: 'Sep 2',
          completed: '30/30',
          completedCount: 30,
          totalCount: 30,
          avgScore: 71,
          passRate: 75,
          questionCount: 6,
          duration: 35,
          concepts: ['One-Variable Equations', 'Distributive Property', 'Fractions'],
        },
      ];
    }

    if (selectedClass.id === 'c1') {
      return [
        {
          id: 'a1',
          name: 'Quadratic Equations Mastery',
          date: 'Sep 3',
          completed: '28/28',
          completedCount: 28,
          totalCount: 28,
          avgScore: 76,
          passRate: 82,
          questionCount: 6,
          duration: 45,
          concepts: ['Quadratic Formula', 'Factoring', 'Discriminant', 'Vertex Form'],
        },
        {
          id: 'a2',
          name: 'Polynomial Functions Quiz',
          date: 'Aug 30',
          completed: '27/28',
          completedCount: 27,
          totalCount: 28,
          avgScore: 81,
          passRate: 89,
          questionCount: 8,
          duration: 30,
          concepts: ['Polynomial Degree', 'Roots & Zeros', 'Synthetic Division'],
        },
      ];
    }

    if (selectedClass.id === 'c3') {
      return [
        {
          id: 'a5',
          name: 'Limits & Continuity Exam',
          date: 'Sep 4',
          completed: '24/24',
          completedCount: 24,
          totalCount: 24,
          avgScore: 83,
          passRate: 88,
          questionCount: 12,
          duration: 60,
          concepts: ['Limit Definition', 'One-sided Limits', 'Continuity', 'Limit Laws'],
        },
        {
          id: 'a-c3-2',
          name: 'Trigonometric Identities Review',
          date: 'Aug 28',
          completed: '24/24',
          completedCount: 24,
          totalCount: 24,
          avgScore: 86,
          passRate: 92,
          questionCount: 10,
          duration: 45,
          concepts: ['Pythagorean Identities', 'Double Angle Formulas', 'Unit Circle'],
        },
      ];
    }

    // Default for c4 (Statistics) or others
    return [
      {
        id: 'a-c4-1',
        name: 'Probability Distributions & Variance',
        date: 'Aug 29',
        completed: '22/22',
        completedCount: 22,
        totalCount: 22,
        avgScore: 81,
        passRate: 86,
        questionCount: 10,
        duration: 50,
        concepts: ['Normal Distribution', 'Standard Deviation', 'Confidence Intervals'],
      },
      {
        id: 'a-c4-2',
        name: 'Sampling Methods & Hypotheses',
        date: 'Aug 22',
        completed: '21/22',
        completedCount: 21,
        totalCount: 22,
        avgScore: 84,
        passRate: 89,
        questionCount: 8,
        duration: 40,
        concepts: ['Random Sampling', 'Null Hypothesis', 'P-values'],
      },
    ];
  }, [selectedClass]);

  // 5. Results View State (Teacher-style Assessment Results Experience)
  const [activeResultAssessment, setActiveResultAssessment] = useState<ClassAssessmentItem | null>(null);
  const [resultsTab, setResultsTab] = useState<'all' | 'completed' | 'support'>('all');
  const [resultSearchQuery, setResultSearchQuery] = useState('');

  // Generate student rows for the active result assessment matching Teacher pattern
  const assessmentStudents = useMemo(() => {
    if (!activeResultAssessment || !selectedClass) return [];
    
    // Pick student cohort for this class
    const total = activeResultAssessment.totalCount;
    const cohort = STUDENT_NAMES.slice(0, total);

    return cohort.map((name, idx) => {
      const initials = name.split(' ').map((n) => n[0]).join('');
      const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
      const email = `${name.toLowerCase().replace(/\s+/g, '.')}@oakridge.edu`;
      
      // Calculate realistic score matching class/assessment average
      const variance = ((idx * 13 + activeResultAssessment.avgScore) % 35) - 17;
      const score = Math.max(32, Math.min(98, activeResultAssessment.avgScore + variance));
      const passed = score >= 70;
      const isWeak = score < 50;
      const timeSpent = Math.max(22, Math.min(activeResultAssessment.duration, 28 + (idx * 3) % 25));

      return {
        id: `st-${idx}`,
        name,
        email,
        initials,
        avatarColor,
        score,
        passed,
        isWeak,
        status: 'Completed',
        timeSpent: `${timeSpent} min`,
      };
    });
  }, [activeResultAssessment, selectedClass]);

  const filteredAssessmentStudents = useMemo(() => {
    return assessmentStudents.filter((st) => {
      const matchesSearch =
        st.name.toLowerCase().includes(resultSearchQuery.toLowerCase()) ||
        st.email.toLowerCase().includes(resultSearchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (resultsTab === 'support') return st.isWeak;
      return true;
    });
  }, [assessmentStudents, resultSearchQuery, resultsTab]);

  const supportCount = useMemo(() => {
    return assessmentStudents.filter((s) => s.isWeak).length;
  }, [assessmentStudents]);

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Class Performance</h1>
        <p className="text-xs text-slate-500 mt-1">Review performance by grade, class, and subject.</p>
      </div>

      {/* If Viewing Assessment Results: Established Teacher Result Structure */}
      {activeResultAssessment && selectedClass ? (
        <div className="space-y-6 bg-white border border-slate-200 rounded-lg p-6">
          {/* Back button */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <button
              type="button"
              onClick={() => {
                setActiveResultAssessment(null);
                setResultsTab('all');
                setResultSearchQuery('');
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-teal-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 text-slate-500" />
              <span>Back to {selectedClass.name}</span>
            </button>

            <span className="text-xs font-medium text-slate-500">
              {selectedGrade} · {selectedClass.name}
            </span>
          </div>

          {/* Assessment Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-900">{activeResultAssessment.name}</h2>
                <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Published
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {selectedClass.name} · {selectedClass.teacherName} · {activeResultAssessment.totalCount} students · {activeResultAssessment.questionCount} questions · {activeResultAssessment.duration} min · {activeResultAssessment.date}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-8 px-3 rounded border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                Export
              </button>
            </div>
          </div>

          {/* 4 KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-teal-700 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">Average Score</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{activeResultAssessment.avgScore}%</p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-teal-700 mb-1">
                <Target className="h-4 w-4" />
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">Pass Rate</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{activeResultAssessment.passRate}%</p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-slate-700 mb-1">
                <Users className="h-4 w-4 text-slate-500" />
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">Completed</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {activeResultAssessment.completedCount} / {activeResultAssessment.totalCount}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-amber-700 mb-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">Needing Support</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{supportCount} students</p>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="border-b border-slate-200 flex items-center gap-6 text-xs">
            <button
              type="button"
              onClick={() => setResultsTab('all')}
              className={`pb-2.5 font-semibold transition-colors cursor-pointer border-b-2 ${
                resultsTab === 'all'
                  ? 'border-teal-600 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              All Students ({activeResultAssessment.totalCount})
            </button>

            <button
              type="button"
              onClick={() => setResultsTab('completed')}
              className={`pb-2.5 font-semibold transition-colors cursor-pointer border-b-2 ${
                resultsTab === 'completed'
                  ? 'border-teal-600 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Completed ({activeResultAssessment.completedCount})
            </button>

            <button
              type="button"
              onClick={() => setResultsTab('support')}
              className={`pb-2.5 font-semibold transition-colors cursor-pointer border-b-2 ${
                resultsTab === 'support'
                  ? 'border-teal-600 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Concepts Needing Support ({supportCount})
            </button>
          </div>

          {/* Search bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-xs">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student name..."
                value={resultSearchQuery}
                onChange={(e) => setResultSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-slate-200 focus:outline-none focus:border-teal-600"
              />
            </div>
            <span className="text-2xs text-slate-500">
              Showing {filteredAssessmentStudents.length} of {activeResultAssessment.totalCount} students
            </span>
          </div>

          {/* Student Results Table */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-2xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Score</th>
                  <th className="py-2.5 px-4">Time Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssessmentStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${st.avatarColor.bg} ${st.avatarColor.text}`}>
                          {st.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{st.name}</p>
                          <p className="text-2xs text-slate-400">{st.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="inline-flex items-center gap-1 text-2xs font-medium text-slate-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Completed
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${st.isWeak ? 'text-red-600' : 'text-slate-900'}`}>
                          {st.score}%
                        </span>
                        {st.isWeak && (
                          <span className="text-2xs px-1.5 py-0.2 rounded bg-red-50 text-red-700 font-semibold border border-red-200">
                            &lt;50%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">
                      {st.timeSpent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Academic Command Center: 3-column / stacked responsive hierarchy */
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* 2. Grade selection — permanent left side panel */}
          <div className="w-full lg:w-56 shrink-0 bg-white border border-slate-200 rounded-lg p-4">
            <h2 className="text-2xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
              GRADES
            </h2>
            <div className="flex flex-col gap-1.5">
              {availableGrades.map((grade) => {
                const count = classes.filter((c) => c.grade === grade).length;
                const isSelected = selectedGrade === grade;
                return (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => {
                      setSelectedGrade(grade);
                      const firstClassInNewGrade = classes.find((c) => c.grade === grade);
                      setSelectedClassId(firstClassInNewGrade ? firstClassInNewGrade.id : null);
                    }}
                    className={`w-full text-left px-3.5 py-3 rounded-md border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {grade}
                    </p>
                    <p className={`text-xs mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {count} {count === 1 ? 'class' : 'classes'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Class selection — vertical list next to grade panel */}
          <div className="w-full lg:w-72 shrink-0 bg-white border border-slate-200 rounded-lg p-4">
            <h2 className="text-2xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
              {selectedGrade.toUpperCase()}
            </h2>
            <div className="flex flex-col gap-2">
              {classesInGrade.map((cls) => {
                const isSelected = selectedClass?.id === cls.id;
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`w-full text-left p-3.5 rounded-md border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/40 ring-1 ring-teal-600'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <p className={`text-xs font-bold ${isSelected ? 'text-teal-950 font-bold' : 'text-slate-900'}`}>
                      {cls.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {cls.teacherName} · {cls.studentCount} students
                    </p>
                    <p className="text-xs font-semibold text-slate-700 mt-2">
                      {cls.avgPerformance}% average
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4 & 5. Class details — only after selecting a class */}
          <div className="flex-1 min-w-0 w-full">
            {selectedClass ? (
              <div className="space-y-6">
                {/* Class Title Header */}
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedClass.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedClass.teacherName} · {selectedClass.subject}
                  </p>
                </div>

                {/* Compact performance dashboard: ONLY the 4 required KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">
                      {selectedClass.studentCount}
                    </p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">
                      Total Students
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">
                      {classWeakStudents.length}
                    </p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">
                      Weak Students
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">
                      {passPercentage}%
                    </p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">
                      Pass Percentage
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">
                      {selectedClass.assessmentCount}
                    </p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">
                      Assessments
                    </p>
                  </div>
                </div>

                {/* 5. Assessments conducted */}
                <div className="bg-white border border-slate-200 rounded-lg p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">
                    Assessments
                  </h3>

                  <div className="border border-slate-200 rounded overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs min-w-[550px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-2xs font-bold uppercase tracking-wider text-slate-500">
                            <th className="py-2.5 px-4">Assessment</th>
                            <th className="py-2.5 px-4">Date</th>
                            <th className="py-2.5 px-4">Completed</th>
                            <th className="py-2.5 px-4">Average</th>
                            <th className="py-2.5 px-4">Pass Rate</th>
                            <th className="py-2.5 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {classAssessments.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-6 text-center text-xs text-slate-400">
                                No assessments recorded for this class.
                              </td>
                            </tr>
                          ) : (
                            classAssessments.map((a) => (
                              <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-3 px-4 font-semibold text-slate-900">
                                  {a.name}
                                </td>
                                <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                                  {a.date}
                                </td>
                                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                                  {a.completed}
                                </td>
                                <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                                  {a.avgScore}%
                                </td>
                                <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                                  {a.passRate}%
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => setActiveResultAssessment(a)}
                                    className="px-3 py-1.5 rounded text-xs font-semibold text-teal-700 hover:text-teal-900 bg-white border border-slate-200 hover:border-teal-600 transition-colors cursor-pointer"
                                  >
                                    View Results
                                  </button>
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
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400 text-xs">
                Select a class to view performance details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
