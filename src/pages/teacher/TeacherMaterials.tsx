import { useState, useRef, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { classes } from '@/data/mockData';
import type { Material } from '@/types';
import {
  CloudUpload, MoreVertical, Trash2, Eye, Download,
  Sparkles, Check, ChevronDown, Plus, X,
} from 'lucide-react';
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown';
import { cn } from '@/lib/utils';

// Initial materials strictly matching the reference image
const initialReferenceMaterials: (Material & { timeAgo: string; displayClass: string })[] = [
  {
    id: 'mat_1',
    classId: 'c1',
    displayClass: 'Class 8A',
    title: 'Quadratic Equations & Factoring',
    fileName: 'quadratic_equations_ch5.pdf',
    fileSize: '2.4 MB',
    fileType: 'pdf',
    status: 'ready',
    extractedConcepts: ['Quadratic Formula', 'Factoring', 'Discriminant', 'Completing the Square', 'Vertex Form'],
    uploadedAt: '2024-08-28',
    timeAgo: '3 days ago',
    pageCount: 24,
  },
  {
    id: 'mat_2',
    classId: 'c2',
    displayClass: 'Class 8B',
    title: 'Triangle Congruence Theorems',
    fileName: 'triangle_congruence.docx',
    fileSize: '1.8 MB',
    fileType: 'docx',
    status: 'ready',
    extractedConcepts: ['SSS Theorem', 'SAS Postulate', 'ASA Criterion', 'AAS Congruence', 'CPCTC Application'],
    uploadedAt: '2024-08-24',
    timeAgo: '1 week ago',
    pageCount: 18,
  },
  {
    id: 'mat_3',
    classId: 'c3',
    displayClass: 'Class 9A',
    title: 'Limits and Continuity Notes',
    fileName: 'limits_and_continuity.txt',
    fileSize: '450 KB',
    fileType: 'txt',
    status: 'processing',
    extractedConcepts: ['Limit Definition', 'Left and Right Limits', 'Continuity Criteria'],
    uploadedAt: '2024-08-20',
    timeAgo: '2 weeks ago',
  },
  {
    id: 'mat_4',
    classId: 'c1',
    displayClass: 'Class 8A',
    title: 'Graph Examples',
    fileName: 'parabola_graphs_collection.png',
    fileSize: '1.1 MB',
    fileType: 'image',
    status: 'processing',
    extractedConcepts: ['Cartesian Coordinates', 'Vertex Plotting', 'Axis of Symmetry'],
    uploadedAt: '2024-08-19',
    timeAgo: '2 weeks ago',
  },
  {
    id: 'mat_5',
    classId: 'c1',
    displayClass: 'Class 8A',
    title: 'Rational Expressions',
    fileName: 'rational_expressions_guide.pdf',
    fileSize: '1.2 MB',
    fileType: 'pdf',
    status: 'ready',
    extractedConcepts: ['Simplifying Fractions', 'Excluded Values', 'Least Common Denominators'],
    uploadedAt: '2024-08-18',
    timeAgo: '3 weeks ago',
    pageCount: 14,
  },
];

// Custom File Type Icon matching the reference image's colorful file icons
function FileTypeBadge({ type }: { type: Material['fileType'] }) {
  switch (type) {
    case 'pdf':
      return (
        <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 flex flex-col items-center justify-center flex-shrink-0 shadow-xs">
          <svg className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="text-[9px] font-extrabold tracking-tight text-rose-600 uppercase leading-none mt-0.5">PDF</span>
        </div>
      );
    case 'docx':
    case 'doc':
      return (
        <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center flex-shrink-0 shadow-xs">
          <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="text-[8px] font-extrabold tracking-tight text-blue-600 uppercase leading-none mt-0.5">DOCX</span>
        </div>
      );
    case 'txt':
      return (
        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center flex-shrink-0 shadow-xs">
          <svg className="w-5 h-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="text-[9px] font-extrabold tracking-tight text-slate-600 uppercase leading-none mt-0.5">TXT</span>
        </div>
      );
    case 'image':
    default:
      return (
        <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 shadow-xs">
          <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      );
  }
}

export function TeacherMaterials() {
  const navigate = useNavigate();
  const { user } = useApp();
  const fileInputId = useId();

  // Teacher classes
  const myClasses = classes.filter((c) => c.teacherId === user.id);
  const classOptions = myClasses.length > 0 ? myClasses : [
    { id: 'c1', name: 'Class 8A' },
    { id: 'c2', name: 'Class 8B' },
    { id: 'c3', name: 'Class 9A' },
    { id: 'c4', name: 'Class 10A' },
  ];

  // State
  const [materialsList, setMaterialsList] = useState(initialReferenceMaterials);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadToast, setUploadToast] = useState<string | null>(null);

  // Detail Modal state
  const [selectedMaterial, setSelectedMaterial] = useState<(typeof initialReferenceMaterials)[0] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const classDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside click for custom dropdowns
  const handleDropdownToggle = (type: 'class' | 'sort') => {
    if (type === 'class') {
      setIsClassDropdownOpen((prev) => !prev);
      setIsSortDropdownOpen(false);
    } else {
      setIsSortDropdownOpen((prev) => !prev);
      setIsClassDropdownOpen(false);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(e.target.files);
    }
  };

  const processUploadedFiles = (files: FileList) => {
    const file = files[0];
    if (!file) return;

    // Detect type
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let fileType: Material['fileType'] = 'pdf';
    if (ext === 'docx' || ext === 'doc') fileType = 'docx';
    else if (ext === 'txt') fileType = 'txt';
    else if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext)) fileType = 'image';

    // File size in MB or KB
    const sizeInMB = file.size / (1024 * 1024);
    const formattedSize = sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;

    // Title from file name
    const rawTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

    // Associated class
    const targetClass = classOptions.find((c) => c.id === selectedClassId) || classOptions[0];
    const displayClass = targetClass ? (targetClass.name.startsWith('Class') ? targetClass.name : `Class ${targetClass.name.slice(0, 2)}`) : 'Class 8A';

    const newMaterialItem: (typeof initialReferenceMaterials)[0] = {
      id: `mat_${Date.now()}`,
      classId: targetClass?.id || 'c1',
      displayClass,
      title,
      fileName: file.name,
      fileSize: formattedSize,
      fileType,
      status: 'processing', // Only two statuses: processing & ready
      extractedConcepts: ['Key Terminology', 'Core Principles', 'Practical Application'],
      uploadedAt: new Date().toISOString().split('T')[0],
      timeAgo: 'Just now',
    };

    setMaterialsList((prev) => [newMaterialItem, ...prev]);

    // Show quick confirmation toast
    setUploadToast(`"${file.name}" uploaded successfully! AI is analyzing concepts.`);
    setTimeout(() => setUploadToast(null), 4000);

    // Simulate transition to "ready" after 4 seconds
    setTimeout(() => {
      setMaterialsList((prev) =>
        prev.map((m) => (m.id === newMaterialItem.id ? { ...m, status: 'ready' } : m))
      );
    }, 4500);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Delete material
  const handleDeleteMaterial = (id: string) => {
    setMaterialsList((prev) => prev.filter((m) => m.id !== id));
  };

  // Sorting
  const sortedMaterials = [...materialsList].sort((a, b) => {
    if (sortBy === 'newest') return b.uploadedAt.localeCompare(a.uploadedAt);
    if (sortBy === 'oldest') return a.uploadedAt.localeCompare(b.uploadedAt);
    return a.title.localeCompare(b.title);
  });

  const selectedClass = classOptions.find((c) => c.id === selectedClassId);

  return (
    <div className="space-y-7 pb-10">
      {/* Toast Notification */}
      {uploadToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-soft-lg text-sm animate-fade-in">
          <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
          <span>{uploadToast}</span>
          <button
            type="button"
            onClick={() => setUploadToast(null)}
            className="text-slate-400 hover:text-white transition-colors ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Learning Materials</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload learning materials and let AI extract key concepts for assessments.
        </p>
      </div>

      {/* Top Upload Section (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Large Drag-and-Drop Area (~72%) */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'lg:col-span-8 rounded-2xl border-2 border-dashed p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none bg-white',
            isDragging
              ? 'border-brand-500 bg-brand-50/40 ring-4 ring-brand-500/10'
              : 'border-[#99f6e4] hover:border-brand-400 hover:bg-[#f0fdfa]/30'
          )}
        >
          <input
            ref={fileInputRef}
            id={fileInputId}
            type="file"
            accept=".pdf,.docx,.doc,.txt,image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />

          <div className="mb-3 text-[#0d9488]">
            <CloudUpload className="h-11 w-11 stroke-[1.75]" />
          </div>

          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            Drag and drop a file here
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 mb-5 font-normal">
            or choose a file from your device
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="h-10 px-7 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] active:bg-[#115e59] text-white font-medium text-sm shadow-xs transition-colors"
          >
            Choose File
          </button>

          <p className="text-xs text-slate-400 mt-5 font-normal">
            PDF, DOCX, TXT or Image (JPG, PNG) · Max 20 MB
          </p>
        </div>

        {/* Right Column: Add to Class Dropdown Card (~28%) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/80 bg-white p-6 flex flex-col justify-start shadow-xs">
          <label htmlFor="select-class-btn" className="block text-sm font-bold text-slate-900 mb-3">
            Add to class
          </label>

          <div className="relative" ref={classDropdownRef}>
            <button
              id="select-class-btn"
              type="button"
              onClick={() => handleDropdownToggle('class')}
              className={cn(
                'w-full h-11 px-3.5 rounded-xl border bg-white text-sm text-left flex items-center justify-between transition-all duration-150',
                isClassDropdownOpen
                  ? 'border-brand-500 ring-2 ring-brand-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              )}
            >
              <span className={selectedClass ? 'text-slate-900 font-medium' : 'text-slate-500'}>
                {selectedClass ? (selectedClass.name.startsWith('Class') ? selectedClass.name : `Class ${selectedClass.name}`) : 'Select a class'}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-slate-400 transition-transform duration-200',
                  isClassDropdownOpen && 'rotate-180 text-brand-600'
                )}
              />
            </button>

            {/* Dropdown Options */}
            {isClassDropdownOpen && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-y-auto py-1 animate-scale-in">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedClassId('');
                    setIsClassDropdownOpen(false);
                  }}
                  className={cn(
                    'w-full px-3.5 py-2.5 text-left text-sm flex items-center justify-between transition-colors',
                    !selectedClassId ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <span>Select a class (Default)</span>
                  {!selectedClassId && <Check className="h-4 w-4 text-brand-600" />}
                </button>
                {classOptions.map((c) => {
                  const isSelected = selectedClassId === c.id;
                  const label = c.name.startsWith('Class') ? c.name : `Class ${c.name}`;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedClassId(c.id);
                        setIsClassDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full px-3.5 py-2.5 text-left text-sm flex items-center justify-between transition-colors',
                        isSelected ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <span>{label}</span>
                      {isSelected && <Check className="h-4 w-4 text-brand-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mt-4">
            The material will be available for assessments in this class.
          </p>
        </div>
      </div>

      {/* Uploaded Materials Section */}
      <div className="space-y-4 pt-2">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Uploaded Materials
          </h2>

          {/* Sort By Dropdown */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              type="button"
              onClick={() => handleDropdownToggle('sort')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors py-1 px-2 rounded-lg hover:bg-slate-100"
            >
              <span>Sort by:</span>
              <span className="capitalize">{sortBy}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isSortDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-scale-in">
                {(['newest', 'oldest', 'name'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSortBy(option);
                      setIsSortDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full px-3 py-1.5 text-left text-xs capitalize flex items-center justify-between transition-colors',
                      sortBy === option ? 'text-brand-700 font-semibold bg-brand-50' : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    <span>{option}</span>
                    {sortBy === option && <Check className="h-3.5 w-3.5 text-brand-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Clean Material List Rows */}
        <div className="space-y-3">
          {sortedMaterials.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-700">No materials uploaded yet</p>
              <p className="text-xs text-slate-400 mt-1">Upload your first document above to get started.</p>
            </div>
          ) : (
            sortedMaterials.map((m) => (
              <div
                key={m.id}
                className="group rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 hover:border-slate-300 hover:shadow-soft transition-all duration-150 flex items-center justify-between gap-3 sm:gap-4"
              >
                {/* Left Group: Icon + Title & File info */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <FileTypeBadge type={m.fileType} />

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-brand-700 transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-normal">
                      {m.fileSize} · Uploaded {new Date(m.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Right Group: Class Badge + Status Badge + Time Ago + Action Menu */}
                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                  {/* Class Badge */}
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#f0fdfa] text-[#0f766e] border border-[#ccfbf1] whitespace-nowrap">
                    {m.displayClass}
                  </span>

                  {/* Status Pill (Strictly 2 statuses: Ready & Processing) */}
                  {m.status === 'ready' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]/60 flex items-center gap-1.5 whitespace-nowrap">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                      Ready
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]/60 flex items-center gap-1.5 whitespace-nowrap">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2563eb] animate-pulse" />
                      Processing
                    </span>
                  )}

                  {/* Relative Time */}
                  <span className="text-xs text-slate-400 min-w-[70px] text-right hidden sm:block">
                    {m.timeAgo}
                  </span>

                  {/* Material Actions Dropdown */}
                  <Dropdown
                    trigger={
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Material actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    }
                  >
                    <DropdownItem
                      icon={<Eye className="h-4 w-4" />}
                      onClick={() => setSelectedMaterial(m)}
                    >
                      View Details
                    </DropdownItem>
                    {m.status === 'ready' && (
                      <DropdownItem
                        icon={<Sparkles className="h-4 w-4 text-brand-600" />}
                        onClick={() => navigate('/teacher/assessments/create')}
                      >
                        Create Assessment
                      </DropdownItem>
                    )}
                    <DropdownItem
                      icon={<Download className="h-4 w-4" />}
                      onClick={() => {
                        const blob = new Blob(['Mock file content'], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = m.fileName;
                        a.click();
                      }}
                    >
                      Download
                    </DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem
                      icon={<Trash2 className="h-4 w-4" />}
                      danger
                      onClick={() => handleDeleteMaterial(m.id)}
                    >
                      Delete
                    </DropdownItem>
                  </Dropdown>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Material Details / Concepts Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedMaterial(null)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-soft-lg border border-slate-100 animate-scale-in p-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <FileTypeBadge type={selectedMaterial.fileType} />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedMaterial.title}</h3>
                  <p className="text-xs text-slate-400">{selectedMaterial.fileName} · {selectedMaterial.fileSize}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMaterial(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Target Class:</span>
                <span className="font-semibold text-slate-800">{selectedMaterial.displayClass}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Status:</span>
                <span className={cn(
                  'px-2.5 py-0.5 rounded-full font-medium',
                  selectedMaterial.status === 'ready'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-blue-50 text-blue-700'
                )}>
                  {selectedMaterial.status === 'ready' ? 'Ready for Assessments' : 'Processing'}
                </span>
              </div>

              {selectedMaterial.extractedConcepts && selectedMaterial.extractedConcepts.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                    <span className="text-xs font-bold text-slate-700">AI-Extracted Key Concepts</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMaterial.extractedConcepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedMaterial(null)}
                className="h-9 px-4 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              {selectedMaterial.status === 'ready' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMaterial(null);
                    navigate('/teacher/assessments/create');
                  }}
                  className="h-9 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-soft flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Assessment
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
