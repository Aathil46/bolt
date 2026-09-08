import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionTitle } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { useApp } from '@/context/AppContext';
import { assessments, classes, materials } from '@/data/mockData';
import {
  Plus, FileText, Clock, Users, CheckCircle2, AlertCircle,
  ArrowRight, ClipboardPen, Eye, Send, Edit3, Sparkles,
} from 'lucide-react';

export function TeacherAssessments() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [tab, setTab] = useState('all');

  const myClasses = classes.filter(c => c.teacherId === user.id);
  const myAssessments = assessments.filter(a => myClasses.some(c => c.id === a.classId));

  const filtered = tab === 'all' ? myAssessments :
    tab === 'published' ? myAssessments.filter(a => a.status === 'published') :
    tab === 'draft' ? myAssessments.filter(a => a.status === 'draft') :
    myAssessments;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        description="Create, manage, and publish AI-generated assessments."
        action={<Button onClick={() => navigate('/teacher/assessments/create')}><Plus className="h-4 w-4" /> Create Assessment</Button>}
      />

      <Tabs
        tabs={[
          { id: 'all', label: 'All', count: myAssessments.length },
          { id: 'published', label: 'Published', count: myAssessments.filter(a => a.status === 'published').length },
          { id: 'draft', label: 'Drafts', count: myAssessments.filter(a => a.status === 'draft').length },
        ]}
        activeTab={tab}
        onChange={setTab}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardPen className="h-6 w-6" />}
          title="No assessments yet"
          description="Create your first AI-powered assessment from your learning materials."
          action={<Button onClick={() => navigate('/teacher/assessments/create')}><Plus className="h-4 w-4" /> Create Assessment</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger">
          {filtered.map(a => {
            const cls = myClasses.find(c => c.id === a.classId);
            const mat = materials.find(m => m.id === a.materialId);
            const completionPct = Math.round((a.participation.completed / a.participation.total) * 100);
            return (
              <Card key={a.id} hover onClick={() => navigate(`/teacher/assessments/${a.id}`)} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${cls?.color || 'brand'}-100 text-${cls?.color || 'brand'}-600`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    {a.status === 'published' ? <Badge variant="success" dot>Published</Badge> : <Badge variant="default" dot>Draft</Badge>}
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 mb-1">{a.title}</h3>
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">{a.description}</p>

                  <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {a.questionCount} questions</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {a.duration} min</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {a.participation.total} students</span>
                  </div>

                  {a.status === 'published' && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Participation</span>
                        <span className="text-xs font-semibold text-slate-700">{a.participation.completed}/{a.participation.total} ({completionPct}%)</span>
                      </div>
                      <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="bg-success-500" style={{ width: `${(a.participation.completed / a.participation.total) * 100}%` }} />
                        <div className="bg-accent-500" style={{ width: `${(a.participation.inProgress / a.participation.total) * 100}%` }} />
                      </div>
                      <div className="flex items-center gap-3 text-2xs">
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-success-500" /> {a.participation.completed} completed</span>
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-accent-500" /> {a.participation.inProgress} in progress</span>
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-slate-300" /> {a.participation.notStarted} not started</span>
                      </div>
                    </div>
                  )}

                  {mat && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 mb-3">
                      <Sparkles className="h-3.5 w-3.5 text-accent-500 flex-shrink-0" />
                      <span className="text-xs text-slate-500 truncate">From: {mat.title}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400">{cls?.name}</span>
                    {a.status === 'published' ? (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900">{a.avgScore}%</span>
                        <span className="text-xs text-slate-400">avg</span>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/teacher/assessments/${a.id}`); }}>
                        Continue <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
