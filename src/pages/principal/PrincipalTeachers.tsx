import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { teachers, classes } from '@/data/mockData';
import { principalWeakStudents } from '@/data/principalMockData';

/* ─── Mock Educator Realistic Images ─────────────────────────── */
const TEACHER_PHOTOS: Record<string, string> = {
  u1: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=600', // Sarah Mitchell
  u4: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600&h=600', // Michael Torres
  u5: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=600&h=600', // Emily Rodriguez
};

interface TeacherClassPerformance {
  id: string;
  name: string;
  grade: string;
  subject: string;
  studentCount: number;
  avgPerformance: number;
  passRate: number;
  failRate: number;
  weakStudentCount: number;
  weakConceptCount: number;
  mainGaps: Array<{ concept: string; score: number }>;
}

export function PrincipalTeachers() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Selected teacher state: starts as null unless specified via query param
  const initialTeacherId = useMemo(() => {
    const param = searchParams.get('teacher');
    if (param && teachers.some((t) => t.id === param)) return param;
    return null;
  }, [searchParams]);

  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(initialTeacherId);

  // Compute detailed class student performance for each teacher
  const teacherPerformanceMap = useMemo(() => {
    const map = new Map<string, TeacherClassPerformance[]>();

    teachers.forEach((t) => {
      const teacherClasses = classes.filter((c) => c.teacherId === t.id);

      const detailed: TeacherClassPerformance[] = teacherClasses.map((cls) => {
        const classWeak = principalWeakStudents.filter((ws) => ws.classId === cls.id);

        // Compute gaps from actual student concept results
        const conceptMap = new Map<string, number[]>();
        classWeak.forEach((ws) => {
          ws.weakConcepts.forEach((wc) => {
            const arr = conceptMap.get(wc.concept) || [];
            arr.push(wc.score);
            conceptMap.set(wc.concept, arr);
          });
        });

        // Fallback realistic gaps for display if none in mock
        let gaps: Array<{ concept: string; score: number }> = Array.from(conceptMap.entries()).map(
          ([concept, scores]) => ({
            concept,
            score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
          })
        );

        if (gaps.length === 0 && cls.id === 'c1') {
          gaps = [
            { concept: 'Vertex Form', score: 42 },
            { concept: 'Discriminant', score: 48 },
            { concept: 'Synthetic Division', score: 46 },
          ];
        } else if (gaps.length === 0 && cls.id === 'c5') {
          gaps = [
            { concept: 'Linear Inequalities', score: 44 },
            { concept: 'Graphing Quadratics', score: 46 },
            { concept: 'Factoring Polynomials', score: 48 },
          ];
        } else if (gaps.length === 0 && cls.id === 'c2') {
          gaps = [
            { concept: 'Coordinate Geometry', score: 44 },
            { concept: 'Similarity & Proportions', score: 47 },
            { concept: 'Geometric Proofs', score: 48 },
          ];
        }

        const passRate = cls.avgPerformance >= 80 ? 86 : cls.avgPerformance >= 75 ? 82 : cls.avgPerformance >= 70 ? 77 : 68;
        const failRate = 100 - passRate;

        return {
          id: cls.id,
          name: cls.name,
          grade: cls.grade,
          subject: cls.subject,
          studentCount: cls.studentCount,
          avgPerformance: cls.avgPerformance,
          passRate,
          failRate,
          weakStudentCount: classWeak.length,
          weakConceptCount: gaps.length,
          mainGaps: gaps.slice(0, 3),
        };
      });

      map.set(t.id, detailed);
    });

    return map;
  }, []);

  const selectedTeacher = useMemo(() => {
    if (!selectedTeacherId) return null;
    return teachers.find((t) => t.id === selectedTeacherId) || null;
  }, [selectedTeacherId]);

  const selectedTeacherClasses = useMemo(() => {
    if (!selectedTeacherId) return [];
    return teacherPerformanceMap.get(selectedTeacherId) || [];
  }, [selectedTeacherId, teacherPerformanceMap]);

  return (
    <div className="space-y-6">
      {/* If a teacher is selected: Teacher Detail View */}
      {selectedTeacher ? (
        <div className="space-y-6">
          {/* Back Navigation */}
          <div>
            <button
              type="button"
              onClick={() => setSelectedTeacherId(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-teal-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 text-slate-500" />
              <span>Back to Teachers</span>
            </button>
          </div>

          {/* 3. Selected Teacher Header */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-md overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                <img
                  src={TEACHER_PHOTOS[selectedTeacher.id]}
                  alt={selectedTeacher.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Fallback to stylized SVG placeholder if image network error
                    (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="%23f1f5f9"/><circle cx="40" cy="32" r="14" fill="%2394a3b8"/><path d="M16 68 C 16 52, 64 52, 64 68 Z" fill="%2394a3b8"/></svg>`;
                  }}
                />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {selectedTeacher.name}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mathematics
                </p>
                <p className="text-xs font-semibold text-slate-700 mt-2">
                  {selectedTeacher.classCount} {selectedTeacher.classCount === 1 ? 'Class' : 'Classes'}
                </p>
              </div>
            </div>
          </div>

          {/* 4. Teacher's Classes */}
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 px-1">
                Classes
              </h2>
            </div>

            <div className="space-y-4">
              {selectedTeacherClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white border border-slate-200 rounded-lg p-5 space-y-4"
                >
                  {/* Class Name Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {cls.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {cls.grade} · {cls.studentCount} Students
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/principal/classes?grade=${encodeURIComponent(cls.grade)}&class=${cls.id}`)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors"
                    >
                      <span>Class Overview</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* 5. Class Learning Performance Indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3 bg-slate-50 rounded border border-slate-100">
                      <p className="text-xs text-slate-500">Average Performance</p>
                      <p className="text-lg font-bold text-slate-900 mt-0.5">
                        {cls.avgPerformance}%
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded border border-slate-100">
                      <p className="text-xs text-slate-500">Pass Rate</p>
                      <p className="text-lg font-bold text-slate-900 mt-0.5">
                        {cls.passRate}%
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded border border-slate-100">
                      <p className="text-xs text-slate-500">Fail Rate</p>
                      <p className="text-lg font-bold text-slate-900 mt-0.5">
                        {cls.failRate}%
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded border border-slate-100">
                      <p className="text-xs text-slate-500">Weak Students</p>
                      <p className="text-lg font-bold text-slate-900 mt-0.5">
                        {cls.weakStudentCount}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded border border-slate-100">
                      <p className="text-xs text-slate-500">Weak Concepts</p>
                      <p className="text-lg font-bold text-slate-900 mt-0.5">
                        {cls.weakConceptCount}
                      </p>
                    </div>
                  </div>

                  {/* 6. Main Gaps */}
                  {cls.mainGaps.length > 0 ? (
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-slate-700 mb-2">
                        Main gaps:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cls.mainGaps.map((gap) => (
                          <div
                            key={gap.concept}
                            className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs text-slate-800 flex items-center gap-1.5"
                          >
                            <span className="font-medium">{gap.concept}</span>
                            <span className="text-slate-400">·</span>
                            <span className="font-bold text-slate-900">{gap.score}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No significant concept gaps identified in this class.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 1. Teacher list — initial page */
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Teacher Performance</h1>
            <p className="text-xs text-slate-500 mt-1">Review student learning performance across teaching sections.</p>
          </div>

          {/* Teacher Profile Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                onClick={() => setSelectedTeacherId(teacher.id)}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all hover:border-slate-300 hover:shadow-xs cursor-pointer flex flex-col justify-between"
              >
                {/* Large Framed Mock Teacher Image */}
                <div className="w-full aspect-[4/3] bg-slate-100 overflow-hidden relative border-b border-slate-200">
                  <img
                    src={TEACHER_PHOTOS[teacher.id]}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="225" viewBox="0 0 300 225"><rect width="300" height="225" fill="%23f1f5f9"/><circle cx="150" cy="95" r="42" fill="%2394a3b8"/><path d="M60 215 C 60 155, 240 155, 240 215 Z" fill="%2394a3b8"/></svg>`;
                    }}
                  />
                </div>

                {/* Profile Information */}
                <div className="p-4 space-y-1">
                  <h2 className="text-base font-bold text-slate-900">
                    {teacher.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Mathematics
                  </p>
                </div>

                {/* Class count & Action arrow */}
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    {teacher.classCount} {teacher.classCount === 1 ? 'Class' : 'Classes'}
                  </span>
                  <span className="text-slate-400 group-hover:text-teal-700 transition-colors">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
