import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { principalWeakStudents, type WeakStudentItem } from '@/data/principalMockData';
import {
  AlertTriangle, Users, BookOpen, Search, Filter,
  ChevronRight, ArrowRight, Eye, Target, X, Check,
  AlertCircle, TrendingUp, Sparkles, School,
} from 'lucide-react';

export function PrincipalWeakStudents() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<WeakStudentItem | null>(null);

  // Available classes and grades
  const classOptions = useMemo(() => {
    const set = new Set(principalWeakStudents.map(s => s.className));
    return ['all', ...Array.from(set)];
  }, []);

  const gradeOptions = useMemo(() => {
    const set = new Set(principalWeakStudents.map(s => s.grade));
    return ['all', ...Array.from(set)];
  }, []);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return principalWeakStudents.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.weakConcepts.some(c => c.concept.toLowerCase().includes(search.toLowerCase()));
      const matchClass = selectedClass === 'all' || s.className === selectedClass;
      const matchGrade = selectedGrade === 'all' || s.grade === selectedGrade;
      return matchSearch && matchClass && matchGrade;
    });
  }, [search, selectedClass, selectedGrade]);

  // Aggregate metrics
  const totalWeak = principalWeakStudents.length;
  const criticalCount = principalWeakStudents.filter(s => s.status === 'critical').length;
  const classesAffected = new Set(principalWeakStudents.map(s => s.className)).size;
  const withInterventions = principalWeakStudents.filter(s => s.interventionAssigned).length;

  return (
    <div className="space-y-6 pb-12">
      {/* ──── Page Header ────────────────────────────────────── */}
      <PageHeader
        title="Weak Students"
        description="Students with at least one learning gap concept below 50% across assessments."
        action={
          <Button
            variant="outline"
            onClick={() => navigate('/principal/interventions')}
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4 text-brand-600" />
            <span>View Interventions ({withInterventions})</span>
          </Button>
        }
      />

      {/* ──── Summary Metric Cards ────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-error-500">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-error-50 text-error-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wide">Total Weak Students</p>
              <p className="text-2xl font-bold text-slate-900">{totalWeak}</p>
            </div>
          </div>
          <p className="text-2xs text-slate-500 mt-2">10.4% of total student body</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-error-600">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-error-100 text-error-700 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wide">Multiple Gap Cohort</p>
              <p className="text-2xl font-bold text-slate-900">{criticalCount}</p>
            </div>
          </div>
          <p className="text-2xs text-slate-500 mt-2">2 or more persistent weak concepts</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-warning-500">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-warning-50 text-warning-600 flex items-center justify-center flex-shrink-0">
              <School className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wide">Affected Classes</p>
              <p className="text-2xl font-bold text-slate-900">{classesAffected}</p>
            </div>
          </div>
          <p className="text-2xs text-slate-500 mt-2">Across Grades 9 &amp; 10</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-brand-500">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wide">Active Interventions</p>
              <p className="text-2xl font-bold text-slate-900">{withInterventions} / {totalWeak}</p>
            </div>
          </div>
          <p className="text-2xs text-slate-500 mt-2">Structured support assigned</p>
        </Card>
      </div>

      {/* ──── Filter & Search Bar ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or weak concept..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Grade filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Grade:</span>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="h-8 px-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 font-medium focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Grades</option>
              {gradeOptions.filter(g => g !== 'all').map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Class filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Class:</span>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="h-8 px-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 font-medium focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Classes</option>
              {classOptions.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {(search || selectedClass !== 'all' || selectedGrade !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSearch(''); setSelectedClass('all'); setSelectedGrade('all'); }}
              className="text-xs text-slate-500 h-8 px-2"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* ──── Concise Weak Students Table ─────────────────────── */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold text-slate-400">
                <th className="py-3 pl-6 pr-3 w-10">#</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Main Learning Gap(s)</th>
                <th className="py-3 px-4">Affected Tests</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 pr-6 pl-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-xs">
                    No students match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, idx) => (
                  <tr
                    key={st.id}
                    onClick={() => setSelectedStudent(st)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Index */}
                    <td className="py-3.5 pl-6 pr-3 text-xs text-slate-400 font-medium">
                      {idx + 1}
                    </td>

                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar initials={st.avatar} size="sm" color="error" />
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                            {st.name}
                          </p>
                          <p className="text-2xs text-slate-400">{st.grade}</p>
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="text-xs font-medium text-slate-800">{st.className}</p>
                        <p className="text-2xs text-slate-400">{st.teacherName}</p>
                      </div>
                    </td>

                    {/* Main Learning Gaps */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {st.weakConcepts.map((c, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-2xs font-semibold bg-error-50 text-error-700 border border-error-200"
                          >
                            <span>{c.concept}</span>
                            <span className="font-bold opacity-80">({c.score}%)</span>
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Affected Assessments */}
                    <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                      {st.affectedAssessmentsCount} {st.affectedAssessmentsCount === 1 ? 'assessment' : 'assessments'}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {st.status === 'critical' ? (
                        <Badge variant="error" size="sm" dot>Critical Gap</Badge>
                      ) : st.status === 'improving' ? (
                        <Badge variant="success" size="sm" dot>Improving</Badge>
                      ) : (
                        <Badge variant="warning" size="sm" dot>Needs Attention</Badge>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 pr-6 pl-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(st);
                        }}
                        className="text-xs text-slate-600 hover:text-brand-600"
                      >
                        <span>View Detail</span>
                        <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ──── Concise Student Detail Modal ────────────────────── */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4 mb-5">
              <Avatar initials={selectedStudent.avatar} size="lg" color="error" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-500">
                  {selectedStudent.grade} · {selectedStudent.className} · Teacher: {selectedStudent.teacherName}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={selectedStudent.status === 'critical' ? 'error' : 'warning'} size="sm">
                    {selectedStudent.status === 'critical' ? 'Critical Attention' : 'Needs Support'}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    Overall Average: <strong className="text-slate-800">{selectedStudent.overallScore}%</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 my-4">
              {/* Concept Learning Gaps */}
              <div className="rounded-xl border border-error-100 bg-error-50/40 p-4">
                <p className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-error-600" />
                  <span>Identified Concept Gaps (Below 50% threshold):</span>
                </p>
                <div className="space-y-2">
                  {selectedStudent.weakConcepts.map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-error-200/60">
                      <span className="font-semibold text-slate-800">{c.concept}</span>
                      <span className="font-bold text-error-600">{c.score}% mastery</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assessment Context */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5">
                <p className="text-xs font-bold text-slate-900">Assessment Scope:</p>
                <p className="text-xs text-slate-600">
                  Impacted across <strong>{selectedStudent.affectedAssessmentsCount} assessment(s)</strong> in this grading period.
                </p>
                <p className="text-2xs text-slate-400">
                  Last evaluated on {selectedStudent.lastAssessmentDate}.
                </p>
              </div>

              {/* Assigned Intervention */}
              {selectedStudent.interventionAssigned ? (
                <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-4">
                  <p className="text-xs font-bold text-brand-800 mb-1 flex items-center gap-1.5">
                    <Target className="h-4 w-4 text-brand-600" />
                    <span>Active Support Plan:</span>
                  </p>
                  <p className="text-xs text-slate-700">{selectedStudent.interventionAssigned}</p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center">
                  <p className="text-xs text-slate-500 mb-2">No formal intervention recorded yet.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedStudent(null);
                      navigate('/principal/interventions');
                    }}
                    className="text-xs"
                  >
                    Log New Intervention Plan
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedStudent(null);
                  navigate('/principal/interventions');
                }}
              >
                <span>Manage Interventions</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
