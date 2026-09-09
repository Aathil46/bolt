import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/StatCard';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useApp } from '@/context/AppContext';
import { classes as initialClasses } from '@/data/mockData';
import type { Class } from '@/types';
import { CreateClassModal } from './components/CreateClassModal';
import {
  Plus, Users, ClipboardPen, TrendingUp, Copy, Check,
  BookOpen, ArrowRight, Search,
} from 'lucide-react';

export function TeacherClasses() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [classList, setClassList] = useState<Class[]>(initialClasses);
  const [showCreate, setShowCreate] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const myClasses = classList.filter(c => c.teacherId === user.id);
  const filtered = myClasses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        description="Manage your classes, students, and join codes."
        action={<Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4" /> Create Class</Button>}
      />

      {myClasses.length > 0 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>
      )}

      {filtered.length === 0 && search ? (
        <EmptyState icon={<Search className="h-6 w-6" />} title="No classes found" description={`No classes match "${search}".`} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-6 w-6" />}
          title="No classes yet"
          description="Create your first class to start managing students and assessments."
          action={<Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4" /> Create Class</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {filtered.map(cls => (
            <Card key={cls.id} hover className="overflow-hidden group" onClick={() => navigate(`/teacher/classes/${cls.id}`)}>
              <div className={`h-1.5 bg-${cls.color}-500`} />
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-${cls.color}-100 text-${cls.color}-600`}>
                    <BookOpen className="h-5.5 w-5.5" />
                  </div>
                  <Badge variant="neutral" size="sm">{cls.grade}</Badge>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">{cls.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{cls.subject}</p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 rounded-lg bg-slate-50">
                    <Users className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                    <p className="text-sm font-bold text-slate-900">{cls.studentCount}</p>
                    <p className="text-2xs text-slate-400">Students</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-50">
                    <ClipboardPen className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                    <p className="text-sm font-bold text-slate-900">{cls.assessmentCount}</p>
                    <p className="text-2xs text-slate-400">Assessments</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-50">
                    <TrendingUp className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                    <p className="text-sm font-bold text-slate-900">{cls.avgPerformance}%</p>
                    <p className="text-2xs text-slate-400">Avg</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-2xs text-slate-400 font-medium uppercase tracking-wide">Join Code</p>
                    <p className="text-sm font-mono font-semibold text-slate-900 truncate">{cls.joinCode}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); copyCode(cls.joinCode); }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-brand-600 transition-colors flex-shrink-0"
                  >
                    {copiedCode === cls.joinCode ? <Check className="h-4 w-4 text-success-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Created {new Date(cls.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                  <span className="flex items-center gap-1 text-xs font-medium text-brand-600 group-hover:gap-2 transition-all">
                    View <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <CreateClassModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onClassCreated={(newClass) => {
          setClassList((prev) => [newClass, ...prev]);
        }}
      />
    </div>
  );
}
