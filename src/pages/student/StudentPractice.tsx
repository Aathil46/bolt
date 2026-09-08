import { useState } from 'react';
import { PageHeader, SectionTitle } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { EmptyState } from '@/components/ui/EmptyState';
import { studentDashboardData } from '@/data/mockData';
import {
  Sparkles, Target, Clock, FileText, ArrowRight,
  CheckCircle2, TrendingUp, Play, ChevronRight,
} from 'lucide-react';

export function StudentPractice() {
  const [selected, setSelected] = useState<string | null>(null);
  const [practicing, setPracticing] = useState(false);

  const practice = studentDashboardData.recommendedPractice.find(p => p.id === selected);

  if (practicing && practice) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => setPracticing(false)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ChevronRight className="h-4 w-4 rotate-180" /> Exit Practice
          </button>
          <Badge variant="brand" dot>Practicing: {practice.concept}</Badge>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-900">Question 1 of {practice.questionCount}</span>
            <Progress value={10} size="sm" className="w-32" />
          </div>

          <p className="text-lg font-medium text-slate-900 mb-6">Convert the quadratic f(x) = x² - 6x + 8 to vertex form.</p>

          <div className="space-y-2.5">
            {['(x-3)² - 1', '(x+3)² - 1', '(x-3)² + 1', '(x+3)² + 1'].map((opt, j) => (
              <button key={j} className="flex w-full items-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-all text-left">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 text-sm font-semibold">{String.fromCharCode(65 + j)}</span>
                <span className="text-sm text-slate-700">{opt}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <Button variant="outline">Skip</Button>
            <Button onClick={() => setPracticing(false)}>Check Answer <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Practice" description="Strengthen your weak concepts with targeted practice questions." />

      {/* Weak concepts summary */}
      <Card className="border-error-200">
        <CardHeader>
          <SectionTitle title="Your Focus Areas" description="Concepts where you need more practice" action={<Badge variant="error" dot>Needs Work</Badge>} />
        </CardHeader>
        <CardBody className="space-y-3">
          {studentDashboardData.weakConcepts.map((c, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-900">{c.concept}</span>
                  <span className="text-xs font-semibold text-error-600">{c.score}%</span>
                </div>
                <Progress value={c.score} size="sm" variant="error" />
                <p className="text-2xs text-slate-400 mt-1">{c.class}</p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Recommended practice */}
      <div>
        <SectionTitle title="Recommended Practice" description="AI-curated practice sets for your weak areas" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {studentDashboardData.recommendedPractice.map(p => (
            <Card key={p.id} hover onClick={() => setSelected(p.id)} className={selected === p.id ? 'border-brand-400 shadow-glow-brand' : ''}>
              <CardBody>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <Badge variant={p.difficulty === 'Hard' ? 'error' : p.difficulty === 'Medium' ? 'warning' : 'success'} size="sm">{p.difficulty}</Badge>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">{p.concept}</h3>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{p.description}</p>
                <div className="flex items-center gap-3 text-2xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {p.questionCount} questions</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.estimatedTime}</span>
                </div>
                <Button size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); setSelected(p.id); setPracticing(true); }}>
                  <Play className="h-3.5 w-3.5" /> Start Practice
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Strong concepts */}
      <Card className="border-success-200">
        <CardHeader>
          <SectionTitle title="Your Strong Areas" description="Concepts you've mastered" action={<Badge variant="success" dot>Mastered</Badge>} />
        </CardHeader>
        <CardBody className="space-y-2">
          {studentDashboardData.strongConcepts.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-success-50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success-500" />
                <span className="text-sm text-slate-700">{c.concept}</span>
              </div>
              <span className="text-sm font-semibold text-success-600">{c.score}%</span>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
