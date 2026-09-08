import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SectionTitle } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Tabs } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { BarChart, DonutChart } from '@/components/ui/Charts';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog, StatusIndicator } from '@/components/ui/StatusIndicator';
import { assessments, studentResults, classes, materials } from '@/data/mockData';
import {
  ArrowLeft, Clock, FileText, Users, Award, Send, Edit3,
  CheckCircle2, AlertCircle, Sparkles, TrendingUp, Download,
  Eye, ChevronRight, Target,
} from 'lucide-react';

export function AssessmentDetail() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [showPublish, setShowPublish] = useState(false);

  const assessment = assessments.find(a => a.id === assessmentId);
  if (!assessment) {
    return <EmptyState icon={<FileText className="h-6 w-6" />} title="Assessment not found" action={<Button onClick={() => navigate('/teacher/assessments')}>Back to Assessments</Button>} />;
  }

  const cls = classes.find(c => c.id === assessment.classId);
  const material = materials.find(m => m.id === assessment.materialId);
  const results = studentResults.filter(r => r.assessmentId === assessment.id);
  const completionPct = Math.round((assessment.participation.completed / assessment.participation.total) * 100);

  const conceptPerformance = assessment.concepts.map((concept, i) => {
    const scores = results.map(r => r.concepts.find(c => c.concept === concept)?.score || 0);
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return { label: concept, value: avg, color: avg >= 70 ? 'bg-success-500' : avg >= 50 ? 'bg-warning-500' : 'bg-error-500' };
  });

  const passFailSegments = [
    { label: 'Pass', value: Math.round(assessment.passRate), color: '#22c55e' },
    { label: 'Fail', value: 100 - Math.round(assessment.passRate), color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/teacher/assessments')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Assessments
      </button>

      {/* Header */}
      <div className={`rounded-2xl bg-gradient-to-br from-${cls?.color || 'brand'}-600 to-${cls?.color || 'brand'}-800 p-6 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            {assessment.status === 'published' ? <Badge variant="success" dot className="bg-white/15 text-white border-white/20">Published</Badge> : <Badge variant="default" dot className="bg-white/15 text-white border-white/20">Draft</Badge>}
            {material && <Badge variant="default" className="bg-white/15 text-white border-white/20"><Sparkles className="h-3 w-3 mr-1" /> AI Generated</Badge>}
          </div>
          <h1 className="text-2xl font-bold mb-2">{assessment.title}</h1>
          <p className="text-sm text-white/80 mb-4 max-w-2xl">{assessment.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> {assessment.questionCount} questions</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {assessment.duration} min</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {assessment.participation.total} students</span>
            <span className="flex items-center gap-1.5"><Award className="h-4 w-4" /> {assessment.passingScore}% to pass</span>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-3">
        {assessment.status === 'draft' ? (
          <Button onClick={() => setShowPublish(true)}><Send className="h-4 w-4" /> Publish Assessment</Button>
        ) : (
          <Button variant="outline"><Download className="h-4 w-4" /> Export Results</Button>
        )}
        <Button variant="outline"><Edit3 className="h-4 w-4" /> Edit Questions</Button>
        <Button variant="ghost"><Eye className="h-4 w-4" /> Preview</Button>
      </div>

      {/* Stats */}
      {assessment.status === 'published' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-50 text-success-600"><CheckCircle2 className="h-4.5 w-4.5" /></div>
              <div><p className="text-2xs text-slate-400 uppercase">Completed</p><p className="text-xl font-bold text-slate-900">{assessment.participation.completed}/{assessment.participation.total}</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-600"><Clock className="h-4.5 w-4.5" /></div>
              <div><p className="text-2xs text-slate-400 uppercase">In Progress</p><p className="text-xl font-bold text-slate-900">{assessment.participation.inProgress}</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><TrendingUp className="h-4.5 w-4.5" /></div>
              <div><p className="text-2xs text-slate-400 uppercase">Avg Score</p><p className="text-xl font-bold text-slate-900">{assessment.avgScore}%</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info-50 text-info-600"><Award className="h-4.5 w-4.5" /></div>
              <div><p className="text-2xs text-slate-400 uppercase">Pass Rate</p><p className="text-xl font-bold text-slate-900">{assessment.passRate}%</p></div>
            </div>
          </Card>
        </div>
      )}

      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview', icon: <FileText className="h-3.5 w-3.5" /> },
          { id: 'questions', label: 'Questions', icon: <FileText className="h-3.5 w-3.5" />, count: assessment.questionCount },
          { id: 'results', label: 'Student Results', icon: <Users className="h-3.5 w-3.5" />, count: results.length },
          { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-3.5 w-3.5" /> },
        ]}
        activeTab={tab}
        onChange={setTab}
      />

      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><SectionTitle title="Participation" description="Student completion status" /></CardHeader>
            <CardBody className="flex flex-col items-center">
              <DonutChart
                segments={[
                  { label: 'Completed', value: assessment.participation.completed, color: '#22c55e' },
                  { label: 'In Progress', value: assessment.participation.inProgress, color: '#f59e0b' },
                  { label: 'Not Started', value: assessment.participation.notStarted, color: '#e2e8f0' },
                ]}
                centerValue={`${completionPct}%`}
                centerLabel="Completed"
              />
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-success-500" /><span className="text-xs text-slate-600">Completed ({assessment.participation.completed})</span></div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-accent-500" /><span className="text-xs text-slate-600">In Progress ({assessment.participation.inProgress})</span></div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-slate-200" /><span className="text-xs text-slate-600">Not Started ({assessment.participation.notStarted})</span></div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader><SectionTitle title="Pass / Fail" description="Overall pass rate" /></CardHeader>
            <CardBody className="flex flex-col items-center">
              <DonutChart segments={passFailSegments} centerValue={`${assessment.passRate}%`} centerLabel="Pass Rate" />
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-success-500" /><span className="text-xs text-slate-600">Pass</span></div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-error-500" /><span className="text-xs text-slate-600">Fail</span></div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {tab === 'questions' && (
        <Card>
          <CardBody className="space-y-3">
            {assessment.questions.map((q, i) => (
              <div key={q.id} className="p-4 rounded-xl border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-bold">{i + 1}</span>
                    <Badge variant="default" size="sm">{q.type === 'multiple-choice' ? 'MC' : q.type === 'true-false' ? 'T/F' : 'SA'}</Badge>
                    <Badge variant={q.difficulty === 'easy' ? 'success' : q.difficulty === 'medium' ? 'warning' : 'error'} size="sm">{q.difficulty}</Badge>
                    <Badge variant="brand" size="sm">{q.concept}</Badge>
                    <Badge variant="default" size="sm">{q.points} pts</Badge>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-900 mb-3">{q.question}</p>
                {q.options && (
                  <div className="space-y-1.5">
                    {q.options.map((opt, j) => (
                      <div key={j} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${opt === q.correctAnswer ? 'bg-success-50 text-success-700 border border-success-200' : 'bg-slate-50 text-slate-600'}`}>
                        <span className="text-xs font-semibold w-4">{String.fromCharCode(65 + j)}</span>
                        {opt}
                        {opt === q.correctAnswer && <CheckCircle2 className="h-3.5 w-3.5 ml-auto text-success-500" />}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2 mt-2 border-t border-slate-100">
                  <Sparkles className="h-3 w-3 text-accent-500" />
                  <span className="text-xs text-slate-500">{q.explanation}</span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {tab === 'results' && (
        <Card>
          <CardBody className="p-0">
            {results.length === 0 ? (
              <EmptyState icon={<Users className="h-6 w-6" />} title="No submissions yet" description="Student results will appear here once they submit." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="text-left text-2xs font-semibold uppercase tracking-wide text-slate-400 px-4 py-3">Student</th>
                      <th className="text-left text-2xs font-semibold uppercase tracking-wide text-slate-400 px-4 py-3">Score</th>
                      <th className="text-left text-2xs font-semibold uppercase tracking-wide text-slate-400 px-4 py-3 hidden sm:table-cell">Status</th>
                      <th className="text-left text-2xs font-semibold uppercase tracking-wide text-slate-400 px-4 py-3 hidden md:table-cell">Time</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice(0, 15).map(r => (
                      <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => navigate(`/teacher/results/${r.studentId}`)}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar initials={r.studentAvatar} size="sm" color="brand" />
                            <span className="text-sm font-medium text-slate-900">{r.studentName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16"><Progress value={r.score} size="sm" variant={r.passed ? 'success' : 'error'} /></div>
                            <span className={`text-sm font-semibold ${r.passed ? 'text-success-600' : 'text-error-600'}`}>{r.score}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {r.passed ? <Badge variant="success" size="sm">Pass</Badge> : <Badge variant="error" size="sm">Fail</Badge>}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs text-slate-500">{r.timeSpent}m</span>
                        </td>
                        <td className="px-4 py-3">
                          <ChevronRight className="h-4 w-4 text-slate-300" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {tab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><SectionTitle title="Concept Performance" description="Average score per concept" /></CardHeader>
            <CardBody>
              <BarChart data={conceptPerformance} horizontal unit="%" />
            </CardBody>
          </Card>
          <Card>
            <CardHeader><SectionTitle title="Learning Gaps" description="Concepts needing attention" /></CardHeader>
            <CardBody className="space-y-3">
              {conceptPerformance.filter(c => c.value < 60).map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-error-50 border border-error-200">
                  <AlertCircle className="h-4 w-4 text-error-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{c.label}</p>
                    <p className="text-xs text-slate-500">{c.value}% average · Needs reinforcement</p>
                  </div>
                  <Target className="h-4 w-4 text-error-400" />
                </div>
              ))}
              {conceptPerformance.filter(c => c.value < 60).length === 0 && (
                <EmptyState icon={<CheckCircle2 className="h-6 w-6" />} title="No learning gaps" description="All concepts are performing above 60%." />
              )}
            </CardBody>
          </Card>
        </div>
      )}

      <ConfirmDialog
        open={showPublish}
        onClose={() => setShowPublish(false)}
        onConfirm={() => navigate('/teacher/assessments')}
        title="Publish Assessment?"
        message="Students will be notified immediately and can begin taking the assessment. This action cannot be undone."
        confirmLabel="Publish"
      />
    </div>
  );
}
