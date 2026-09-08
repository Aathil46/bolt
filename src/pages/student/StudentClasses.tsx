import { useState } from 'react';
import { PageHeader } from '@/components/shared/StatCard';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { studentDashboardData } from '@/data/mockData';
import {
  Plus, BookOpen, Award, TrendingUp, User, ArrowRight,
  ClipboardPen,
} from 'lucide-react';

export function StudentClasses() {
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);

  const handleJoin = () => {
    if (!joinCode.trim()) {
      setError('Please enter a class code');
      return;
    }
    if (joinCode.length < 6) {
      setError('Class code must be at least 6 characters');
      return;
    }
    setError('');
    setJoining(true);
    setTimeout(() => {
      setJoining(false);
      setShowJoin(false);
      setJoinCode('');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Classes"
        description="Classes you're enrolled in."
        action={<Button onClick={() => setShowJoin(true)}><Plus className="h-4 w-4" /> Join Class</Button>}
      />

      {studentDashboardData.enrolledClasses.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-6 w-6" />}
          title="No classes yet"
          description="Join a class using the code your teacher gave you."
          action={<Button onClick={() => setShowJoin(true)}><Plus className="h-4 w-4" /> Join Class</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {studentDashboardData.enrolledClasses.map(c => (
            <Card key={c.id} hover className="overflow-hidden">
              <div className="h-1.5 bg-brand-500" />
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                    <BookOpen className="h-5.5 w-5.5" />
                  </div>
                  <Badge variant={c.avgScore >= 85 ? 'success' : c.avgScore >= 70 ? 'brand' : 'warning'} size="sm">{c.grade}</Badge>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">{c.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                  <User className="h-3.5 w-3.5" /> {c.teacher}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2 rounded-lg bg-slate-50">
                    <ClipboardPen className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                    <p className="text-sm font-bold text-slate-900">3</p>
                    <p className="text-2xs text-slate-400">Assessments</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-50">
                    <TrendingUp className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                    <p className="text-sm font-bold text-slate-900">{c.avgScore}%</p>
                    <p className="text-2xs text-slate-400">Avg Score</p>
                  </div>
                </div>
                {c.nextAssessment ? (
                  <div className="p-2.5 rounded-lg bg-accent-50 border border-accent-100 mb-3">
                    <p className="text-2xs font-semibold text-accent-600 uppercase tracking-wide">Up Next</p>
                    <p className="text-sm font-medium text-slate-900 truncate">{c.nextAssessment}</p>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-success-50 border border-success-100 mb-3">
                    <p className="text-xs text-success-700">No pending assessments</p>
                  </div>
                )}
                <Button variant="ghost" size="sm" className="w-full">View Class <ArrowRight className="h-3.5 w-3.5" /></Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showJoin}
        onClose={() => !joining && setShowJoin(false)}
        title="Join a Class"
        description="Enter the class code your teacher gave you."
        footer={
          <>
            <Button variant="outline" onClick={() => !joining && setShowJoin(false)} disabled={joining}>Cancel</Button>
            <Button onClick={handleJoin} loading={joining}>Join Class</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Class Code"
            placeholder="e.g., ALG2P3-7K3X"
            value={joinCode}
            onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setError(''); }}
            error={error}
            hint="The code is case-insensitive. Ask your teacher if you don't have one."
          />
          <div className="p-3 rounded-lg bg-brand-50 border border-brand-200">
            <p className="text-xs text-brand-700">You'll be enrolled immediately and can see all upcoming assessments.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
