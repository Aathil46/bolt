import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionTitle } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Avatar } from '@/components/ui/Avatar';
import { BarChart, RadialGauge } from '@/components/ui/Charts';
import { teachers } from '@/data/mockData';
import {
  Users, ClipboardPen, TrendingUp, Award, Target,
  ChevronRight, ArrowRight,
} from 'lucide-react';

export function PrincipalTeachers() {
  const navigate = useNavigate();
  const sorted = [...teachers].sort((a, b) => b.avgPerformance - a.avgPerformance);

  return (
    <div className="space-y-6">
      <PageHeader title="Teacher Performance" description="Compare teaching effectiveness across the school." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><SectionTitle title="Performance Ranking" description="Average score by teacher" /></CardHeader>
          <CardBody>
            <BarChart
              data={sorted.map(t => ({ label: t.name.split(' ')[0], value: t.avgPerformance, color: t.avgPerformance >= 80 ? 'bg-success-500' : t.avgPerformance >= 70 ? 'bg-brand-500' : 'bg-warning-500' }))}
              height={200}
              showValues
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader><SectionTitle title="Pass Rate Comparison" description="Pass rate by teacher" /></CardHeader>
          <CardBody>
            <BarChart
              data={sorted.map(t => ({ label: t.name.split(' ')[0], value: t.passRate, color: t.passRate >= 85 ? 'bg-success-500' : t.passRate >= 75 ? 'bg-brand-500' : 'bg-warning-500' }))}
              height={200}
              showValues
            />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
        {sorted.map(t => (
          <Card key={t.id} hover className="overflow-hidden">
            <div className="h-1.5 bg-brand-500" />
            <CardBody>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar initials={t.avatar} size="lg" color="brand" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.classCount} class(es) · {t.studentCount} students</p>
                  </div>
                </div>
                <Badge variant={t.avgPerformance >= 80 ? 'success' : 'warning'} size="sm">
                  {t.avgPerformance >= 80 ? 'Top' : 'Avg'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 rounded-lg bg-slate-50">
                  <ClipboardPen className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                  <p className="text-sm font-bold text-slate-900">{t.assessmentCount}</p>
                  <p className="text-2xs text-slate-400">Tests</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-50">
                  <TrendingUp className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                  <p className="text-sm font-bold text-slate-900">{t.avgPerformance}%</p>
                  <p className="text-2xs text-slate-400">Avg</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-50">
                  <Award className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                  <p className="text-sm font-bold text-slate-900">{t.passRate}%</p>
                  <p className="text-2xs text-slate-400">Pass</p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                {t.classes.map(c => (
                  <div key={c.id} className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">{c.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16"><Progress value={c.avgPerformance} size="sm" variant={c.avgPerformance >= 80 ? 'success' : 'warning'} /></div>
                      <span className="text-xs font-semibold text-slate-700">{c.avgPerformance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
