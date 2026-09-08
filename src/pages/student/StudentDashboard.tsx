import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionTitle } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { EmptyState } from '@/components/ui/EmptyState';
import { studentDashboardData } from '@/data/mockData';
import {
  BookOpen, ClipboardPen, Award, TrendingUp, Plus,
  ArrowRight, Clock, FileText, CheckCircle2, AlertCircle,
  Sparkles, Target, ChevronRight, Flame,
} from 'lucide-react';

export function StudentDashboard() {
  const navigate = useNavigate();
  const data = studentDashboardData;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, Alex"
        description="Here's your learning overview and what's coming up."
        action={<Button onClick={() => navigate('/student/classes')}><Plus className="h-4 w-4" /> Join Class</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><BookOpen className="h-4.5 w-4.5" /></div>
            <div><p className="text-2xs text-slate-400 uppercase">Classes</p><p className="text-xl font-bold text-slate-900">{data.enrolledClasses.length}</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-600"><ClipboardPen className="h-4.5 w-4.5" /></div>
            <div><p className="text-2xs text-slate-400 uppercase">To Do</p><p className="text-xl font-bold text-slate-900">{data.toDoAssessments.length}</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-50 text-success-600"><CheckCircle2 className="h-4.5 w-4.5" /></div>
            <div><p className="text-2xs text-slate-400 uppercase">Completed</p><p className="text-xl font-bold text-slate-900">{data.completedAssessments.length}</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info-50 text-info-600"><Award className="h-4.5 w-4.5" /></div>
            <div><p className="text-2xs text-slate-400 uppercase">Avg Score</p><p className="text-xl font-bold text-slate-900">{Math.round(data.completedAssessments.reduce((s, a) => s + a.score, 0) / data.completedAssessments.length)}%</p></div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* To Do Assessments */}
          <Card>
            <CardHeader>
              <SectionTitle title="To Do" description="Assessments waiting for you" action={<Badge variant="accent" dot>{data.toDoAssessments.length} pending</Badge>} />
            </CardHeader>
            <CardBody className="space-y-3">
              {data.toDoAssessments.length > 0 ? data.toDoAssessments.map(a => (
                <div key={a.id} onClick={() => navigate(`/student/assessments/${a.id}`)} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-all cursor-pointer group">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600 flex-shrink-0">
                    <ClipboardPen className="h-5.5 w-5.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.className}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-2xs text-slate-400">
                      <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {a.questions} questions</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.duration} min</span>
                      <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Due {a.dueDate}</span>
                    </div>
                  </div>
                  <Button size="sm" className="flex-shrink-0">Start <ArrowRight className="h-3.5 w-3.5" /></Button>
                </div>
              )) : (
                <EmptyState icon={<CheckCircle2 className="h-6 w-6" />} title="All caught up!" description="No pending assessments right now." />
              )}
            </CardBody>
          </Card>

          {/* Completed Assessments */}
          <Card>
            <CardHeader>
              <SectionTitle title="Recent Results" description="Your latest assessment scores" action={<Button variant="ghost" size="sm" onClick={() => navigate('/student/results')}>View All <ChevronRight className="h-3.5 w-3.5" /></Button>} />
            </CardHeader>
            <CardBody className="p-0">
              {data.completedAssessments.map(a => (
                <div key={a.id} onClick={() => navigate(`/student/results/${a.id}`)} className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.passed ? 'bg-success-50 text-success-600' : 'bg-error-50 text-error-600'}`}>
                    {a.passed ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.className} · Completed {a.completedDate}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-lg font-bold ${a.passed ? 'text-success-600' : 'text-error-600'}`}>{a.score}%</p>
                    {a.rank && <p className="text-2xs text-slate-400">Rank #{a.rank}</p>}
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* My Classes */}
          <Card>
            <CardHeader><SectionTitle title="My Classes" /></CardHeader>
            <CardBody className="space-y-3">
              {data.enrolledClasses.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-600"><BookOpen className="h-4.5 w-4.5" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{c.name}</p>
                    <p className="text-2xs text-slate-400">{c.teacher}</p>
                  </div>
                  <Badge variant={c.avgScore >= 85 ? 'success' : c.avgScore >= 70 ? 'brand' : 'warning'} size="sm">{c.grade}</Badge>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Weak Concepts */}
          <Card className="border-error-200">
            <CardHeader>
              <SectionTitle title="Focus Areas" description="Concepts to practice" action={<Badge variant="error" dot>Needs Work</Badge>} />
            </CardHeader>
            <CardBody className="space-y-3">
              {data.weakConcepts.map((c, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700">{c.concept}</span>
                    <span className="text-xs font-semibold text-error-600">{c.score}%</span>
                  </div>
                  <Progress value={c.score} size="sm" variant="error" />
                  <p className="text-2xs text-slate-400 mt-1">{c.class}</p>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/student/practice')}>
                <Sparkles className="h-3.5 w-3.5" /> Practice Now
              </Button>
            </CardBody>
          </Card>

          {/* Recommended Practice */}
          <Card className="border-brand-200 bg-gradient-to-br from-brand-50/40 to-white">
            <CardHeader>
              <SectionTitle title="Recommended Practice" action={<Badge variant="brand" dot>AI</Badge>} />
            </CardHeader>
            <CardBody className="space-y-2">
              {data.recommendedPractice.slice(0, 2).map(p => (
                <div key={p.id} onClick={() => navigate('/student/practice')} className="p-3 rounded-lg bg-white border border-slate-100 hover:border-brand-300 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-3.5 w-3.5 text-brand-500" />
                    <p className="text-sm font-medium text-slate-900">{p.concept}</p>
                  </div>
                  <p className="text-2xs text-slate-500 mb-1.5 line-clamp-1">{p.description}</p>
                  <div className="flex items-center gap-2 text-2xs text-slate-400">
                    <span>{p.questionCount} questions</span>
                    <span>·</span>
                    <span>{p.estimatedTime}</span>
                    <span>·</span>
                    <Badge variant={p.difficulty === 'Hard' ? 'error' : 'warning'} size="sm">{p.difficulty}</Badge>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
