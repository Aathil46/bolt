import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionTitle } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { studentDashboardData, assessments } from '@/data/mockData';
import {
  ClipboardPen, Clock, FileText, ArrowRight, CheckCircle2,
  AlertCircle, Play, Lock, BookOpen,
} from 'lucide-react';
import { useState } from 'react';

export function StudentAssessments() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('todo');

  const toDo = studentDashboardData.toDoAssessments;
  const completed = studentDashboardData.completedAssessments;

  return (
    <div className="space-y-6">
      <PageHeader title="Assessments" description="View and take your assigned assessments." />

      <Tabs
        tabs={[
          { id: 'todo', label: 'To Do', icon: <Clock className="h-3.5 w-3.5" />, count: toDo.length },
          { id: 'completed', label: 'Completed', icon: <CheckCircle2 className="h-3.5 w-3.5" />, count: completed.length },
        ]}
        activeTab={tab}
        onChange={setTab}
      />

      {tab === 'todo' && (
        <div className="space-y-3 stagger">
          {toDo.length > 0 ? toDo.map(a => (
            <Card key={a.id} hover onClick={() => navigate(`/student/assessments/${a.id}`)}>
              <CardBody className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600 flex-shrink-0">
                  <ClipboardPen className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-900">{a.title}</h3>
                  <p className="text-sm text-slate-500">{a.className}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {a.questions} questions</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {a.duration} min</span>
                    <Badge variant="warning" size="sm" dot>Due {a.dueDate}</Badge>
                  </div>
                </div>
                <Button size="md" className="flex-shrink-0"><Play className="h-4 w-4" /> Start</Button>
              </CardBody>
            </Card>
          )) : (
            <EmptyState icon={<CheckCircle2 className="h-6 w-6" />} title="All caught up!" description="No pending assessments right now. Great job!" />
          )}
        </div>
      )}

      {tab === 'completed' && (
        <div className="space-y-3 stagger">
          {completed.length > 0 ? completed.map(a => (
            <Card key={a.id} hover onClick={() => navigate(`/student/results/${a.id}`)}>
              <CardBody className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 ${a.passed ? 'bg-success-50 text-success-600' : 'bg-error-50 text-error-600'}`}>
                  {a.passed ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-900">{a.title}</h3>
                  <p className="text-sm text-slate-500">{a.className} · Completed {a.completedDate}</p>
                  {a.rank && <p className="text-xs text-slate-400 mt-1">Class Rank: #{a.rank}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-2xl font-bold ${a.passed ? 'text-success-600' : 'text-error-600'}`}>{a.score}%</p>
                  <Badge variant={a.passed ? 'success' : 'error'} size="sm">{a.passed ? 'Passed' : 'Failed'}</Badge>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </CardBody>
            </Card>
          )) : (
            <EmptyState icon={<ClipboardPen className="h-6 w-6" />} title="No completed assessments" description="Your completed assessments will appear here." />
          )}
        </div>
      )}
    </div>
  );
}
