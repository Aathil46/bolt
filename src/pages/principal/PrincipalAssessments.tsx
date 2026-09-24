import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/StatCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { assessments, classes, teachers } from '@/data/mockData';
import { principalWeakStudents } from '@/data/principalMockData';
import {
  ClipboardPen, Search, Filter, CheckCircle2, AlertCircle,
  Eye, Calendar, Users, BookOpen, ArrowRight, ExternalLink,
} from 'lucide-react';

interface SchoolAssessmentItem {
  id: string;
  title: string;
  classId: string;
  className: string;
  grade: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  date: string;
  dueDate: string;
  completedStudents: number;
  totalStudents: number;
  completionRate: number;
  avgScore: number;
  passRate: number;
  status: 'published' | 'draft' | 'closed';
  concepts: string[];
  weakStudentsCount: number;
}

export function PrincipalAssessments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedAssessment, setSelectedAssessment] = useState<SchoolAssessmentItem | null>(null);

  // Compile school-wide assessment records matching spec requirements
  const schoolAssessments: SchoolAssessmentItem[] = useMemo(() => {
    // Base assessments from mockData
    const baseList: SchoolAssessmentItem[] = assessments.map((a) => {
      const cls = classes.find((c) => c.id === a.classId);
      const teacher = teachers.find((t) => t.id === cls?.teacherId);
      const weakInClass = principalWeakStudents.filter((ws) => ws.classId === a.classId);
      
      const completed = a.participation.completed;
      const total = a.participation.total;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        id: a.id,
        title: a.title,
        classId: a.classId,
        className: a.className,
        grade: cls?.grade || 'Grade 10',
        subject: cls?.subject || 'Mathematics',
        teacherId: cls?.teacherId || 'u1',
        teacherName: cls?.teacherName || teacher?.name || 'Sarah Mitchell',
        teacherAvatar: teacher?.avatar || 'SM',
        date: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Sep 1, 2025',
        dueDate: a.dueDate ? new Date(a.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Sep 10, 2025',
        completedStudents: completed,
        totalStudents: total,
        completionRate,
        avgScore: a.avgScore,
        passRate: a.passRate,
        status: a.status as 'published' | 'draft' | 'closed',
        concepts: a.concepts,
        weakStudentsCount: weakInClass.length,
      };
    });

    // Supplement with class c4 (Statistics) and c5 (Algebra I) assessments for realistic school visibility
    const extraAssessments: SchoolAssessmentItem[] = [
      {
        id: 'a-c5-1',
        title: 'Linear Inequalities & Graphing',
        classId: 'c5',
        className: 'Algebra I - Period 2',
        grade: 'Grade 9',
        subject: 'Mathematics',
        teacherId: 'u5',
        teacherName: 'Emily Rodriguez',
        teacherAvatar: 'ER',
        date: 'Sep 2, 2025',
        dueDate: 'Sep 9, 2025',
        completedStudents: 28,
        totalStudents: 30,
        completionRate: 93,
        avgScore: 68,
        passRate: 72,
        status: 'published',
        concepts: ['Linear Inequalities', 'Graphing Quadratics', 'Slope-Intercept'],
        weakStudentsCount: 5,
      },
      {
        id: 'a-c4-1',
        title: 'Probability Distributions & Variance',
        classId: 'c4',
        className: 'Statistics - Period 1',
        grade: 'Grade 12',
        subject: 'Mathematics',
        teacherId: 'u4',
        teacherName: 'Michael Torres',
        teacherAvatar: 'MT',
        date: 'Aug 29, 2025',
        dueDate: 'Sep 5, 2025',
        completedStudents: 21,
        totalStudents: 22,
        completionRate: 95,
        avgScore: 81,
        passRate: 86,
        status: 'published',
        concepts: ['Normal Distribution', 'Standard Deviation', 'Confidence Intervals'],
        weakStudentsCount: 0,
      },
    ];

    return [...baseList, ...extraAssessments].filter((a) => a.status === 'published');
  }, []);

  // Filter available grades to only non-empty ones
  const availableGrades = useMemo(() => {
    const gradesSet = new Set<string>();
    classes.forEach((c) => gradesSet.add(c.grade));
    return Array.from(gradesSet).sort();
  }, []);

  // Filtered assessments
  const filteredAssessments = useMemo(() => {
    return schoolAssessments.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.concepts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGrade = selectedGrade === 'all' || a.grade === selectedGrade;
      const matchesClass = selectedClass === 'all' || a.classId === selectedClass;

      return matchesSearch && matchesGrade && matchesClass;
    });
  }, [schoolAssessments, searchQuery, selectedGrade, selectedClass]);

  // High-level aggregates
  const totalCompleted = schoolAssessments.reduce((sum, a) => sum + a.completedStudents, 0);
  const totalExpected = schoolAssessments.reduce((sum, a) => sum + a.totalStudents, 0);
  const overallCompletionRate = totalExpected > 0 ? Math.round((totalCompleted / totalExpected) * 100) : 0;
  const overallAvgScore = Math.round(
    schoolAssessments.reduce((sum, a) => sum + a.avgScore, 0) / Math.max(schoolAssessments.length, 1)
  );
  const overallPassRate = Math.round(
    schoolAssessments.reduce((sum, a) => sum + a.passRate, 0) / Math.max(schoolAssessments.length, 1)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessment Results"
        description="Concise school-wide visibility into assessment activity, completion, and student mastery."
      />

      {/* Snapshot summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-2xs font-semibold uppercase tracking-wide text-slate-400">Total Assessments</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{schoolAssessments.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Administered across all grades</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xs font-semibold uppercase tracking-wide text-slate-400">School Completion</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{overallCompletionRate}%</p>
          <p className="text-xs text-slate-500 mt-0.5">{totalCompleted} of {totalExpected} submissions</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xs font-semibold uppercase tracking-wide text-slate-400">Average Score</p>
          <p className="text-2xl font-bold text-brand-600 mt-1">{overallAvgScore}%</p>
          <p className="text-xs text-slate-500 mt-0.5">School-wide assessment mean</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xs font-semibold uppercase tracking-wide text-slate-400">Pass Rate</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{overallPassRate}%</p>
          <p className="text-xs text-slate-500 mt-0.5">Scoring 70% or higher</p>
        </Card>
      </div>

      {/* Controls & Filter bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search assessment, class, teacher, or concept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500">Grade:</span>
              <select
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  setSelectedClass('all');
                }}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Grades</option>
                {availableGrades.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500">Class:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Classes</option>
                {classes
                  .filter((c) => selectedGrade === 'all' || c.grade === selectedGrade)
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
            </div>

            {(searchQuery || selectedGrade !== 'all' || selectedClass !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGrade('all');
                  setSelectedClass('all');
                }}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 underline"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* 7. Assessment Results Table (aligned with specification fields) */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-2xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Assessment</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Teacher</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Students / Completion</th>
                <th className="py-3 px-4">Average Score</th>
                <th className="py-3 px-4">Pass Rate</th>
                <th className="py-3 px-4 text-right">Drill-Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAssessments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-sm">
                    No assessments match your current filters.
                  </td>
                </tr>
              ) : (
                filteredAssessments.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Assessment */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-slate-900">{a.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {a.concepts.slice(0, 2).map((c) => (
                            <span key={c} className="text-2xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {c}
                            </span>
                          ))}
                          {a.concepts.length > 2 && (
                            <span className="text-2xs text-slate-400">+{a.concepts.length - 2} more</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-medium text-slate-800 block">{a.className}</span>
                      <span className="text-2xs text-slate-400">{a.grade}</span>
                    </td>

                    {/* Teacher */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar initials={a.teacherAvatar} size="sm" color="brand" />
                        <span className="text-xs font-medium text-slate-800">{a.teacherName}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                      {a.date}
                    </td>

                    {/* Students / Completion */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-700 font-semibold">
                            {a.completedStudents}/{a.totalStudents}
                          </span>
                          <span className="text-2xs text-slate-500 font-medium">
                            {a.completionRate}%
                          </span>
                        </div>
                        <div className="w-24">
                          <Progress
                            value={a.completionRate}
                            size="sm"
                            variant={a.completionRate >= 85 ? 'success' : 'warning'}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Average Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16">
                          <Progress
                            value={a.avgScore}
                            size="sm"
                            variant={a.avgScore >= 75 ? 'success' : 'warning'}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-800">{a.avgScore}%</span>
                      </div>
                    </td>

                    {/* Pass Rate */}
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={a.passRate >= 80 ? 'success' : a.passRate >= 70 ? 'warning' : 'error'}
                        size="sm"
                      >
                        {a.passRate}% pass
                      </Badge>
                    </td>

                    {/* Drill-Down Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedAssessment(a)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-brand-300 hover:text-brand-600 transition-all shadow-2xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Summary
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* School-level Assessment Drill-Down Modal (Strictly avoids duplicating question-level teacher workflow) */}
      {selectedAssessment && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAssessment(null)}
          title={`Assessment Summary: ${selectedAssessment.title}`}
          size="lg"
        >
          <div className="space-y-5">
            {/* Header info bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div>
                <p className="text-2xs text-slate-400 uppercase font-semibold">Class</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedAssessment.className}</p>
              </div>
              <div>
                <p className="text-2xs text-slate-400 uppercase font-semibold">Instructor</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedAssessment.teacherName}</p>
              </div>
              <div>
                <p className="text-2xs text-slate-400 uppercase font-semibold">Administered</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedAssessment.date}</p>
              </div>
              <div>
                <p className="text-2xs text-slate-400 uppercase font-semibold">Participation</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  {selectedAssessment.completedStudents}/{selectedAssessment.totalStudents} ({selectedAssessment.completionRate}%)
                </p>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">Average Performance</span>
                  <span className="text-base font-bold text-brand-600">{selectedAssessment.avgScore}%</span>
                </div>
                <Progress
                  value={selectedAssessment.avgScore}
                  size="md"
                  variant={selectedAssessment.avgScore >= 75 ? 'success' : 'warning'}
                />
                <p className="text-2xs text-slate-400 mt-2">
                  School target benchmark: ≥75%
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">Pass Rate</span>
                  <span className="text-base font-bold text-emerald-600">{selectedAssessment.passRate}%</span>
                </div>
                <Progress
                  value={selectedAssessment.passRate}
                  size="md"
                  variant={selectedAssessment.passRate >= 75 ? 'success' : 'warning'}
                />
                <p className="text-2xs text-slate-400 mt-2">
                  {selectedAssessment.passRate >= 75 ? 'Meets expected mastery threshold' : 'Under performing threshold'}
                </p>
              </div>
            </div>

            {/* Concepts Assessed */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Concepts Tested in this Assessment
              </h4>
              <div className="space-y-2">
                {selectedAssessment.concepts.map((concept, idx) => {
                  // Estimated concept score based on assessment avg
                  const estimatedScore = Math.max(38, Math.min(95, selectedAssessment.avgScore + ((idx * 13) % 25) - 10));
                  const isConceptWeak = estimatedScore < 50;
                  return (
                    <div
                      key={concept}
                      className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-semibold text-slate-800">{concept}</span>
                        {isConceptWeak && (
                          <span className="ml-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-2xs font-semibold bg-red-100 text-red-700">
                            Concept Gap &lt;50%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24">
                          <Progress
                            value={estimatedScore}
                            size="sm"
                            variant={estimatedScore >= 70 ? 'success' : estimatedScore >= 50 ? 'warning' : 'error'}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 w-10 text-right">{estimatedScore}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Learning Notice & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                {selectedAssessment.weakStudentsCount > 0 ? (
                  <span className="text-amber-700 font-medium">
                    ⚠️ {selectedAssessment.weakStudentsCount} students in this class have identified learning gaps.
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium">
                    ✓ All participating students are maintaining adequate concept mastery.
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedAssessment.weakStudentsCount > 0 && (
                  <button
                    onClick={() => {
                      setSelectedAssessment(null);
                      navigate(`/principal/weak-students?class=${selectedAssessment.classId}`);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                  >
                    View Weak Students
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedAssessment(null);
                    navigate(`/principal/classes?grade=${encodeURIComponent(selectedAssessment.grade)}&class=${selectedAssessment.classId}`);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 inline-flex items-center gap-1"
                >
                  Class Performance <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
