import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';
import { LineChart, Mail, Lock, GraduationCap, BookOpen, Building2, ArrowRight, Check } from 'lucide-react';
import type { Role } from '@/types';
import { cn } from '@/lib/utils';

export function AuthPage() {
  const { setRole } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const roles: { id: Role; label: string; icon: typeof GraduationCap; desc: string }[] = [
    { id: 'teacher', label: 'Teacher', icon: GraduationCap, desc: 'Create assessments & track students' },
    { id: 'student', label: 'Student', icon: BookOpen, desc: 'Take assessments & view results' },
    { id: 'principal', label: 'Principal', icon: Building2, desc: 'Monitor school performance' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (mode === 'signup' && !name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setRole(selectedRole);
      navigate(`/${selectedRole}`);
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/4" />

        <div className="relative flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2.5 w-fit">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <LineChart className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">AssessAI</span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4 text-balance leading-tight">
              Assessment that teaches you something.
            </h1>
            <p className="text-brand-100 text-lg mb-8">
              Upload materials, generate AI assessments, and get concept-level insights that actually help students learn.
            </p>
            <div className="space-y-3">
              {[
                'AI-generated assessments from your materials',
                'Concept-level performance analytics',
                'Learning gap detection & teaching insights',
                'School-wide analytics for principals',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-sm text-brand-50">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-brand-200/60">© 2025 AssessAI. Smart Assessment Platform.</p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <LineChart className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-slate-900">AssessAI</span>
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm text-slate-500">
              {mode === 'login' ? 'Sign in to your AssessAI account' : 'Get started with AssessAI in seconds'}
            </p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-700 mb-2">I am a...</p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all',
                    selectedRole === r.id
                      ? 'border-brand-500 bg-brand-50 shadow-glow-brand'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  )}
                >
                  <r.icon className={cn('h-5 w-5', selectedRole === r.id ? 'text-brand-600' : 'text-slate-400')} />
                  <span className={cn('text-xs font-semibold', selectedRole === r.id ? 'text-brand-700' : 'text-slate-600')}>
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">{roles.find(r => r.id === selectedRole)?.desc}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />
            )}
            <Input
              label="Email"
              type="email"
              placeholder="you@school.edu"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                  <span className="text-xs">Remember me</span>
                </label>
                <a href="#" className="text-xs font-medium text-brand-600 hover:text-brand-700">Forgot password?</a>
              </div>
            )}

            <Button type="submit" size="lg" loading={loading} className="w-full">
              {mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="font-semibold text-brand-600 hover:text-brand-700">
                  Sign up
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => setMode('login')} className="font-semibold text-brand-600 hover:text-brand-700">
                  Sign in
                </button>
              </>
            )}
          </div>

          <p className="mt-6 text-center text-2xs text-slate-400">
            By continuing, you agree to AssessAI's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
