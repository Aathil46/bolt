import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { BarChart, RadialGauge } from '@/components/ui/Charts';
import { EmptyState } from '@/components/ui/EmptyState';
import { studentResultDetail, assessments, studentDashboardData } from '@/data/mockData';
import {
  ArrowLeft, Award, Clock, TrendingUp, CheckCircle2,
  AlertCircle, Target, Sparkles, Download, BookOpen,
} from 'lucide-react';

export function StudentResults() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const result = assessmentId
    ? { ...studentResultDetail, assessmentId, assessmentTitle: assessments.find(a => a.id === assessmentId)?.title || studentResultDetail.assessmentTitle }
    : studentResultDetail;

  const assessment = assessments.find(a => a.id === result.assessmentId);
  const passed = result.passed;

  const strong = result.concepts.filter(c => c.mastery === 'strong');
  const medium = result.concepts.filter(c => c.mastery === 'medium');
  const weak = result.concepts.filter(c => c.mastery === 'weak');

  const conceptPerf = result.concepts.map(c => ({
    label: c.concept,
    value: c.score,
    color: c.mastery === 'strong' ? 'bg-success-500' : c.mastery === 'medium' ? 'bg-warning-500' : 'bg-error-500',
  }));

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/student/results')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Results
      </button>

      {/* Score banner */}
      <div className={`rounded-2xl p-8 text-center relative overflow-hidden ${passed ? 'bg-gradient-to-br from-success-500 to-success-700' : 'bg-gradient-to-br from-error-500 to-error-700'} text-white`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm mx-auto mb-4 animate-scale-in">
            {passed ? <Award className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
          </div>
          <p className="text-sm text-white/80 mb-1">{result.assessmentTitle}</p>
          <h1 className="text-5xl font-bold mb-2 tabular-nums">{result.score}%</h1>
          <div className="flex items-center justify-center gap-3">
            <Badge variant="neutral" size="md" className="bg-white/15 text-white border-white/20">
              {passed ? 'Passed' : 'Failed'}
            </Badge>
            <span className="text-sm text-white/80">Passing: {assessment?.passingScore || 70}%</span>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {result.timeSpent} min</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="h-4 w-4" /> Submitted {result.submittedAt}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-slate-900">Overall Score</h3></CardHeader>
          <CardBody className="flex flex-col items-center pt-2">
            <RadialGauge value={result.score} size={160} label={passed ? 'Passed' : 'Failed'} color={passed ? '#22c55e' : '#ef4444'} />
          </CardBody>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><h3 className="text-sm font-semibold text-slate-900">Concept Performance</h3></CardHeader>
          <CardBody><BarChart data={conceptPerf} horizontal unit="%" /></CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success-100 text-success-600"><CheckCircle2 className="h-4 w-4" /></div>
              <h3 className="text-sm font-semibold text-slate-900">Strong Areas</h3>
              <Badge variant="success" size="sm">{strong.length}</Badge>
            </div>
          </CardHeader>
          <CardBody className="space-y-2">
            {strong.length > 0 ? strong.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-success-50">
                <span className="text-sm text-slate-700">{c.concept}</span>
                <span className="text-sm font-semibold text-success-600">{c.score}%</span>
              </div>
            )) : <p className="text-sm text-slate-400">No strong areas yet. Keep practicing!</p>}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning-100 text-warning-600"><Target className="h-4 w-4" /></div>
              <h3 className="text-sm font-semibold text-slate-900">Medium Areas</h3>
              <Badge variant="warning" size="sm">{medium.length}</Badge>
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
              <Badge variant="error" size="sm">{weak.length}</Badge>
            </div>
          </CardHeader>
          <CardBody className="space-y-2">
            {weak.length > 0 ? weak.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-error-50">
                <span className="text-sm text-slate-700">{c.concept}</span>
                <span className="text-sm font-semibold text-error-600">{c.score}%</span>
              </div>
            )) : <p className="text-sm text-slate-400">No weak areas. Excellent!</p>}
          </CardBody>
        </Card>
      </div>

      {result.learningGaps.length > 0 && (
        <Card className="border-accent-200 bg-gradient-to-br from-accent-50/30 to-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent-500" />
              <h3 className="text-sm font-semibold text-slate-900">Learning Gaps Identified</h3>
              <Badge variant="accent" size="sm">AI Analyzed</Badge>
            </div>
          </CardHeader>
          <CardBody className="space-y-2">
            {result.learningGaps.map((g, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-100">
                <AlertCircle className="h-4 w-4 text-accent-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{g}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Practice this concept to improve your understanding.</p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/student/practice')}>
              <Sparkles className="h-3.5 w-3.5" /> Start Practicing
            </Button>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader><h3 className="text-sm font-semibold text-slate-900">Assessment History</h3></CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-50">
            {studentDashboardData.completedAssessments.map(a => (
              <div key={a.id} onClick={() => navigate(`/student/results/${a.id}`)} className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors cursor-pointer">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.passed ? 'bg-success-50 text-success-600' : 'bg-error-50 text-error-600'}`}>
                  {a.passed ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{a.title}</p>
                  <p className="text-xs text-slate-500">{a.className} · {a.completedDate}</p>
                </div>
                <span className={`text-sm font-bold ${a.passed ? 'text-success-600' : 'text-error-600'}`}>{a.score}%</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
