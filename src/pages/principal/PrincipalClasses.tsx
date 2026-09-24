import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { classes, assessments } from '@/data/mockData';
import { principalWeakStudents } from '@/data/principalMockData';
import {
  School, Users, ClipboardPen, TrendingUp, Award,
  AlertTriangle, ChevronRight, BookOpen, CheckCircle2,
  Calendar, ArrowRight,
} from 'lucide-react';

export function PrincipalClasses() {
  const navigate = useNavigate();

  // 5.1 Available Grades (only grades that have classes created)
  const availableGrades = useMemo(() => {
    const gradesSet = new Set(classes.map(c => c.grade));
    // Sort naturally: Grade 9, Grade 10, Grade 11, Grade 12
    return Array.from(gradesSet).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });
  }, []);

  const [selectedGrade, setSelectedGrade] = useState<string>(availableGrades[0] ?? 'Grade 9');

  // 5.2 Available Classes (classes belonging to selected grade)
  const availableClassesInGrade = useMemo(() => {
    return classes.filter(c => c.grade === selectedGrade);
  }, [selectedGrade]);

  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    const initialClass = classes.find(c => c.grade === (availableGrades[0] ?? 'Grade 9'));
    return initialClass?.id ?? classes[0].id;
  });

  // Keep selectedClassId synced when grade changes if previous class is not in the new grade
  const currentClass = useMemo(() => {
    const found = availableClassesInGrade.find(c => c.id === selectedClassId);
    if (found) return found;
    return availableClassesInGrade[0] ?? classes[0];
  }, [availableClassesInGrade, selectedClassId]);

  // 5.3 Available Subjects for current class
  const availableSubjects = [currentClass.subject];

  // 5.4 Class/Subject Overview Metrics
  const classWeakStudents = useMemo(() => {
    return principalWeakStudents.filter(s => s.classId === currentClass.id);
  }, [currentClass]);

  const classAssessments = useMemo(() => {
    return assessments.filter(a => a.classId === currentClass.id && a.status === 'published');
  }, [currentClass]);

  const passRate = useMemo(() => {
    if (classAssessments.length === 0) return 80;
    const avg = classAssessments.reduce((sum, a) => sum + a.passRate, 0) / classAssessments.length;
    return Math.round(avg);
  }, [classAssessments]);

  const passCount = Math.round((currentClass.studentCount * passRate) / 100);

  return (
    <div className="space-y-6 pb-12">
      {/* ──── Page Header ────────────────────────────────────── */}
      <PageHeader
        title="Class Performance"
        description="Drill down through Grade → Class → Subject to inspect learning benchmarks and assessments."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/principal/weak-students')}
            className="flex items-center gap-1.5"
          >
            <AlertTriangle className="h-4 w-4 text-error-600" />
            <span>Weak Students ({principalWeakStudents.length})</span>
          </Button>
        }
      />

      {/* ──── 5.1 & 5.2 Navigation: Grade & Class Hierarchy ─── */}
      <Card className="p-5">
        <div className="space-y-4">
          {/* Breadcrumb Hierarchy Indicator */}
          <div className="flex items-center gap-2 text-xs text-slate-500 pb-2 border-b border-slate-100 flex-wrap">
            <span className="font-semibold text-slate-800">School</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">{selectedGrade}</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{currentClass.name}</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-slate-600">{currentClass.subject}</span>
          </div>

          {/* 5.1 Grade Tabs (Only grades with existing classes) */}
          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Grade (Grades with Active Classes)
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {availableGrades.map(grade => {
                const count = classes.filter(c => c.grade === grade).length;
                const isSelected = selectedGrade === grade;
                return (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => {
                      setSelectedGrade(grade);
                      const firstClass = classes.find(c => c.grade === grade);
                      if (firstClass) setSelectedClassId(firstClass.id);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{grade}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-2xs ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {count} {count === 1 ? 'class' : 'classes'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5.2 Classes in Selected Grade */}
          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Classes in {selectedGrade}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availableClassesInGrade.map(cls => {
                const isSelected = cls.id === currentClass.id;
                const weakCount = principalWeakStudents.filter(s => s.classId === cls.id).length;
                return (
                  <div
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-brand-50/60 border-brand-500 shadow-xs ring-1 ring-brand-500'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-brand-900' : 'text-slate-900'}`}>
                        {cls.name}
                      </p>
                      <p className="text-2xs text-slate-500 truncate mt-0.5">
                        {cls.teacherName} · {cls.studentCount} students
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className={`text-xs font-black ${
                        cls.avgPerformance >= 80 ? 'text-success-600' : cls.avgPerformance >= 70 ? 'text-brand-600' : 'text-error-600'
                      }`}>
                        {cls.avgPerformance}%
                      </span>
                      {weakCount > 0 && (
                        <p className="text-2xs font-semibold text-error-600">
                          {weakCount} weak
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5.3 Available Subjects */}
          <div className="pt-2 flex items-center gap-2">
            <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wide">
              Subject for {currentClass.name}:
            </span>
            {availableSubjects.map(sub => (
              <span key={sub} className="px-2.5 py-1 rounded-md text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200/60 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{sub}</span>
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* ──── 5.4 Class/Subject Overview ─────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {currentClass.name} — Learning Overview
            </h3>
            <p className="text-2xs text-slate-500">
              Taught by {currentClass.teacherName} · Subject: {currentClass.subject}
            </p>
          </div>
          {currentClass.avgPerformance < 70 && (
            <Badge variant="error" size="sm" dot>Needs Pacing Support</Badge>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Total Students */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1.5 text-slate-500">
              <Users className="h-4 w-4" />
              <span className="text-2xs font-semibold uppercase text-slate-400">Total Students</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{currentClass.studentCount}</p>
            <p className="text-2xs text-slate-400 mt-0.5">Enrolled</p>
          </Card>

          {/* Pass Count / Rate */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1.5 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-2xs font-semibold uppercase text-slate-400">Pass Count / Rate</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{passRate}%</p>
            <p className="text-2xs text-slate-500 mt-0.5">{passCount} of {currentClass.studentCount} passing</p>
          </Card>

          {/* Average Performance */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1.5 text-brand-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-2xs font-semibold uppercase text-slate-400">Avg Performance</span>
            </div>
            <p className={`text-2xl font-bold ${
              currentClass.avgPerformance < 70 ? 'text-error-600' : 'text-slate-900'
            }`}>
              {currentClass.avgPerformance}%
            </p>
            <p className="text-2xs text-slate-400 mt-0.5">Across assessments</p>
          </Card>

          {/* Weak Students */}
          <Card className={`p-4 ${classWeakStudents.length > 0 ? 'border-error-200 bg-error-50/20' : ''}`}>
            <div className="flex items-center gap-2 mb-1.5 text-error-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-2xs font-semibold uppercase text-slate-400">Weak Students</span>
            </div>
            <p className="text-2xl font-bold text-error-600">{classWeakStudents.length}</p>
            <p className="text-2xs text-slate-500 mt-0.5">With &ge;1 concept &lt; 50%</p>
          </Card>

          {/* Assessment Count / Activity */}
          <Card className="p-4 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-1.5 text-purple-600">
              <ClipboardPen className="h-4 w-4" />
              <span className="text-2xs font-semibold uppercase text-slate-400">Assessment Count</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{currentClass.assessmentCount}</p>
            <p className="text-2xs text-slate-400 mt-0.5">{classAssessments.length} published active</p>
          </Card>
        </div>
      </div>

      {/* ──── Weak Students in this Class (if any) ──────────── */}
      {classWeakStudents.length > 0 && (
        <Card className="p-5 border-error-200 bg-error-50/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4.5 w-4.5 text-error-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-error-800">
                {classWeakStudents.length} Weak Student(s) in {currentClass.name}
              </h4>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/principal/weak-students')}
              className="text-xs text-error-700 bg-white"
            >
              Open Full Cohort View
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {classWeakStudents.map(st => (
              <div key={st.id} className="p-3 bg-white rounded-xl border border-error-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{st.name}</span>
                  <span className="font-bold text-error-600">{st.overallScore}%</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {st.weakConcepts.map((c, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-error-50 text-error-700 text-2xs font-medium">
                      {c.concept} ({c.score}%)
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ──── 5.5 Assessment Results for the Selected Class ──── */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Assessment Results for {currentClass.name}
            </h4>
            <p className="text-2xs text-slate-500">
              Concise summary of student participation, pass rates, and average mastery.
            </p>
          </div>
          <Badge variant="default" size="sm">
            {classAssessments.length} Published
          </Badge>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold text-slate-400">
                  <th className="py-3 pl-6 pr-3">Assessment Name</th>
                  <th className="py-3 px-4">Completion / Participating</th>
                  <th className="py-3 px-4">Pass Rate</th>
                  <th className="py-3 px-4">Average Score</th>
                  <th className="py-3 pr-6 pl-2 text-right">Concepts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {classAssessments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400 text-xs">
                      No published assessments found for this class yet.
                    </td>
                  </tr>
                ) : (
                  classAssessments.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 pl-6 pr-3">
                        <div>
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">{a.title}</p>
                          <p className="text-2xs text-slate-400">{a.questionCount} questions · {a.duration} min</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className="font-semibold text-slate-800">
                          {a.participation.completed} / {a.participation.total}
                        </span>
                        <span className="text-slate-400 ml-1">
                          ({Math.round((a.participation.completed / a.participation.total) * 100)}%)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-bold text-slate-900">
                        <span className={`px-2 py-0.5 rounded-full text-2xs ${
                          a.passRate >= 80 ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'
                        }`}>
                          {a.passRate}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-bold text-slate-900">
                        {a.avgScore}%
                      </td>
                      <td className="py-3.5 pr-6 pl-2 text-right">
                        <div className="flex items-center justify-end gap-1 flex-wrap">
                          {a.concepts.slice(0, 2).map((c, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-2xs">
                              {c}
                            </span>
                          ))}
                          {a.concepts.length > 2 && (
                            <span className="text-2xs text-slate-400">+{a.concepts.length - 2}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
