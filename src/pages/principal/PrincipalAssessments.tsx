import { PageHeader, SectionTitle } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { BarChart, DonutChart, LineChart } from '@/components/ui/Charts';
import { assessments, classes } from '@/data/mockData';
import {
  ClipboardPen, Users, TrendingUp, Award, Download,
  CheckCircle2, AlertCircle, Target,
} from 'lucide-react';

export function PrincipalAssessments() {
  const published = assessments.filter(a => a.status === 'published');
  const allConcepts = new Set<string>();
  published.forEach(a => a.concepts.forEach(c => allConcepts.add(c)));

  const conceptPerf = Array.from(allConcepts).map(concept => {
    const scores = published.map(a => a.avgScore + ((concept.length * 7) % 20) - 10);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return { label: concept, value: Math.max(30, Math.min(95, avg)), color: avg >= 70 ? 'bg-success-500' : avg >= 50 ? 'bg-warning-500' : 'bg-error-500' };
  }).sort((a, b) => a.value - b.value);

  const trendData = [
    { label: 'Wk 1', value: 71 }, { label: 'Wk 2', value: 73 }, { label: 'Wk 3', value: 72 },
    { label: 'Wk 4', value: 75 }, { label: 'Wk 5', value: 77 }, { label: 'Wk 6', value: 76 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessment Results"
        description="School-wide assessment analytics and performance data."
        action={<button className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"><Download className="h-4 w-4" /> Export Report</button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><ClipboardPen className="h-4.5 w-4.5" /></div>
            <div><p className="text-2xs text-slate-400 uppercase">Published</p><p className="text-xl font-bold text-slate-900">{published.length}</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-50 text-success-600"><CheckCircle2 className="h-4.5 w-4.5" /></div>
            <div><p className="text-2xs text-slate-400 uppercase">Avg Score</p><p className="text-xl font-bold text-slate-900">76%</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info-50 text-info-600"><Award className="h-4.5 w-4.5" /></div>
            <div><p className="text-2xs text-slate-400 uppercase">Pass Rate</p><p className="text-xl font-bold text-slate-900">80%</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-error-50 text-error-600"><AlertCircle className="h-4.5 w-4.5" /></div>
            <div><p className="text-2xs text-slate-400 uppercase">Weak Concepts</p><p className="text-xl font-bold text-slate-900">{conceptPerf.filter(c => c.value < 60).length}</p></div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><SectionTitle title="Performance Trend" description="School-wide average over time" /></CardHeader>
          <CardBody><LineChart data={trendData} height={220} /></CardBody>
        </Card>
        <Card>
          <CardHeader><SectionTitle title="Pass / Fail" description="All assessments" /></CardHeader>
          <CardBody className="flex flex-col items-center">
            <DonutChart
              segments={[{ label: 'Pass', value: 80, color: '#22c55e' }, { label: 'Fail', value: 20, color: '#ef4444' }]}
              centerValue="80%"
              centerLabel="Pass Rate"
            />
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-success-500" /><span className="text-xs text-slate-600">Pass</span></div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-error-500" /><span className="text-xs text-slate-600">Fail</span></div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader><SectionTitle title="Concept Performance" description="School-wide concept mastery" /></CardHeader>
        <CardBody><BarChart data={conceptPerf} horizontal unit="%" /></CardBody>
      </Card>

      <Card>
        <CardHeader><SectionTitle title="All Assessments" description="School-wide assessment results" /></CardHeader>
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
                </tr>
              </thead>
              <tbody>
                {published.map(a => (
                  <tr key={a.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3"><p className="text-sm font-medium text-slate-900">{a.title}</p></td>
                    <td className="px-4 py-3 hidden sm:table-cell"><span className="text-xs text-slate-500">{a.className}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16"><Progress value={a.avgScore} size="sm" variant={a.avgScore >= 80 ? 'success' : 'warning'} /></div>
                        <span className="text-sm font-semibold text-slate-700">{a.avgScore}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={a.passRate >= 80 ? 'success' : 'warning'} size="sm">{a.passRate}%</Badge></td>
                    <td className="px-4 py-3 hidden md:table-cell"><span className="text-xs text-slate-500">{a.participation.completed}/{a.participation.total}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
