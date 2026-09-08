import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  Sparkles, FileText, BarChart3, Lightbulb, ArrowRight,
  GraduationCap, BookOpen, Building2, Check, Brain,
  Target, TrendingUp, AlertCircle, Zap, LineChart,
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
              <LineChart className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">AssessAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#roles" className="hover:text-slate-900 transition-colors">For Your Role</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link to="/login"><Button size="sm">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-white to-white" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-medium mb-6 animate-fade-in-down">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Assessment Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6 text-balance animate-fade-in-up">
            From assessment to <span className="ai-gradient-text">actionable insight</span> in one intelligent platform
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 text-balance animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Upload your materials, generate AI assessments, and get concept-level analytics that identify learning gaps before they grow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/login"><Button size="lg" className="w-full sm:w-auto">Start Assessing <ArrowRight className="h-4 w-4" /></Button></Link>
            <a href="#how"><Button variant="outline" size="lg" className="w-full sm:w-auto">See How It Works</Button></a>
          </div>

          {/* Hero visual */}
          <div className="mt-16 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="rounded-2xl border border-slate-200 shadow-soft-lg bg-white p-6 text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                </div>
                <span className="text-xs text-slate-400 ml-2">AssessAI Dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 space-y-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-2xs text-slate-400 mb-1">Class Average</p>
                    <p className="text-2xl font-bold text-slate-900">78%</p>
                    <div className="h-1.5 w-full rounded-full bg-slate-200 mt-2">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-2xs text-slate-400 mb-1">Pass Rate</p>
                    <p className="text-2xl font-bold text-slate-900">82%</p>
                    <div className="flex gap-1 mt-2">
                      <div className="h-1.5 flex-1 rounded-full bg-success-500" />
                      <div className="h-1.5 flex-1 rounded-full bg-success-500" />
                      <div className="h-1.5 flex-1 rounded-full bg-success-500" />
                      <div className="h-1.5 flex-1 rounded-full bg-success-500" />
                      <div className="h-1.5 flex-1 rounded-full bg-error-500" />
                    </div>
                  </div>
                </div>
                <div className="col-span-2 rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-slate-700">Concept Performance</p>
                    <span className="text-2xs text-brand-600 font-medium">AI Analyzed</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Quadratic Formula', val: 89, color: 'bg-success-500' },
                      { label: 'Factoring', val: 85, color: 'bg-success-500' },
                      { label: 'Discriminant', val: 72, color: 'bg-warning-500' },
                      { label: 'Vertex Form', val: 48, color: 'bg-error-500' },
                    ].map((c, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-2xs text-slate-500 w-28 truncate">{c.label}</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-200">
                          <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.val}%` }} />
                        </div>
                        <span className="text-2xs font-semibold text-slate-700 w-8 text-right">{c.val}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">The intelligent assessment workflow</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Five steps from raw material to learning-gap resolution.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { icon: FileText, title: 'Upload Materials', desc: 'PDFs, docs, slides. AI extracts key concepts automatically.', color: 'brand' },
              { icon: Sparkles, title: 'AI Assessment', desc: 'Generate questions tailored to your learning materials.', color: 'accent' },
              { icon: Zap, title: 'Evaluate', desc: 'Students take assessments. Auto-grading handles the rest.', color: 'info' },
              { icon: BarChart3, title: 'Concept Analysis', desc: 'See performance broken down by concept, not just score.', color: 'success' },
              { icon: Lightbulb, title: 'Actionable Insights', desc: 'AI identifies gaps and recommends teaching strategies.', color: 'warning' },
            ].map((step, i) => (
              <div key={i} className="relative">
                <Card className="p-5 h-full">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${step.color}-100 text-${step.color}-600 mb-4`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xs font-bold text-slate-300">STEP {i + 1}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </Card>
                {i < 4 && (
                  <div className="hidden md:flex absolute top-1/2 -right-2.5 -translate-y-1/2 z-10">
                    <ArrowRight className="h-4 w-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Built for real classrooms</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Every feature serves a purpose: helping students learn and teachers teach.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Brain, title: 'AI Concept Extraction', desc: 'Upload a PDF and get structured learning concepts extracted automatically. No manual tagging.' },
              { icon: Zap, title: 'Instant Assessment Generation', desc: 'Generate complete assessments with questions, answers, and explanations from your materials.' },
              { icon: Target, title: 'Concept-Level Analytics', desc: 'Go beyond overall scores. See exactly which concepts students have mastered and which need work.' },
              { icon: AlertCircle, title: 'Learning Gap Detection', desc: 'AI identifies specific learning gaps for individual students and entire classes.' },
              { icon: Lightbulb, title: 'AI Teaching Insights', desc: 'Get actionable, AI-generated recommendations on what to reteach and how.' },
              { icon: TrendingUp, title: 'Progress Tracking', desc: 'Track improvement over time across classes, students, and concepts.' },
            ].map((f, i) => (
              <Card key={i} className="p-6 card-hover">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 mb-4">
                  <f.icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">One platform, three perspectives</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Tailored experiences for every role in the school.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: GraduationCap, color: 'brand',
                title: 'For Teachers',
                features: ['Manage multiple classes', 'Upload & organize materials', 'Generate AI assessments', 'Track concept mastery', 'Get AI teaching insights'],
              },
              {
                icon: BookOpen, color: 'info',
                title: 'For Students',
                features: ['Join classes with a code', 'Take assessments distraction-free', 'See concept-level results', 'Practice weak areas', 'Track your progress'],
              },
              {
                icon: Building2, color: 'accent',
                title: 'For Principals',
                features: ['School-wide analytics', 'Class & teacher comparisons', 'Identify at-risk students', 'Track weak concepts', 'AI-generated school insights'],
              },
            ].map((role, i) => (
              <Card key={i} className="p-6 card-hover">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${role.color}-100 text-${role.color}-600 mb-5`}>
                  <role.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{role.title}</h3>
                <ul className="space-y-2.5">
                  {role.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-success-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-10 sm:p-14 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-balance">Ready to transform your assessments?</h2>
              <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto">Join schools using AssessAI to turn every assessment into a learning opportunity.</p>
              <Link to="/login">
                <Button size="lg" variant="secondary" className="bg-white text-brand-700 hover:bg-brand-50">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <LineChart className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-bold text-slate-900">AssessAI</span>
            <span className="text-xs text-slate-400 ml-2">Smart Assessment Platform</span>
          </div>
          <p className="text-xs text-slate-400">© 2025 AssessAI. Built for educators.</p>
        </div>
      </footer>
    </div>
  );
}
