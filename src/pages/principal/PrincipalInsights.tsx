import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionTitle } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import {
  Sparkles, AlertCircle, TrendingUp, BookOpen, Users,
  ArrowRight, CheckCircle2, ChevronRight, Target, RefreshCw,
  Layers, ArrowUpRight, HelpCircle,
} from 'lucide-react';
import { principalWeakStudents, principalInterventions } from '@/data/principalMockData';
import { classes } from '@/data/mockData';

export function PrincipalInsights() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'all' | 'students' | 'concepts' | 'classes' | 'gaps' | 'progress'>('all');

  // Compute exact metrics from mock data
  const weakStudentsCount = principalWeakStudents.length; // 14
  const criticalCount = principalWeakStudents.filter((s) => s.status === 'critical').length; // 5
  const improvingCount = principalWeakStudents.filter((s) => s.status === 'improving').length; // 5

  // Collect weak concepts from students
  const conceptGaps = [
    {
      concept: 'Vertex Form',
      subject: 'Algebra II',
      class: 'Period 3 (Grade 10)',
      classId: 'c1',
      affectedStudents: 5,
      avgMastery: 42,
      impact: 'Foundational for polynomial graphing',
      recommendation: 'Targeted graphing workshops and vertex-form transformation exercises.',
    },
    {
      concept: 'Linear Inequalities',
      subject: 'Algebra I',
      class: 'Period 2 (Grade 9)',
      classId: 'c5',
      affectedStudents: 5,
      avgMastery: 44,
      impact: 'Affects multi-step equation mastery',
      recommendation: 'Visual number-line shading practice and algebraic sign-reversal checks.',
    },
    {
      concept: 'Discriminant & Roots',
      subject: 'Algebra II',
      class: 'Period 3 (Grade 10)',
      classId: 'c1',
      affectedStudents: 4,
      avgMastery: 45,
      impact: 'Critical for quadratic formula fluency',
      recommendation: 'Peer-tutoring pairings with Pre-Calculus students.',
    },
    {
      concept: 'Geometric Proofs & Congruence',
      subject: 'Geometry',
      class: 'Period 5 (Grade 9)',
      classId: 'c2',
      affectedStudents: 4,
      avgMastery: 48,
      impact: 'Core logical reasoning benchmark',
      recommendation: 'Structured two-column proof step-by-step scaffolds.',
    },
  ];

  // Classes needing attention (< 75% or high weak student density)
  const classesNeedingAttention = [
    {
      id: 'c5',
      name: 'Algebra I - Period 2',
      grade: 'Grade 9',
      teacher: 'Emily Rodriguez',
      avgScore: 68,
      passRate: 72,
      weakStudents: 5,
      issue: '11% below department benchmark. Core struggles in linear inequalities & quadratic roots.',
      status: 'Critical Attention',
    },
    {
      id: 'c2',
      name: 'Geometry - Period 5',
      grade: 'Grade 9',
      teacher: 'Sarah Mitchell',
      avgScore: 72,
      passRate: 79,
      weakStudents: 4,
      issue: 'Congruence proofs proving challenging for 25% of the cohort.',
      status: 'Moderate Attention',
    },
  ];

  // Meaningful learning gaps
  const learningGaps = [
    {
      title: 'Grade 9 to 10 Algebraic Readiness Gap',
      description: 'Incoming Grade 10 students entering Algebra II show a 14% deficit in foundational polynomial factoring compared to students who completed advanced prep.',
      affectedGroups: 'Algebra I (Period 2) & Algebra II (Period 3)',
      gapMagnitude: '14% difference',
      nextAction: 'Align 9th grade curriculum pacing with 10th grade prerequisite benchmarks.',
    },
    {
      title: 'Advanced vs Core Subject Variance',
      description: 'Pre-Calculus (85% avg) is outperforming Algebra I (68% avg) by 17 percentage points, driven by student engagement and homework completion differences.',
      affectedGroups: 'Math Department - Grade 9 vs Grade 11',
      gapMagnitude: '17% difference',
      nextAction: 'Replicate Pre-Calc problem-set pacing in Grade 9 Algebra sections.',
    },
  ];

  // Progress on previously identified problems
  const progressItems = principalInterventions.filter((i) => i.measurableChange);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Review / School Learning Intelligence"
        description="Surface important learning problems and make them easy to investigate and act upon."
      />

      {/* Overview Intelligence Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-6 relative overflow-hidden border border-brand-800/40 shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm text-brand-300">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Executive School Learning Intelligence</h2>
                <p className="text-xs text-slate-300">
                  Synthesized across {classes.length} classes, 135 students, and recent assessments.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="brand" size="sm" dot>
                Live Synthesis
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm">
              <p className="text-2xs uppercase tracking-wide text-slate-300 font-semibold">Weak Students (&lt;50%)</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-white">{weakStudentsCount}</span>
                <span className="text-2xs text-amber-300">across 3 classes</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm">
              <p className="text-2xs uppercase tracking-wide text-slate-300 font-semibold">Critical Concept Gaps</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-white">{conceptGaps.length}</span>
                <span className="text-2xs text-red-300">&lt;50% mastery</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm">
              <p className="text-2xs uppercase tracking-wide text-slate-300 font-semibold">Classes Needing Focus</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-white">{classesNeedingAttention.length}</span>
                <span className="text-2xs text-amber-300">below 75% avg</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm">
              <p className="text-2xs uppercase tracking-wide text-slate-300 font-semibold">Active Interventions</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-white">{principalInterventions.length}</span>
                <span className="text-2xs text-emerald-300">{improvingCount} improving</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'All Intelligence Areas' },
          { key: 'students', label: `Weak Students (${weakStudentsCount})` },
          { key: 'concepts', label: `Weak Concepts (${conceptGaps.length})` },
          { key: 'classes', label: `Classes Needing Attention (${classesNeedingAttention.length})` },
          { key: 'gaps', label: `Learning Gaps (${learningGaps.length})` },
          { key: 'progress', label: `Intervention Progress (${progressItems.length})` },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveSection(item.key as typeof activeSection)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeSection === item.key
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 8.1 Weak Students Intelligence */}
      {(activeSection === 'all' || activeSection === 'students') && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4.5 w-4.5 text-red-500" />
                  <h3 className="text-sm font-bold text-slate-900">1. Weak Students Intelligence</h3>
                  <Badge variant="error" size="sm">{weakStudentsCount} Students</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Students with at least one concept scoring below 50% under standard evaluation rules.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/principal/weak-students')}
                className="self-start sm:self-auto"
              >
                Inspect All 14 Weak Students <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-100">
                <p className="text-xs font-bold text-red-900">Critical Priority ({criticalCount})</p>
                <p className="text-2xs text-red-700 mt-0.5">Multiple weak concepts with no recent test recovery.</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {principalWeakStudents
                    .filter((s) => s.status === 'critical')
                    .slice(0, 3)
                    .map((s) => (
                      <span key={s.id} className="text-2xs px-2 py-0.5 rounded bg-white font-medium text-red-800 border border-red-200">
                        {s.name} ({s.className.split(' - ')[0]})
                      </span>
                    ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100">
                <p className="text-xs font-bold text-amber-900">Needs Attention (4)</p>
                <p className="text-2xs text-amber-700 mt-0.5">Single concept gap (&lt;50%) currently under observation.</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {principalWeakStudents
                    .filter((s) => s.status === 'needs-attention')
                    .slice(0, 3)
                    .map((s) => (
                      <span key={s.id} className="text-2xs px-2 py-0.5 rounded bg-white font-medium text-amber-800 border border-amber-200">
                        {s.name} ({s.className.split(' - ')[0]})
                      </span>
                    ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <p className="text-xs font-bold text-emerald-900">Showing Improvement ({improvingCount})</p>
                <p className="text-2xs text-emerald-700 mt-0.5">Active intervention resulting in positive score trend.</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {principalWeakStudents
                    .filter((s) => s.status === 'improving')
                    .slice(0, 3)
                    .map((s) => (
                      <span key={s.id} className="text-2xs px-2 py-0.5 rounded bg-white font-medium text-emerald-800 border border-emerald-200">
                        {s.name} ({s.className.split(' - ')[0]})
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* 8.2 Weak Concepts Intelligence */}
      {(activeSection === 'all' || activeSection === 'concepts') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-4.5 w-4.5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">2. Weak Concepts Across Relevant Assessments</h3>
              <Badge variant="warning" size="sm">Significant Gaps</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Concepts showing significant learning gaps across classes that require targeted instruction or remediation.
            </p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conceptGaps.map((cg) => (
                <div
                  key={cg.concept}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{cg.concept}</h4>
                        <p className="text-xs text-slate-500">{cg.subject} · {cg.class}</p>
                      </div>
                      <Badge variant="error" size="sm">
                        {cg.avgMastery}% Mastery
                      </Badge>
                    </div>

                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between text-2xs text-slate-500">
                        <span>Cohort Mastery Gap</span>
                        <span className="font-semibold text-red-600">{cg.affectedStudents} students &lt;50%</span>
                      </div>
                      <Progress value={cg.avgMastery} size="sm" variant="error" />
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-2">
                      <p className="font-semibold text-slate-700">Root Issue: <span className="font-normal">{cg.impact}</span></p>
                      <p className="font-semibold text-slate-700 mt-1">Recommended Action: <span className="font-normal text-slate-600">{cg.recommendation}</span></p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/principal/weak-students?class=${cg.classId}`)}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                    >
                      View Affected Students <ArrowRight className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => navigate(`/principal/classes?class=${cg.classId}`)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Class Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* 8.3 Classes Needing Attention */}
      {(activeSection === 'all' || activeSection === 'classes') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">3. Classes Needing Attention</h3>
              <Badge variant="warning" size="sm">{classesNeedingAttention.length} Classes</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Sections performing below the school expected threshold (average &lt;75% or pass rate &lt;80%).
            </p>
          </CardHeader>
          <CardBody className="space-y-3">
            {classesNeedingAttention.map((cls) => (
              <div
                key={cls.id}
                className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{cls.name}</h4>
                    <span className="text-xs text-slate-500">· Taught by {cls.teacher}</span>
                    <Badge variant={cls.avgScore < 70 ? 'error' : 'warning'} size="sm">
                      {cls.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">{cls.issue}</p>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Avg Score</p>
                    <p className="text-sm font-bold text-slate-900">{cls.avgScore}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Pass Rate</p>
                    <p className="text-sm font-bold text-slate-900">{cls.passRate}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Weak Students</p>
                    <p className="text-sm font-bold text-red-600">{cls.weakStudents}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/principal/classes?class=${cls.id}`)}
                  >
                    Drill-Down <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {/* 8.4 Meaningful School/Class Learning Gaps */}
      {(activeSection === 'all' || activeSection === 'gaps') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">4. Meaningful School / Class Learning Gaps</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Structural learning differences across cohorts and prerequisites that warrant instructional alignment.
            </p>
          </CardHeader>
          <CardBody className="space-y-3">
            {learningGaps.map((gap) => (
              <div
                key={gap.title}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{gap.title}</h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {gap.gapMagnitude}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{gap.description}</p>
                  <p className="text-2xs text-slate-500">
                    <span className="font-semibold text-slate-700">Affected Groups:</span> {gap.affectedGroups}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200 max-w-sm flex-shrink-0">
                  <p className="text-2xs font-semibold uppercase text-brand-600">Recommended Action</p>
                  <p className="text-xs text-slate-700 mt-0.5">{gap.nextAction}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {/* 8.5 Progress on Previously Identified Problems */}
      {(activeSection === 'all' || activeSection === 'progress') && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    5. Progress on Previously Identified Problems
                  </h3>
                  <Badge variant="success" size="sm">Evidence of Impact</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Outcomes and measurable improvements where comparable historical assessment data exists.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/principal/interventions')}
              >
                View Full Action Status <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {progressItems.map((prog) => (
              <div
                key={prog.id}
                className="p-4 rounded-xl border border-slate-200 bg-emerald-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{prog.problem}</h4>
                    <Badge variant="success" size="sm">
                      {prog.measurableChange}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">{prog.outcome}</p>
                  <p className="text-2xs text-slate-400">
                    Target: {prog.targetName} · Action: {prog.action} ({prog.responsibleTeacher})
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate('/principal/interventions')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300"
                  >
                    View in Actions Log
                  </button>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {/* Advisory Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <Sparkles className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500">
          AssessAI Learning Intelligence synthesizes deterministic concept scores (&lt;50% thresholds) to surface actionable insights.
          All recommendations are designed to trigger concrete instructional interventions (Identify → Act → Measure).
        </p>
      </div>
    </div>
  );
}
