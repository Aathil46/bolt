import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Avatar } from '@/components/ui/Avatar';
import {
  schoolStats, classes, teachers, assessments,
} from '@/data/mockData';
import {
  principalImportantUpdates,
  principalLearningProgress,
  principalWeakStudents,
} from '@/data/principalMockData';
import {
  School, Users, ClipboardPen, TrendingUp, AlertTriangle,
  Award, CheckCircle2, UserCog, ArrowRight, ChevronRight,
  Activity, Sparkles, Clock, AlertCircle, TrendingDown,
  Target, ShieldAlert,
} from 'lucide-react';

export function PrincipalDashboard() {
  const navigate = useNavigate();

  // 4.2 School Learning Health status calculation
  // "Healthy — most classes are within the expected range. Needs Attention — meaningful issues are currently present."
  const needsAttentionClassCount = classes.filter(c => c.avgPerformance < 70).length;
  const weakStudentsCount = principalWeakStudents.length;
  const isHealthy = needsAttentionClassCount === 0 && weakStudentsCount < 5;

  return (
    <div className="space-y-6 pb-12">
      {/* ──── Page Header ────────────────────────────────────── */}
      <PageHeader
        title="School Learning Intelligence"
        description="Executive overview of Oakridge High School — answering 'What needs my attention today?'"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/principal/insights')}
              className="flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4 text-brand-600" />
              <span>AI Review</span>
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/principal/weak-students')}
              className="flex items-center gap-1.5 bg-error-600 hover:bg-error-700 text-white"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Weak Students ({weakStudentsCount})</span>
            </Button>
          </div>
        }
      />

      {/* ──── 4.2 School Learning Health Banner ──────────────── */}
      <div className={`rounded-2xl border p-5 sm:p-6 transition-all shadow-xs ${
        isHealthy
          ? 'bg-gradient-to-r from-success-50 via-white to-success-50/50 border-success-200'
          : 'bg-gradient-to-r from-warning-50/70 via-white to-error-50/40 border-warning-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs ${
              isHealthy ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
            }`}>
              {isHealthy ? <CheckCircle2 className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">School Learning Health</span>
                <Badge variant={isHealthy ? 'success' : 'warning'} size="sm" dot>
                  {isHealthy ? 'Healthy — Classes on Track' : 'Needs Attention — Issues Present'}
                </Badge>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {isHealthy
                  ? 'Academic health is within normal baseline parameters across all departments.'
                  : 'Meaningful learning gaps detected across 14 students and 1 underperforming class.'}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Algebra I - Period 2 requires curriculum pacing reinforcement. Grade 10 quadratic concept gaps have active remediation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/principal/classes')}
              className="text-xs"
            >
              Class Breakdown
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/principal/interventions')}
              className="text-xs flex items-center gap-1.5"
            >
              <Target className="h-3.5 w-3.5" />
              <span>Action &amp; Interventions</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ──── 4.1 School Snapshot (Key KPIs) ──────────────────── */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          School Snapshot
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
          <Card className="p-4">
            <div className="flex items-center gap-2.5 mb-2 text-brand-600">
              <Users className="h-4.5 w-4.5" />
              <span className="text-2xs font-semibold uppercase text-slate-400">Total Students</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{schoolStats.totalStudents}</p>
            <p className="text-2xs text-slate-400 mt-0.5">Enrolled Oakridge</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2.5 mb-2 text-success-600">
              <UserCog className="h-4.5 w-4.5" />
              <span className="text-2xs font-semibold uppercase text-slate-400">Teachers</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{schoolStats.totalTeachers}</p>
            <p className="text-2xs text-slate-400 mt-0.5">Active Faculty</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2.5 mb-2 text-info-600">
              <School className="h-4.5 w-4.5" />
              <span className="text-2xs font-semibold uppercase text-slate-400">Classes</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{schoolStats.totalClasses}</p>
            <p className="text-2xs text-slate-400 mt-0.5">Grades 9 – 12</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2.5 mb-2 text-accent-600">
              <TrendingUp className="h-4.5 w-4.5" />
              <span className="text-2xs font-semibold uppercase text-slate-400">Avg Performance</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{schoolStats.avgPerformance}%</p>
            <p className="text-2xs text-success-600 font-medium mt-0.5">+5% vs last term</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2.5 mb-2 text-emerald-600">
              <Award className="h-4.5 w-4.5" />
              <span className="text-2xs font-semibold uppercase text-slate-400">Pass Rate</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{schoolStats.passRate}%</p>
            <p className="text-2xs text-slate-400 mt-0.5">Threshold &gt; 50%</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2.5 mb-2 text-purple-600">
              <ClipboardPen className="h-4.5 w-4.5" />
              <span className="text-2xs font-semibold uppercase text-slate-400">Completion</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{schoolStats.completionRate}%</p>
            <p className="text-2xs text-slate-400 mt-0.5">{schoolStats.totalAssessments} assessments</p>
          </Card>
        </div>
      </div>

      {/* ──── 4.3 Needs Attention (Proactive Problem Surfacing) ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Proactive Alert: Needs Attention
            </h3>
            <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-error-50 text-error-600 border border-error-200">
              3 Problem Areas
            </span>
          </div>
          <span className="text-2xs text-slate-400">Direct drill-down available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Weak Students */}
          <Card className="p-5 border-l-4 border-l-error-500 hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md text-2xs font-bold bg-error-50 text-error-700 uppercase tracking-wide">
                  Weak Students
                </span>
                <span className="text-xs font-extrabold text-error-600">14 Students</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Students with &ge;1 Weak Concept (&lt;50%)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Concentrated in Algebra I - P2 (6 students), Geometry - P5 (4 students), and Algebra II - P3 (4 students).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-2xs text-slate-400">5 interventions active</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/principal/weak-students')}
                className="text-xs text-error-600 hover:text-error-700 hover:bg-error-50 font-bold p-0 h-auto"
              >
                <span>View Problem</span>
                <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </div>
          </Card>

          {/* 2. Classes Needing Attention */}
          <Card className="p-5 border-l-4 border-l-warning-500 hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md text-2xs font-bold bg-warning-50 text-warning-700 uppercase tracking-wide">
                  Class Performance
                </span>
                <span className="text-xs font-extrabold text-warning-600">1 Class Below 70%</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Algebra I - Period 2 (Emily Rodriguez)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Class average is 68%, 10 points below the school average. Pacing and equation fundamentals require support.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-2xs text-slate-400">Grade 9 · 30 students</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/principal/classes')}
                className="text-xs text-warning-700 hover:text-warning-800 hover:bg-warning-50 font-bold p-0 h-auto"
              >
                <span>View Problem</span>
                <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </div>
          </Card>

          {/* 3. Weak Concepts */}
          <Card className="p-5 border-l-4 border-l-brand-500 hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md text-2xs font-bold bg-brand-50 text-brand-700 uppercase tracking-wide">
                  Curriculum Gaps
                </span>
                <span className="text-xs font-extrabold text-brand-600">4 Flagged Concepts</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Vertex Form &amp; HL Theorem Gaps
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Persistent gaps identified across multiple assessments: Vertex Form (42%), Synthetic Division (46%), HL Theorem (48%).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-2xs text-slate-400">School-wide impact</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/principal/insights')}
                className="text-xs text-brand-600 hover:text-brand-700 hover:bg-brand-50 font-bold p-0 h-auto"
              >
                <span>Investigate Gaps</span>
                <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ──── 4.4 Important Updates & 4.5 Learning Progress ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 4.4 Important Updates */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Important Updates</h4>
                <p className="text-2xs text-slate-500">Meaningful changes since last review (not a generic feed)</p>
              </div>
              <Badge variant="default" size="sm">Last 7 Days</Badge>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-slate-100">
              {principalImportantUpdates.map(up => (
                <div
                  key={up.id}
                  onClick={() => up.linkTo && navigate(up.linkTo)}
                  className="p-4 hover:bg-slate-50/70 transition-colors cursor-pointer group flex items-start gap-3"
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    up.impact === 'positive' ? 'bg-success-50 text-success-600' : 'bg-warning-50 text-warning-600'
                  }`}>
                    {up.impact === 'positive' ? <TrendingUp className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {up.title}
                      </p>
                      <span className="text-2xs text-slate-400 whitespace-nowrap">{up.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{up.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* 4.5 Learning Progress (Tracking Improvement) */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Learning Progress</h4>
                <p className="text-2xs text-slate-500">Are identified problems improving over comparable timeframes?</p>
              </div>
              <Badge variant="brand" size="sm">Evidence</Badge>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-slate-100">
              {principalLearningProgress.map(lp => (
                <div key={lp.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-2xs font-bold text-slate-500">{lp.grade}</span>
                      <span className="text-2xs text-slate-300">•</span>
                      <span className="text-xs font-bold text-slate-900 truncate">{lp.area}</span>
                    </div>
                    <div className="flex items-center gap-3 text-2xs text-slate-500">
                      <span>Baseline: <strong>{lp.baselineScore}%</strong></span>
                      <span>Current: <strong>{lp.currentScore}%</strong></span>
                      <span className="text-slate-400">({lp.improvingCount} students improving)</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      lp.change > 0 ? 'bg-success-50 text-success-700' : lp.change < 0 ? 'bg-error-50 text-error-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {lp.change > 0 ? <TrendingUp className="h-3 w-3" /> : lp.change < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                      <span>{lp.change > 0 ? `+${lp.change}%` : `${lp.change}%`}</span>
                    </div>
                    <p className="text-2xs text-slate-400 mt-0.5">
                      {lp.supportCount} in support
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ──── 4.6 Teacher Overview (Descriptive, Non-Gamified) ── */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Teacher &amp; Faculty Learning Overview</h4>
            <p className="text-2xs text-slate-500">
              Descriptive learning-visibility overview — not an HR ranking system.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/principal/teachers')}
            className="text-xs"
          >
            <span>View Full Teacher Drill-down</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-100">
            {teachers.map(t => {
              const needsAttention = t.avgPerformance < 70;
              return (
                <div
                  key={t.id}
                  onClick={() => navigate('/principal/teachers')}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <Avatar initials={t.avatar} size="md" color={needsAttention ? 'warning' : 'brand'} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {t.name}
                        </p>
                        <Badge variant={needsAttention ? 'warning' : 'success'} size="sm">
                          {needsAttention ? 'Support Recommended' : 'Strong Progress'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {t.classCount} class(es) · {t.studentCount} students total · {t.assessmentCount} assessments administered
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 self-start sm:self-auto text-xs">
                    <div>
                      <p className="text-2xs text-slate-400">Class Average</p>
                      <p className="text-base font-bold text-slate-900">{t.avgPerformance}%</p>
                    </div>
                    <div>
                      <p className="text-2xs text-slate-400">Pass Rate</p>
                      <p className="text-base font-bold text-slate-900">{t.passRate}%</p>
                    </div>
                    <div>
                      <p className="text-2xs text-slate-400">Descriptive Status</p>
                      <p className="text-xs font-semibold text-slate-700">
                        {needsAttention ? 'Curriculum pacing support' : 'Consistently meeting benchmarks'}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
