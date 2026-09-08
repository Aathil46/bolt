import { PageHeader, SectionTitle } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { principalInsights } from '@/data/mockData';
import type { PrincipalInsight } from '@/types';
import {
  Sparkles, AlertCircle, Users, TrendingUp, School,
  Target, ArrowRight, Lightbulb, CheckCircle2, RefreshCw,
} from 'lucide-react';

const typeConfig: Record<PrincipalInsight['type'], { icon: typeof AlertCircle; color: string; bg: string; label: string }> = {
  'school-wide': { icon: School, color: 'text-brand-600', bg: 'bg-brand-50', label: 'School-Wide' },
  'class-comparison': { icon: TrendingUp, color: 'text-info-600', bg: 'bg-info-50', label: 'Class Comparison' },
  'teacher-performance': { icon: Users, color: 'text-accent-600', bg: 'bg-accent-50', label: 'Teacher Performance' },
  'student-risk': { icon: AlertCircle, color: 'text-error-600', bg: 'bg-error-50', label: 'Student Risk' },
};

const priorityConfig: Record<PrincipalInsight['priority'], { variant: 'error' | 'warning' | 'default'; label: string }> = {
  high: { variant: 'error', label: 'High Priority' },
  medium: { variant: 'warning', label: 'Medium Priority' },
  low: { variant: 'default', label: 'Informational' },
};

export function PrincipalInsights() {
  const high = principalInsights.filter(i => i.priority === 'high');
  const medium = principalInsights.filter(i => i.priority === 'medium');
  const low = principalInsights.filter(i => i.priority === 'low');

  const renderInsight = (insight: PrincipalInsight) => {
    const tc = typeConfig[insight.type];
    const pc = priorityConfig[insight.priority];
    return (
      <Card key={insight.id} className="overflow-hidden">
        <div className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tc.bg} ${tc.color} flex-shrink-0`}>
              <tc.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge variant={pc.variant} size="sm" dot>{pc.label}</Badge>
                <Badge variant="default" size="sm">{tc.label}</Badge>
                <Badge variant="brand" size="sm"><Sparkles className="h-3 w-3 mr-0.5" /> AI Generated</Badge>
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{insight.title}</h3>
            </div>
            {insight.metric && (
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-brand-600">{insight.metric.value}</p>
                <p className="text-2xs text-slate-400">{insight.metric.label}</p>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-600 mb-3 leading-relaxed">{insight.description}</p>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-brand-50 border border-brand-100">
            <Target className="h-4 w-4 text-brand-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-2xs font-semibold uppercase tracking-wide text-brand-600 mb-0.5">Recommended Action</p>
              <p className="text-sm text-slate-700">{insight.recommendation}</p>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Review"
        description="AI-generated executive summary of school performance and recommendations."
        action={<Button variant="outline"><RefreshCw className="h-4 w-4" /> Regenerate</Button>}
      />

      {/* AI Summary banner */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Executive Summary</h2>
              <p className="text-sm text-white/80">Generated from {principalInsights.length} data points across 5 classes</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-white/10">
              <div className="flex items-center gap-2 mb-1"><TrendingUp className="h-4 w-4 text-success-300" /><span className="text-xs text-white/70">Improvement</span></div>
              <p className="text-xl font-bold">+12%</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <div className="flex items-center gap-2 mb-1"><AlertCircle className="h-4 w-4 text-error-300" /><span className="text-xs text-white/70">At-Risk</span></div>
              <p className="text-xl font-bold">14</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <div className="flex items-center gap-2 mb-1"><Target className="h-4 w-4 text-accent-300" /><span className="text-xs text-white/70">Weak Concepts</span></div>
              <p className="text-xl font-bold">9</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <div className="flex items-center gap-2 mb-1"><CheckCircle2 className="h-4 w-4 text-success-300" /><span className="text-xs text-white/70">Completion</span></div>
              <p className="text-xl font-bold">91%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-accent-500" />
            <h3 className="text-sm font-semibold text-slate-900">Key Findings</h3>
            <Badge variant="brand" size="sm">AI Analyzed</Badge>
          </div>
        </CardHeader>
        <CardBody className="space-y-2">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-100 text-success-600 text-xs font-bold flex-shrink-0">1</div>
            <p className="text-sm text-slate-700">Math department shows 12% improvement this term, with Pre-Calculus leading at 85% average.</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-error-100 text-error-600 text-xs font-bold flex-shrink-0">2</div>
            <p className="text-sm text-slate-700">14 students identified as at-risk, primarily in Algebra I and Geometry, scoring below 50% on consecutive assessments.</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-warning-100 text-warning-600 text-xs font-bold flex-shrink-0">3</div>
            <p className="text-sm text-slate-700">Algebra I - Period 2 is underperforming by 11 points compared to department average.</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-info-100 text-info-600 text-xs font-bold flex-shrink-0">4</div>
            <p className="text-sm text-slate-700">Assessment frequency varies significantly. More frequent assessment correlates with better performance.</p>
          </div>
        </CardBody>
      </Card>

      {/* Insights by priority */}
      {high.length > 0 && (
        <div>
          <SectionTitle title="High Priority Items" description="Require immediate attention" />
          <div className="space-y-3 stagger">{high.map(renderInsight)}</div>
        </div>
      )}
      {medium.length > 0 && (
        <div>
          <SectionTitle title="Medium Priority Items" description="Plan for improvement" />
          <div className="space-y-3 stagger">{medium.map(renderInsight)}</div>
        </div>
      )}
      {low.length > 0 && (
        <div>
          <SectionTitle title="Informational" description="Positive trends and observations" />
          <div className="space-y-3 stagger">{low.map(renderInsight)}</div>
        </div>
      )}

      {/* AI disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <Sparkles className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500">
          These insights are AI-generated based on assessment data patterns. They are recommendations, not deterministic metrics. Always use professional judgment when making decisions about students and staff.
        </p>
      </div>
    </div>
  );
}
