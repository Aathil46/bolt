import { useParams, useNavigate } from 'react-router-dom';
import { SectionTitle } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Avatar } from '@/components/ui/Avatar';
import { BarChart, RadialGauge } from '@/components/ui/Charts';
import { EmptyState } from '@/components/ui/EmptyState';
import { studentResults, assessments } from '@/data/mockData';
import {
  ArrowLeft, Download, Award, Clock, TrendingUp,
  CheckCircle2, AlertCircle, Target, Sparkles, BookOpen,
} from 'lucide-react';

export function StudentResultDetail() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const studentResultsList = studentResults.filter(r => r.studentId === studentId);
  if (studentResultsList.length === 0) {
    return <EmptyState icon={<BookOpen className="h-6 w-6" />} title="No results found" action={<Button onClick={() => navigate('/teacher/results')}>Back to Results</Button>} />;
  }

  const latest = studentResultsList[0];
  const assessment = assessments.find(a => a.id === latest.assessmentId);
  const allScores = studentResultsList.map(r => r.score);
  const avgScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
  const bestScore = Math.max(...allScores);

  const conceptPerf = latest.concepts.map(c => ({
    label: c.concept,
    value: c.score,
    color: c.mastery === 'strong' ? 'bg-success-500' : c.mastery === 'medium' ? 'bg-warning-500' : 'bg-error-500',
  }));

  const strong = latest.concepts.filter(c => c.mastery === 'strong');
  const medium = latest.concepts.filter(c => c.mastery === 'medium');
  const weak = latest.concepts.filter(c => c.mastery === 'weak');

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/teacher/results')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Results
      </button>

      <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar initials={latest.studentAvatar} size="xl" color="slate" className="bg-white/15 text-white border-2 border-white/20" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{latest.studentName}</h1>
            <p className="text-sm text-white/80">{assessment?.className || 'Student'}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="flex items-center gap-1.5 text-sm"><Award className="h-4 w-4" /> Avg: {avgScore}%</span>
              <span className="flex items-center gap-1.5 text-sm"><TrendingUp className="h-4 w-4" /> Best: {bestScore}%</span>
              <span className="flex items-center gap-1.5 text-sm"><Clock className="h-4 w-4" /> {latest.timeSpent}m on last test</span>
            </div>
          </div>
          <Button variant="secondary" className="bg-white/15 text-white hover:bg-white/25 border-white/20"><Download className="h-4 w-4" /> Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center">
          <CardHeader><SectionTitle title="Latest Score" /></CardHeader>
          <CardBody className="flex flex-col items-center pt-2">
            <RadialGauge value={latest.score} size={160} label={latest.passed ? 'Passed' : 'Failed'} color={latest.passed ? '#22c55e' : '#ef4444'} />
            <p className="text-sm text-slate-500 mt-2">{latest.assessmentTitle}</p>
          </CardBody>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><SectionTitle title="Concept Performance" description="Breakdown from latest assessment" /></CardHeader>
          <CardBody><BarChart data={conceptPerf} horizontal unit="%" /></CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success-100 text-success-600"><CheckCircle2 className="h-4 w-4" /></div>
              <h3 className="text-sm font-semibold text-slate-900">Strong Areas</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-2">
            {strong.length > 0 ? strong.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-success-50">
                <span className="text-sm text-slate-700">{c.concept}</span>
                <span className="text-sm font-semibold text-success-600">{c.score}%</span>
              </div>
            )) : <p className="text-sm text-slate-400">No strong areas yet.</p>}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning-100 text-warning-600"><Target className="h-4 w-4" /></div>
              <h3 className="text-sm font-semibold text-slate-900">Medium Areas</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-2">
            {medium.length > 0 ? medium.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-warning-50">
                <span className="text-sm text-slate-700">{c.concept}</span>
                <span className="text-sm font-semibold text-warning-600">{c.score}%</span>
              </div>
            )) : <p className="text-sm text-slate-400">No medium areas.</p>}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-error-100 text-error-600"><AlertCircle className="h-4 w-4" /></div>
              <h3 className="text-sm font-semibold text-slate-900">Weak Areas</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-2">
            {weak.length > 0 ? weak.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-error-50">
                <span className="text-sm text-slate-700">{c.concept}</span>
                <span className="text-sm font-semibold text-error-600">{c.score}%</span>
              </div>
            )) : <p className="text-sm text-slate-400">No weak areas.</p>}
          </CardBody>
        </Card>
      </div>

      <Card className="border-accent-200 bg-gradient-to-br from-accent-50/30 to-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-500" />
            <h3 className="text-sm font-semibold text-slate-900">Identified Learning Gaps</h3>
            <Badge variant="accent" size="sm">AI Analyzed</Badge>
          </div>
        </CardHeader>
        <CardBody className="space-y-2">
          {latest.learningGaps.length > 0 ? latest.learningGaps.map((g, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-100">
              <AlertCircle className="h-4 w-4 text-accent-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900">{g}</p>
                <p className="text-xs text-slate-500 mt-0.5">Recommend targeted practice and review sessions for this concept.</p>
              </div>
            </div>
          )) : <p className="text-sm text-slate-400">No learning gaps identified.</p>}
        </CardBody>
      </Card>

      <Card>
        <CardHeader><SectionTitle title="Assessment History" description="All assessments taken by this student" /></CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-50">
            {studentResultsList.map(r => (
              <div key={r.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{r.assessmentTitle}</p>
                  <p className="text-xs text-slate-500">Submitted {r.submittedAt} · {r.timeSpent}m</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20"><Progress value={r.score} size="sm" variant={r.passed ? 'success' : 'error'} /></div>
                  <span className={`text-sm font-bold ${r.passed ? 'text-success-600' : 'text-error-600'}`}>{r.score}%</span>
                  <Badge variant={r.passed ? 'success' : 'error'} size="sm">{r.passed ? 'Pass' : 'Fail'}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
