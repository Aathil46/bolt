import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionTitle } from '@/components/shared/StatCard';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Avatar } from '@/components/ui/Avatar';
import { BarChart, DonutChart, LineChart } from '@/components/ui/Charts';
import { schoolStats, classes, teachers, assessments, studentResults, principalInsights } from '@/data/mockData';
import {
  School, Users, ClipboardPen, TrendingUp, AlertCircle,
  Target, Sparkles, ArrowRight, ChevronRight, UserCog,
  Award, CheckCircle2, Building2,
} from 'lucide-react';

export function PrincipalDashboard() {
  const navigate = useNavigate();

  const trendData = [
    { label: 'Wk 1', value: 71 }, { label: 'Wk 2', value: 73 }, { label: 'Wk 3', value: 72 },
    { label: 'Wk 4', value: 75 }, { label: 'Wk 5', value: 77 }, { label: 'Wk 6', value: 76 },
  ];

  const classPerf = classes.map(c => ({
    label: c.name.split(' ')[0],
    value: c.avgPerformance,
    color: c.avgPerformance >= 80 ? 'bg-success-500' : c.avgPerformance >= 70 ? 'bg-brand-500' : 'bg-warning-500',
  }));

  const highPriority = principalInsights.filter(i => i.priority === 'high');

  return (
    <div className="space-y-6">
      <PageHeader title="School Dashboard" description="Executive overview of Oakridge High School performance." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard label="Total Students" value={schoolStats.totalStudents} icon={<Users className="h-5 w-5" />} color="brand" />
        <StatCard label="Total Classes" value={schoolStats.totalClasses} icon={<School className="h-5 w-5" />} color="info" />
        <StatCard label="Total Assessments" value={schoolStats.totalAssessments} icon={<ClipboardPen className="h-5 w-5" />} color="accent" />
        <StatCard label="Teachers" value={schoolStats.totalTeachers} icon={<UserCog className="h-5 w-5" />} color="success" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard label="Avg Performance" value={schoolStats.avgPerformance} unit="%" icon={<TrendingUp className="h-5 w-5" />} color="success" trend={{ value: '+5%', direction: 'up' }} />
        <StatCard label="Pass Rate" value={schoolStats.passRate} unit="%" icon={<Award className="h-5 w-5" />} color="brand" trend={{ value: '+3%', direction: 'up' }} />
        <StatCard label="Completion" value={schoolStats.completionRate} unit="%" icon={<CheckCircle2 className="h-5 w-5" />} color="info" trend={{ value: '+7%', direction: 'up' }} />
        <StatCard label="At-Risk Students" value={schoolStats.atRiskStudents} icon={<AlertCircle className="h-5 w-5" />} color="error" trend={{ value: '-2', direction: 'down' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><SectionTitle title="School Performance Trend" description="Average score across all classes" /></CardHeader>
          <CardBody><LineChart data={trendData} height={220} /></CardBody>
        </Card>
        <Card>
          <CardHeader><SectionTitle title="Pass / Fail" description="School-wide" /></CardHeader>
          <CardBody className="flex flex-col items-center">
            <DonutChart
              segments={[
                { label: 'Pass', value: schoolStats.passRate, color: '#22c55e' },
                { label: 'Fail', value: 100 - schoolStats.passRate, color: '#ef4444' },
              ]}
              centerValue={`${schoolStats.passRate}%`}
              centerLabel="Pass Rate"
            />
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-success-500" /><span className="text-xs text-slate-600">Pass</span></div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-error-500" /><span className="text-xs text-slate-600">Fail</span></div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><SectionTitle title="Class Performance Comparison" description="Average score by class" action={<Button variant="ghost" size="sm" onClick={() => navigate('/principal/classes')}>View Details <ArrowRight className="h-3.5 w-3.5" /></Button>} /></CardHeader>
          <CardBody><BarChart data={classPerf} height={200} showValues /></CardBody>
        </Card>
        <Card className="border-brand-200 bg-gradient-to-br from-brand-50/40 to-white">
          <CardHeader>
            <SectionTitle title="AI Executive Summary" action={<Badge variant="brand" dot>AI</Badge>} />
          </CardHeader>
          <CardBody className="space-y-3">
            {highPriority.map(insight => (
              <div key={insight.id} className="p-3 rounded-lg bg-white border border-slate-100">
                <div className="flex items-start gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-error-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-slate-900">{insight.title}</p>
                </div>
                <p className="text-2xs text-slate-500 line-clamp-2">{insight.description}</p>
                {insight.metric && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-600">{insight.metric.value}</span>
                    <span className="text-2xs text-slate-400">{insight.metric.label}</span>
                  </div>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/principal/insights')}>
              <Sparkles className="h-3.5 w-3.5" /> View AI Review
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Teacher performance summary */}
      <Card>
        <CardHeader>
          <SectionTitle title="Teacher Performance" description="Quick overview of teacher effectiveness" action={<Button variant="ghost" size="sm" onClick={() => navigate('/principal/teachers')}>View All <ArrowRight className="h-3.5 w-3.5" /></Button>} />
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-50">
            {teachers.map(t => (
              <div key={t.id} onClick={() => navigate('/principal/teachers')} className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors cursor-pointer">
                <Avatar initials={t.avatar} size="md" color="brand" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.classCount} classes · {t.studentCount} students · {t.assessmentCount} assessments</p>
                </div>
                <div className="hidden sm:flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Avg Performance</p>
                    <p className="text-sm font-bold text-slate-900">{t.avgPerformance}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Pass Rate</p>
                    <p className="text-sm font-bold text-slate-900">{t.passRate}%</p>
                  </div>
                </div>
                <div className="w-20 hidden md:block"><Progress value={t.avgPerformance} size="sm" variant={t.avgPerformance >= 80 ? 'success' : 'warning'} /></div>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
