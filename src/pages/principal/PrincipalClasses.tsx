import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionTitle } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Avatar } from '@/components/ui/Avatar';
import { BarChart, DonutChart, LineChart } from '@/components/ui/Charts';
import { Tabs } from '@/components/ui/Tabs';
import { classes, assessments, studentResults } from '@/data/mockData';
import {
  School, Users, ClipboardPen, TrendingUp, ArrowRight,
  ChevronRight, Target, AlertCircle, CheckCircle2,
} from 'lucide-react';

export function PrincipalClasses() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const sortedClasses = [...classes].sort((a, b) => b.avgPerformance - a.avgPerformance);
  const classPerf = sortedClasses.map(c => ({
    label: c.name.split(' ')[0],
    value: c.avgPerformance,
    color: c.avgPerformance >= 80 ? 'bg-success-500' : c.avgPerformance >= 70 ? 'bg-brand-500' : 'bg-warning-500',
  }));

  const cls = selectedClass ? classes.find(c => c.id === selectedClass) : null;
  const clsAssessments = cls ? assessments.filter(a => a.classId === cls.id) : [];
  const clsResults = cls ? studentResults.filter(r => clsAssessments.some(a => a.id === r.assessmentId)) : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Class Performance" description="Compare performance across all classes in the school." />

      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview', icon: <TrendingUp className="h-3.5 w-3.5" /> },
          { id: 'details', label: 'Class Details', icon: <School className="h-3.5 w-3.5" /> },
        ]}
        activeTab={tab}
        onChange={setTab}
      />

      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><SectionTitle title="Performance Comparison" description="Average score by class" /></CardHeader>
              <CardBody><BarChart data={classPerf} height={220} showValues /></CardBody>
            </Card>
            <Card>
              <CardHeader><SectionTitle title="Completion Rates" description="Assessment participation" /></CardHeader>
              <CardBody className="space-y-3">
                {sortedClasses.map(c => {
                  const completion = c.assessmentCount > 0 ? 85 + ((c.avgPerformance * 7) % 15) : 0;
                  return (
                    <div key={c.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-700 truncate">{c.name}</span>
                        <span className="text-xs font-semibold text-slate-900">{Math.round(completion)}%</span>
                      </div>
                      <Progress value={completion} size="sm" variant={completion >= 90 ? 'success' : 'warning'} />
                    </div>
                  );
                })}
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader><SectionTitle title="All Classes" description="Sorted by performance" /></CardHeader>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="text-left text-2xs font-semibold uppercase tracking-wide text-slate-400 px-4 py-3">Class</th>
                      <th className="text-left text-2xs font-semibold uppercase tracking-wide text-slate-400 px-4 py-3 hidden sm:table-cell">Teacher</th>
                      <th className="text-left text-2xs font-semibold uppercase tracking-wide text-slate-400 px-4 py-3">Students</th>
                      <th className="text-left text-2xs font-semibold uppercase tracking-wide text-slate-400 px-4 py-3 hidden md:table-cell">Assessments</th>
                      <th className="text-left text-2xs font-semibold uppercase tracking-wide text-slate-400 px-4 py-3">Avg Score</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedClasses.map(c => (
                      <tr key={c.id} onClick={() => { setSelectedClass(c.id); setTab('details'); }} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-${c.color}-100 text-${c.color}-600`}><School className="h-4 w-4" /></div>
                            <div><p className="text-sm font-medium text-slate-900">{c.name}</p><p className="text-2xs text-slate-400">{c.grade} · {c.subject}</p></div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell"><span className="text-xs text-slate-500">{c.teacherName}</span></td>
                        <td className="px-4 py-3"><span className="text-sm text-slate-700">{c.studentCount}</span></td>
                        <td className="px-4 py-3 hidden md:table-cell"><span className="text-sm text-slate-700">{c.assessmentCount}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16"><Progress value={c.avgPerformance} size="sm" variant={c.avgPerformance >= 80 ? 'success' : 'warning'} /></div>
                            <span className="text-sm font-semibold text-slate-700">{c.avgPerformance}%</span>
                          </div>
                        </td>
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

      {tab === 'details' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {classes.map(c => (
              <button key={c.id} onClick={() => setSelectedClass(c.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedClass === c.id ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {c.name.split(' - ')[0]}
              </button>
            ))}
          </div>

          {cls && (
            <>
              <div className={`rounded-2xl bg-gradient-to-br from-${cls.color}-600 to-${cls.color}-800 p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="neutral" size="sm" className="bg-white/15 text-white border-white/20">{cls.grade}</Badge>
                    <Badge variant="neutral" size="sm" className="bg-white/15 text-white border-white/20">{cls.subject}</Badge>
                  </div>
                  <h1 className="text-2xl font-bold mb-1">{cls.name}</h1>
                  <p className="text-sm text-white/80">{cls.teacherName} · {cls.studentCount} students</p>
                  <div className="grid grid-cols-3 gap-4 mt-5">
                    <div className="p-3 rounded-xl bg-white/10"><p className="text-2xl font-bold">{cls.avgPerformance}%</p><p className="text-xs text-white/70">Avg Score</p></div>
                    <div className="p-3 rounded-xl bg-white/10"><p className="text-2xl font-bold">{cls.assessmentCount}</p><p className="text-xs text-white/70">Assessments</p></div>
                    <div className="p-3 rounded-xl bg-white/10"><p className="text-2xl font-bold">82%</p><p className="text-xs text-white/70">Pass Rate</p></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><SectionTitle title="Assessment Performance" description="Average score per assessment" /></CardHeader>
                  <CardBody>
                    {clsAssessments.filter(a => a.status === 'published').length > 0 ? (
                      <BarChart data={clsAssessments.filter(a => a.status === 'published').map(a => ({ label: a.title.split(' ').slice(0, 2).join(' '), value: a.avgScore, color: 'bg-brand-500' }))} height={200} />
                    ) : (
                      <p className="text-sm text-slate-400 text-center py-8">No published assessments</p>
                    )}
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader><SectionTitle title="Weak Concepts" description="Areas needing attention" /></CardHeader>
                  <CardBody className="space-y-2">
                    {['Vertex Form', 'HL Theorem', 'Completing the Square'].map((c, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-error-50 border border-error-200">
                        <AlertCircle className="h-4 w-4 text-error-500 flex-shrink-0" />
                        <span className="text-sm text-slate-700 flex-1">{c}</span>
                        <span className="text-xs font-semibold text-error-600">{48 + i * 5}%</span>
                      </div>
                    ))}
                  </CardBody>
                </Card>
              </div>

              <Card>
                <CardHeader><SectionTitle title="Assessments" /></CardHeader>
                <CardBody className="p-0">
                  <div className="divide-y divide-slate-50">
                    {clsAssessments.map(a => (
                      <div key={a.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{a.title}</p>
                          <p className="text-xs text-slate-500">{a.questionCount} questions · {a.duration} min</p>
                        </div>
                        {a.status === 'published' ? (
                          <>
                            <div className="hidden sm:block text-right"><p className="text-sm font-semibold text-slate-700">{a.avgScore}%</p><p className="text-2xs text-slate-400">avg</p></div>
                            <Badge variant="success" size="sm">Published</Badge>
                          </>
                        ) : <Badge variant="default" size="sm">Draft</Badge>}
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}
