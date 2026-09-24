import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionTitle } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { teachers, classes, assessments } from '@/data/mockData';
import { principalWeakStudents } from '@/data/principalMockData';
import {
  Users, ClipboardPen, TrendingUp, AlertTriangle, CheckCircle2,
  ChevronRight, ArrowRight, BookOpen, AlertCircle, Sparkles, Filter,
} from 'lucide-react';

interface TeacherLearningStats {
  id: string;
  name: string;
  email: string;
  avatar: string;
  classCount: number;
  studentCount: number;
  avgPerformance: number;
  passRate: number;
  status: 'healthy' | 'needs-attention';
  statusReason: string;
  classes: Array<{
    id: string;
    name: string;
    grade: string;
    subject: string;
    studentCount: number;
    avgPerformance: number;
    passRate: number;
    weakStudentsCount: number;
    weakConcepts: string[];
    assessmentCount: number;
    completionRate: number;
  }>;
}

export function PrincipalTeachers() {
  const navigate = useNavigate();

  // Map each teacher with exact class learning data and weak student/concept info
  const teacherStats: TeacherLearningStats[] = teachers.map((t) => {
    const teacherClasses = classes.filter((c) => c.teacherId === t.id);

    const detailedClasses = teacherClasses.map((c) => {
      // Find weak students belonging to this class
      const classWeakStudents = principalWeakStudents.filter((ws) => ws.classId === c.id);
      
      // Collect unique weak concepts in this class
      const weakConceptSet = new Set<string>();
      classWeakStudents.forEach((ws) => {
        ws.weakConcepts.forEach((wc) => weakConceptSet.add(wc.concept));
      });

      // Find published assessments for this class
      const classAssessments = assessments.filter((a) => a.classId === c.id);
      const passRate = c.avgPerformance >= 80 ? 88 : c.avgPerformance >= 75 ? 82 : c.avgPerformance >= 70 ? 76 : 68;
      
      // Average completion rate across assessments
      const completionRate = classAssessments.length > 0
        ? Math.round(
            classAssessments.reduce(
              (acc, a) => acc + (a.participation.completed / Math.max(a.participation.total, 1)) * 100,
              0
            ) / classAssessments.length
          )
        : 92;

      return {
        id: c.id,
        name: c.name,
        grade: c.grade,
        subject: c.subject,
        studentCount: c.studentCount,
        avgPerformance: c.avgPerformance,
        passRate,
        weakStudentsCount: classWeakStudents.length,
        weakConcepts: Array.from(weakConceptSet),
        assessmentCount: c.assessmentCount,
        completionRate,
      };
    });

    const isNeedsAttention = detailedClasses.some((c) => c.avgPerformance < 70 || c.weakStudentsCount >= 5);

    return {
      id: t.id,
      name: t.name,
      email: t.email,
      avatar: t.avatar,
      classCount: detailedClasses.length,
      studentCount: detailedClasses.reduce((sum, c) => sum + c.studentCount, 0),
      avgPerformance: t.avgPerformance,
      passRate: t.passRate,
      status: isNeedsAttention ? 'needs-attention' : 'healthy',
      statusReason: isNeedsAttention
        ? 'Sections with learning gaps identified'
        : 'Sections performing within expected range',
      classes: detailedClasses,
    };
  });

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teacherStats[0]?.id || 'u1');
  const [filterStatus, setFilterStatus] = useState<'all' | 'needs-attention' | 'healthy'>('all');

  const filteredTeachers = teacherStats.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const selectedTeacher = teacherStats.find((t) => t.id === selectedTeacherId) || teacherStats[0];

  const totalClasses = teacherStats.reduce((acc, t) => acc + t.classCount, 0);
  const teachersNeedingAttention = teacherStats.filter((t) => t.status === 'needs-attention').length;
  const healthyTeachers = teacherStats.filter((t) => t.status === 'healthy').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Performance"
        description="Learning visibility across teaching sections to support academic interventions and instructional leadership."
      />

      {/* Visibility notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <Sparkles className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-slate-800">
            School Learning Visibility (Non-Personnel / Non-HR)
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            This view is designed solely to understand student mastery and class-level learning needs across teaching sections.
            It provides actionable visibility for curriculum support and student intervention, not staff ranking.
          </p>
        </div>
      </div>

      {/* Top summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wide">Total Teachers</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{teacherStats.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">{totalClasses} active class sections</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wide">Sections In Expected Range</p>
          <p className="text-2xl font-bold text-success-600 mt-1">{healthyTeachers}</p>
          <p className="text-xs text-slate-500 mt-0.5">Classes maintaining ≥75% pass</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wide">Sections Needing Support</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{teachersNeedingAttention}</p>
          <p className="text-xs text-slate-500 mt-0.5">Class sections with &lt;70% avg</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wide">School Average</p>
          <p className="text-2xl font-bold text-brand-600 mt-1">76%</p>
          <p className="text-xs text-slate-500 mt-0.5">80% overall pass rate</p>
        </Card>
      </div>

      {/* 6.1 Teacher List */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <SectionTitle
            title="6.1 Teacher Learning Overview"
            description="Descriptive performance and learning indicators across teachers"
          />
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Teachers ({teacherStats.length})
            </button>
            <button
              onClick={() => setFilterStatus('needs-attention')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterStatus === 'needs-attention'
                  ? 'bg-amber-100 text-amber-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-amber-800'
              }`}
            >
              Needs Attention ({teachersNeedingAttention})
            </button>
            <button
              onClick={() => setFilterStatus('healthy')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterStatus === 'healthy'
                  ? 'bg-emerald-100 text-emerald-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              Expected Range ({healthyTeachers})
            </button>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-2xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Teacher</th>
                  <th className="py-3 px-4">Classes</th>
                  <th className="py-3 px-4">Total Students</th>
                  <th className="py-3 px-4">Average Performance</th>
                  <th className="py-3 px-4">Pass Rate / Indicator</th>
                  <th className="py-3 px-4 text-right">Drill-Down</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTeachers.map((t) => {
                  const isSelected = t.id === selectedTeacher?.id;
                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTeacherId(t.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-brand-50/60 font-medium' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar initials={t.avatar} size="md" color="brand" />
                          <div>
                            <p className="font-semibold text-slate-900">{t.name}</p>
                            <p className="text-xs text-slate-500">{t.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
                          <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                          {t.classCount} {t.classCount === 1 ? 'class' : 'classes'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {t.studentCount} students
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24">
                            <Progress
                              value={t.avgPerformance}
                              size="sm"
                              variant={t.avgPerformance >= 75 ? 'success' : 'warning'}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-800">{t.avgPerformance}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-700">{t.passRate}% pass</span>
                          <Badge
                            variant={t.status === 'healthy' ? 'success' : 'warning'}
                            size="sm"
                            dot
                          >
                            {t.status === 'healthy' ? 'Within Range' : 'Attention Needed'}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTeacherId(t.id);
                          }}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-brand-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-brand-300 hover:text-brand-600'
                          }`}
                        >
                          {isSelected ? 'Viewing Classes' : 'Select Teacher'}
                          <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 6.2 Teacher Drill-down */}
      {selectedTeacher && (
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  Teacher Drill-Down
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Classes taught by {selectedTeacher.name}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed class-level learning indicators, weak students count, and concept gaps for {selectedTeacher.name}.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                {selectedTeacher.classes.length} class sections · {selectedTeacher.studentCount} students
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {selectedTeacher.classes.map((cls) => {
              const isClassAttention = cls.avgPerformance < 75 || cls.weakStudentsCount > 0;
              return (
                <Card key={cls.id} className="border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="p-4 border-b border-slate-100 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{cls.name}</h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {cls.grade} · {cls.subject}
                        </p>
                      </div>
                      <Badge
                        variant={cls.avgPerformance >= 75 ? 'success' : 'warning'}
                        size="sm"
                      >
                        {cls.avgPerformance >= 75 ? 'Healthy' : 'Needs Support'}
                      </Badge>
                    </div>

                    {/* Class Metrics */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <p className="text-2xs text-slate-400 font-medium">Students</p>
                          <p className="text-base font-bold text-slate-900">{cls.studentCount}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <p className="text-2xs text-slate-400 font-medium">Pass Rate</p>
                          <p className="text-base font-bold text-slate-900">{cls.passRate}%</p>
                        </div>
                      </div>

                      {/* Performance Bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-500">Class Average</span>
                          <span className="font-bold text-slate-800">{cls.avgPerformance}%</span>
                        </div>
                        <Progress
                          value={cls.avgPerformance}
                          size="sm"
                          variant={cls.avgPerformance >= 75 ? 'success' : 'warning'}
                        />
                      </div>

                      {/* Assessment activity & completion */}
                      <div className="flex items-center justify-between py-2 border-y border-slate-100 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <ClipboardPen className="h-3.5 w-3.5 text-slate-400" />
                          <span>{cls.assessmentCount} Assessments</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>{cls.completionRate}% completion</span>
                        </div>
                      </div>

                      {/* Weak Students & Weak Concepts */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-700">Weak Students:</span>
                          {cls.weakStudentsCount > 0 ? (
                            <button
                              onClick={() => navigate(`/principal/weak-students?class=${cls.id}`)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
                            >
                              <AlertCircle className="h-3.5 w-3.5" />
                              {cls.weakStudentsCount} students &lt;50%
                            </button>
                          ) : (
                            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> 0 weak students
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="text-2xs font-semibold uppercase text-slate-400 mb-1.5">
                            Weak Concepts ({cls.weakConcepts.length})
                          </p>
                          {cls.weakConcepts.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {cls.weakConcepts.map((concept) => (
                                <span
                                  key={concept}
                                  className="inline-block px-2 py-0.5 rounded text-2xs font-medium bg-red-50 text-red-700 border border-red-200"
                                >
                                  {concept}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">No significant concept gaps identified.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate(`/principal/classes?grade=${encodeURIComponent(cls.grade)}&class=${cls.id}`)}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                    >
                      Class Overview <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    {cls.weakStudentsCount > 0 && (
                      <button
                        onClick={() => navigate(`/principal/weak-students?class=${cls.id}`)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs"
                      >
                        Inspect Weak Students
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
