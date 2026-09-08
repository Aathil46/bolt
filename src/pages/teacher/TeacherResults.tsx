import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionTitle } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Select } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { BarChart, DonutChart, LineChart } from '@/components/ui/Charts';
import { EmptyState } from '@/components/ui/EmptyState';
import { useApp } from '@/context/AppContext';
import { assessments, studentResults, classes, teachingInsights } from '@/data/mockData';
import {
  TrendingUp, Users, Award, Download, AlertCircle,
  CheckCircle2, Target, ChevronRight, BarChart3,
} from 'lucide-react';

export function TeacherResults() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [tab, setTab] = useState('overview');
  const [filterClass, setFilterClass] = useState('all');

  const myClasses = classes.filter(c => c.teacherId === user.id);
  const myAssessments = assessments.filter(a => myClasses.some(c => c.id === a.classId) && a.status === 'published');
  const allResults = studentResults.filter(r => myAssessments.some(a => a.id === r.assessmentId));
  const filteredResults = filterClass === 'all' ? allResults : allResults.filter(r => {
    const a = myAssessments.find(a => a.id === r.assessmentId);
    return a?.classId === filterClass;
  });

  const avgScore = filteredResults.length > 0 ? Math.round(filteredResults.reduce((s, r) => s + r.score, 0) / filteredResults.length) : 0;
  const passRate = filteredResults.length > 0 ? Math.round((filteredResults.filter(r => r.passed).length / filteredResults.length) * 100) : 0;
  const completionRate = 91;

  const allConcepts = new Set<string>();
  myAssessments.forEach(a => a.concepts.forEach(c => allConcepts.add(c)));
  const conceptPerformance = Array.from(allConcepts).map(concept => {
    const scores: number[] = [];
    filteredResults.forEach(r => {
      const cr = r.concepts.find(c => c.concept === concept);
      if (cr) scores.push(cr.score);
    });
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return { label: concept, value: avg, color: avg >= 70 ? 'bg-success-500' : avg >= 50 ? 'bg-warning-500' : 'bg-error-500' };
  }).sort((a, b) => a.value - b.value);

  const weakConcepts = conceptPerformance.filter(c => c.value < 60);
  const trendData = [
    { label: 'Wk 1', value: 68 }, { label: 'Wk 2', value: 72 }, { label: 'Wk 3', value: 70 },
    { label: 'Wk 4', value: 75 }, { label: 'Wk 5', value: 78 }, { label: 'Wk 6', value: 76 },
  ];

  const studentsNeedingAttention = filteredResults
    .filter(r => !r.passed || r.score < 50)
    .sort((a, b) => a.score - b.score)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Results & Analytics"
        description="Track performance across all your classes and assessments."
        action={<Button variant="outline"><Download className="h-4 w-4" /> Export Report</Button>}
      />

      <Select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="max-w-xs">
        <option value="all">All Classes</option>
        {myClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </Select>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><BarChart3 className="h-4.5 w-4.5" /></div>
            <div><p className="text-2xs text-slate-400 uppercase">Avg Score</p><p className="text-xl font-bold text-slate-900">{avgScore}%</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-50 text-success-600"><Award className="h-4.5 w-4.5" /></div>
            <div><p className="text-2xs text-slate-400 uppercase">Pass Rate</p><p className="text-xl font-bold text-slate-900">{passRate}%</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info-50 text-info-600"><CheckCircle2 className="h-4.5 w-4.5" /></div>
            <div><p className="text-2xs text-slate-400 uppercase">Completion</p><p className="text-xl font-bold text-slate-900">{completionRate}%</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-error-50 text-error-600"><AlertCircle className="h-4.5 w-4.5" /></div>
            <div><p className="text-2xs text-slate-400 uppercase">Need Attention</p><p className="text-xl font-bold text-slate-900">{studentsNeedingAttention.length}</p></div>
          </div>
        </Card>
      </div>

      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview', icon: <TrendingUp className="h-3.5 w-3.5" /> },
          { id: 'concepts', label: 'Concept Analysis', icon: <Target className="h-3.5 w-3.5" /> },
          { id: 'students', label: 'Students Needing Attention', icon: <Users className="h-3.5 w-3.5" />, count: studentsNeedingAttention.length },
        ]}
        activeTab={tab}
        onChange={setTab}
      />

      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader><SectionTitle title="Performance Trend" description="Average score over time" /></CardHeader>
            <CardBody><LineChart data={trendData} height={220} /></CardBody>
          </Card>
          <Card>
            <CardHeader><SectionTitle title="Pass / Fail" description="Across all assessments" /></CardHeader>
            <CardBody className="flex flex-col items-center">
              <DonutChart
                segments={[
                  { label: 'Pass', value: passRate, color: '#22c55e' },
                  { label: 'Fail', value: 100 - passRate, color: '#ef4444' },
                ]}
                centerValue={`${passRate}%`}
                centerLabel="Pass Rate"
              />
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-success-500" /><span className="text-xs text-slate-600">Pass</span></div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-error-500" /><span className="text-xs text-slate-600">Fail</span></div>
              </div>
            </CardBody>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader><SectionTitle title="Assessment Results" description="Per-assessment breakdown" /></CardHeader>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="text-left text-2xs font-semibold uppercase tracking-wide text-slate-400 px-4 py-3">Assessment</th>
                      <th className="text-left text-2xs font-semibold uppercase tracking-wide text-slate-400 px-4 py-3 hidden sm:table-cell">Class</th>
                      <th className="text-left text-2xs font-semibold uppercase tracking-wide text-slate-400 px-4 py-3">Avg Score</th>
                      <th className="text-left text-2xs font-semibold uppercase tracking-wide text-slate-400 px-4 py-3">Pass Rate</th>
                      <th className="text-left text-2xs font-semibold uppercase tracking-wide text-slate-400 px-4 py-3 hidden md:table-cell">Completion</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {myAssessments.map(a => (
                      <tr key={a.id} onClick={() => navigate(`/teacher/assessments/${a.id}`)} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer">
                        <td className="px-4 py-3"><p className="text-sm font-medium text-slate-900">{a.title}</p></td>
                        <td className="px-4 py-3 hidden sm:table-cell"><span className="text-xs text-slate-500">{a.className}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16"><Progress value={a.avgScore} size="sm" variant={a.avgScore >= 70 ? 'success' : 'warning'} /></div>
                            <span className="text-sm font-semibold text-slate-700">{a.avgScore}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><Badge variant={a.passRate >= 80 ? 'success' : 'warning'} size="sm">{a.passRate}%</Badge></td>
                        <td className="px-4 py-3 hidden md:table-cell"><span className="text-xs text-slate-500">{a.participation.completed}/{a.participation.total}</span></td>
                        <td className="px-4 py-3"><ChevronRight className="h-4 w-4 text-slate-300" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {tab === 'concepts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><SectionTitle title="Concept Performance" description="Average score per concept" /></CardHeader>
            <CardBody><BarChart data={conceptPerformance} horizontal unit="%" /></CardBody>
          </Card>
          <Card>
            <CardHeader><SectionTitle title="Learning Gaps" description="Concepts below 60% mastery" /></CardHeader>
            <CardBody className="space-y-3">
              {weakConcepts.length > 0 ? weakConcepts.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-error-50 border border-error-200">
                  <AlertCircle className="h-4 w-4 text-error-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{c.label}</p>
                    <p className="text-xs text-slate-500">{c.value}% average · Needs reinforcement</p>
                  </div>
                  <Target className="h-4 w-4 text-error-400" />
                </div>
              )) : (
                <EmptyState icon={<CheckCircle2 className="h-6 w-6" />} title="No learning gaps" description="All concepts are performing above 60%." />
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {tab === 'students' && (
        <Card>
          <CardHeader><SectionTitle title="Students Needing Attention" description="Students who scored below passing or 50%" /></CardHeader>
          <CardBody className="p-0">
            {studentsNeedingAttention.length === 0 ? (
              <EmptyState icon={<CheckCircle2 className="h-6 w-6" />} title="All students passing" description="No students need additional support right now." />
            ) : (
              <div className="divide-y divide-slate-50">
                {studentsNeedingAttention.map(r => (
                  <div key={r.id} onClick={() => navigate(`/teacher/results/${r.studentId}`)} className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors cursor-pointer">
                    <Avatar initials={r.studentAvatar} size="md" color="brand" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{r.studentName}</p>
                      <p className="text-xs text-slate-500">{r.assessmentTitle}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {r.learningGaps.map((g, i) => (
                          <span key={i} className="px-1.5 py-0.5 text-2xs font-medium bg-error-50 text-error-600 rounded">{g}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-lg font-bold ${r.passed ? 'text-success-600' : 'text-error-600'}`}>{r.score}%</p>
                      <Badge variant={r.passed ? 'success' : 'error'} size="sm">{r.passed ? 'Pass' : 'Fail'}</Badge>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
