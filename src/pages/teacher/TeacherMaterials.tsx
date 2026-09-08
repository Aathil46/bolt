import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionTitle } from '@/components/shared/StatCard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { useApp } from '@/context/AppContext';
import { materials, classes } from '@/data/mockData';
import type { Material } from '@/types';
import {
  Plus, Upload, FileText, FileCheck, FileX, Loader,
  Sparkles, MoreVertical, Trash2, Eye, Download, AlertCircle,
} from 'lucide-react';
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown';

export function TeacherMaterials() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [filterClass, setFilterClass] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const myClasses = classes.filter(c => c.teacherId === user.id);
  const myMaterials = materials.filter(m => myClasses.some(c => c.id === m.classId));
  const filtered = filterClass === 'all' ? myMaterials : myMaterials.filter(m => m.classId === filterClass);

  const handleUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadOpen(false);
          return 0;
        }
        return p + 10;
      });
    }, 200);
  };

  const getStatusConfig = (status: Material['status']) => {
    switch (status) {
      case 'ready': return { icon: <FileCheck className="h-4 w-4" />, color: 'text-success-600', bg: 'bg-success-50', label: 'Ready', badge: 'success' as const };
      case 'processing': return { icon: <Loader className="h-4 w-4 animate-spin" />, color: 'text-info-600', bg: 'bg-info-50', label: 'Processing', badge: 'info' as const };
      case 'extracting': return { icon: <Sparkles className="h-4 w-4 animate-pulse" />, color: 'text-accent-600', bg: 'bg-accent-50', label: 'AI Extracting', badge: 'accent' as const };
      case 'error': return { icon: <FileX className="h-4 w-4" />, color: 'text-error-600', bg: 'bg-error-50', label: 'Error', badge: 'error' as const };
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Materials"
        description="Upload documents and let AI extract learning concepts automatically."
        action={<Button onClick={() => setUploadOpen(true)}><Upload className="h-4 w-4" /> Upload Material</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="max-w-xs">
          <option value="all">All Classes</option>
          {myClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No materials yet"
          description="Upload PDFs, documents, or slides. AI will extract learning concepts automatically."
          action={<Button onClick={() => setUploadOpen(true)}><Upload className="h-4 w-4" /> Upload Material</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {filtered.map(m => {
            const status = getStatusConfig(m.status);
            const cls = myClasses.find(c => c.id === m.classId);
            return (
              <Card key={m.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <Dropdown
                      trigger={<button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"><MoreVertical className="h-4 w-4" /></button>}
                    >
                      <DropdownItem icon={<Eye className="h-4 w-4" />}>View Details</DropdownItem>
                      <DropdownItem icon={<Download className="h-4 w-4" />}>Download</DropdownItem>
                      <DropdownSeparator />
                      <DropdownItem icon={<Trash2 className="h-4 w-4" />} danger>Delete</DropdownItem>
                    </Dropdown>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2">{m.title}</h3>
                  <p className="text-xs text-slate-400 mb-3 font-mono truncate">{m.fileName}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={status.badge} size="sm" dot>{status.label}</Badge>
                    <span className="text-2xs text-slate-400">{m.fileSize}</span>
                    {m.pageCount && <span className="text-2xs text-slate-400">· {m.pageCount} pages</span>}
                  </div>

                  {(m.status === 'processing' || m.status === 'extracting') && m.progress !== undefined && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-2xs text-slate-500">{m.status === 'extracting' ? 'AI extracting concepts...' : 'Processing file...'}</span>
                        <span className="text-2xs font-semibold text-slate-700">{m.progress}%</span>
                      </div>
                      <Progress value={m.progress} size="sm" variant={m.status === 'extracting' ? 'warning' : 'info'} />
                    </div>
                  )}

                  {m.status === 'ready' && m.extractedConcepts.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles className="h-3 w-3 text-accent-500" />
                        <span className="text-2xs font-semibold text-slate-500 uppercase tracking-wide">AI Extracted Concepts</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {m.extractedConcepts.slice(0, 4).map((c, i) => (
                          <span key={i} className="px-2 py-0.5 text-2xs font-medium bg-slate-100 text-slate-600 rounded-md">{c}</span>
                        ))}
                        {m.extractedConcepts.length > 4 && (
                          <span className="px-2 py-0.5 text-2xs font-medium bg-slate-100 text-slate-500 rounded-md">+{m.extractedConcepts.length - 4} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {m.status === 'error' && (
                    <div className="mt-3 p-2.5 rounded-lg bg-error-50 border border-error-200 flex items-center gap-2">
                      <AlertCircle className="h-3.5 w-3.5 text-error-500 flex-shrink-0" />
                      <span className="text-xs text-error-600">Processing failed. Try again.</span>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-2xs text-slate-400">{cls?.name}</span>
                    {m.status === 'ready' && (
                      <Button variant="ghost" size="sm" onClick={() => navigate('/teacher/assessments')}>
                        Create Assessment <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => !uploading && setUploadOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-soft-lg animate-scale-in">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Upload Learning Material</h2>
              <p className="text-sm text-slate-500 mt-1">AI will extract concepts automatically after upload.</p>
            </div>
            <div className="p-5">
              {!uploading ? (
                <>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-brand-400 hover:bg-brand-50/30 transition-all cursor-pointer"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 mx-auto mb-3">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, DOCX, PPTX up to 10MB</p>
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
                  </div>
                  <div className="mt-4">
                    <Select label="Select Class">
                      {myClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                  </div>
                </>
              ) : (
                <div className="py-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info-50 text-info-600">
                      {uploadProgress < 100 ? <Loader className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 animate-pulse" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {uploadProgress < 100 ? 'Uploading file...' : 'AI extracting concepts...'}
                      </p>
                      <p className="text-xs text-slate-500">quadratic_equations_ch5.pdf · 2.4 MB</p>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} size="lg" variant={uploadProgress < 100 ? 'info' : 'warning'} />
                  {uploadProgress >= 100 && (
                    <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-accent-50 border border-accent-200 animate-fade-in">
                      <Sparkles className="h-4 w-4 text-accent-500" />
                      <span className="text-xs text-accent-700">AI is analyzing the document and extracting learning concepts...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {!uploading && (
              <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-100">
                <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
                <Button onClick={handleUpload}><Upload className="h-4 w-4" /> Upload</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
