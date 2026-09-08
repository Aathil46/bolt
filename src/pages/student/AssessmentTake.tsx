import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Modal } from '@/components/ui/Modal';
import { assessments } from '@/data/mockData';
import type { Question } from '@/types';
import {
  Clock, ChevronLeft, ChevronRight, Flag, X, CheckCircle2,
  AlertCircle, Send, BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AssessmentTake() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const assessment = assessments.find(a => a.id === assessmentId);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSubmit, setShowSubmit] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!assessment) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Assessment not found.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/student/assessments')}>Back to Assessments</Button>
        </div>
      </div>
    );
  }

  const questions = assessment.questions;
  const question = questions[currentQ];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  const selectAnswer = (qid: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [qid]: answer }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate(`/student/results/${assessment.id}`), 1500);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center animate-scale-in">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-success-100 text-success-600 mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Assessment Submitted!</h2>
          <p className="text-sm text-slate-500 mb-6">Your answers have been recorded. Redirecting to results...</p>
          <div className="flex justify-center">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="h-2 w-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header bar */}
      <div className="sticky top-16 z-10 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl p-4 mb-6 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowExit(true)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
              <X className="h-4.5 w-4.5" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">{assessment.title}</h1>
              <p className="text-2xs text-slate-400">{assessment.className}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700 tabular-nums">{assessment.duration}:00</span>
          </div>
        </div>
        <Progress value={progress} size="md" />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-500">{answeredCount} of {questions.length} answered</span>
          <span className="text-xs text-slate-500">Question {currentQ + 1} of {questions.length}</span>
        </div>
      </div>

      {/* Question */}
      <div key={currentQ} className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-sm font-bold">{currentQ + 1}</span>
          <Badge variant="default" size="sm">{question.type === 'multiple-choice' ? 'Multiple Choice' : question.type === 'true-false' ? 'True / False' : 'Short Answer'}</Badge>
          <Badge variant={question.difficulty === 'easy' ? 'success' : question.difficulty === 'medium' ? 'warning' : 'error'} size="sm">{question.difficulty}</Badge>
          <Badge variant="brand" size="sm">{question.points} pts</Badge>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft mb-6">
          <p className="text-lg font-medium text-slate-900 mb-6 leading-relaxed">{question.question}</p>

          {question.type === 'short-answer' ? (
            <textarea
              placeholder="Type your answer here..."
              value={answers[question.id] || ''}
              onChange={(e) => selectAnswer(question.id, e.target.value)}
              className="w-full min-h-32 rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
            />
          ) : (
            <div className="space-y-2.5">
              {question.options?.map((opt, j) => {
                const isSelected = answers[question.id] === opt;
                return (
                  <button
                    key={j}
                    onClick={() => selectAnswer(question.id, opt)}
                    className={cn(
                      'flex w-full items-center gap-3 p-4 rounded-xl border-2 text-left transition-all',
                      isSelected
                        ? 'border-brand-500 bg-brand-50 shadow-glow-brand'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    )}
                  >
                    <span className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold flex-shrink-0 transition-colors',
                      isSelected ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
                    )}>
                      {isSelected ? <CheckCircle2 className="h-4 w-4" /> : String.fromCharCode(65 + j)}
                    </span>
                    <span className={cn('text-sm', isSelected ? 'text-brand-900 font-medium' : 'text-slate-700')}>{opt}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        {currentQ < questions.length - 1 ? (
          <Button onClick={() => setCurrentQ(currentQ + 1)}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="success" onClick={() => setShowSubmit(true)}>
            <Send className="h-4 w-4" /> Submit Assessment
          </Button>
        )}
      </div>

      {/* Question grid */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Questions</p>
        <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
          {questions.map((q, i) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = i === currentQ;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQ(i)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-all',
                  isCurrent
                    ? 'bg-brand-500 text-white ring-2 ring-brand-300 ring-offset-1'
                    : isAnswered
                    ? 'bg-success-100 text-success-700 hover:bg-success-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                )}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-2xs text-slate-400">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-brand-500" /> Current</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-success-100" /> Answered</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-slate-100" /> Unanswered</span>
        </div>
      </div>

      {/* Submit confirmation */}
      <Modal
        open={showSubmit}
        onClose={() => setShowSubmit(false)}
        title="Submit Assessment?"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowSubmit(false)}>Keep Working</Button>
            <Button variant="success" onClick={handleSubmit}><Send className="h-4 w-4" /> Submit Now</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <div className="flex-1">
              <p className="text-sm text-slate-700">Answered: <span className="font-bold">{answeredCount}</span> / {questions.length}</p>
              <p className="text-sm text-slate-700">Unanswered: <span className="font-bold text-error-600">{questions.length - answeredCount}</span></p>
            </div>
          </div>
          {questions.length - answeredCount > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-warning-50 border border-warning-200">
              <AlertCircle className="h-4 w-4 text-warning-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-warning-700">You have {questions.length - answeredCount} unanswered question(s). You can still submit, but unanswered questions will be marked as incorrect.</p>
            </div>
          )}
          <p className="text-sm text-slate-500">Once submitted, you cannot change your answers. Your results will be available immediately.</p>
        </div>
      </Modal>

      {/* Exit confirmation */}
      <Modal
        open={showExit}
        onClose={() => setShowExit(false)}
        title="Leave Assessment?"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowExit(false)}>Stay</Button>
            <Button variant="danger" onClick={() => navigate('/student/assessments')}>Leave</Button>
          </>
        }
      >
        <p className="text-sm text-slate-500">Your progress will be saved and you can resume later. Are you sure you want to leave?</p>
      </Modal>
    </div>
  );
}
