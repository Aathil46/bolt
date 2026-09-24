export interface WeakStudentItem {
  id: string;
  name: string;
  avatar: string;
  classId: string;
  className: string;
  grade: string;
  teacherName: string;
  weakConcepts: { concept: string; score: number }[];
  affectedAssessmentsCount: number;
  overallScore: number;
  status: 'needs-attention' | 'critical' | 'improving';
  lastAssessmentDate: string;
  interventionAssigned?: string;
}

export interface InterventionItem {
  id: string;
  problem: string;
  targetType: 'student' | 'class' | 'concept';
  targetName: string;
  action: string;
  responsibleTeacher: string;
  status: 'in-progress' | 'completed' | 'scheduled';
  startDate: string;
  outcome?: string;
  measurableChange?: string;
}

export interface ImportantUpdateItem {
  id: string;
  type: 'performance' | 'support-group' | 'completion' | 'concept';
  title: string;
  description: string;
  time: string;
  impact: 'positive' | 'warning' | 'neutral';
  linkTo?: string;
}

export interface LearningProgressItem {
  id: string;
  subject: string;
  grade: string;
  area: string;
  baselineScore: number;
  currentScore: number;
  change: number;
  improvingCount: number;
  supportCount: number;
  status: 'improving' | 'steady' | 'declining';
}

export const principalWeakStudents: WeakStudentItem[] = [
  {
    id: 's-jordan',
    name: 'Jordan Lee',
    avatar: 'JL',
    classId: 'c1',
    className: 'Algebra II - Period 3',
    grade: 'Grade 10',
    teacherName: 'Sarah Mitchell',
    weakConcepts: [
      { concept: 'Vertex Form', score: 42 },
      { concept: 'Discriminant', score: 48 },
    ],
    affectedAssessmentsCount: 2,
    overallScore: 54,
    status: 'critical',
    lastAssessmentDate: 'Sep 4, 2025',
    interventionAssigned: 'Small-group quadratic practice worksheets',
  },
  {
    id: 's-sam',
    name: 'Sam Rodriguez',
    avatar: 'SR',
    classId: 'c1',
    className: 'Algebra II - Period 3',
    grade: 'Grade 10',
    teacherName: 'Sarah Mitchell',
    weakConcepts: [
      { concept: 'Vertex Form', score: 45 },
    ],
    affectedAssessmentsCount: 1,
    overallScore: 61,
    status: 'improving',
    lastAssessmentDate: 'Sep 4, 2025',
    interventionAssigned: 'Peer tutoring from Pre-Calc student',
  },
  {
    id: 's-taylor',
    name: 'Taylor Kim',
    avatar: 'TK',
    classId: 'c1',
    className: 'Algebra II - Period 3',
    grade: 'Grade 10',
    teacherName: 'Sarah Mitchell',
    weakConcepts: [
      { concept: 'Completing the Square', score: 46 },
      { concept: 'Discriminant', score: 40 },
    ],
    affectedAssessmentsCount: 2,
    overallScore: 52,
    status: 'critical',
    lastAssessmentDate: 'Sep 4, 2025',
    interventionAssigned: 'Small-group quadratic practice worksheets',
  },
  {
    id: 's-casey',
    name: 'Casey Nguyen',
    avatar: 'CN',
    classId: 'c2',
    className: 'Geometry - Period 5',
    grade: 'Grade 9',
    teacherName: 'Sarah Mitchell',
    weakConcepts: [
      { concept: 'HL Theorem', score: 44 },
    ],
    affectedAssessmentsCount: 1,
    overallScore: 58,
    status: 'needs-attention',
    lastAssessmentDate: 'Sep 2, 2025',
    interventionAssigned: 'Visual comparison chart review',
  },
  {
    id: 's-riley',
    name: 'Riley Johnson',
    avatar: 'RJ',
    classId: 'c2',
    className: 'Geometry - Period 5',
    grade: 'Grade 9',
    teacherName: 'Sarah Mitchell',
    weakConcepts: [
      { concept: 'HL Theorem', score: 48 },
      { concept: 'CPCTC', score: 46 },
    ],
    affectedAssessmentsCount: 2,
    overallScore: 55,
    status: 'needs-attention',
    lastAssessmentDate: 'Sep 2, 2025',
    interventionAssigned: 'Visual comparison chart review',
  },
  {
    id: 's-drew',
    name: 'Drew Thompson',
    avatar: 'DT',
    classId: 'c5',
    className: 'Algebra I - Period 2',
    grade: 'Grade 9',
    teacherName: 'Emily Rodriguez',
    weakConcepts: [
      { concept: 'Linear Inequalities', score: 38 },
      { concept: 'Slope-Intercept Form', score: 45 },
    ],
    affectedAssessmentsCount: 2,
    overallScore: 46,
    status: 'critical',
    lastAssessmentDate: 'Sep 3, 2025',
    interventionAssigned: 'Co-teaching support sessions',
  },
  {
    id: 's-quinn',
    name: 'Quinn Davis',
    avatar: 'QD',
    classId: 'c5',
    className: 'Algebra I - Period 2',
    grade: 'Grade 9',
    teacherName: 'Emily Rodriguez',
    weakConcepts: [
      { concept: 'Graphing Systems', score: 42 },
    ],
    affectedAssessmentsCount: 1,
    overallScore: 58,
    status: 'needs-attention',
    lastAssessmentDate: 'Sep 3, 2025',
  },
  {
    id: 's-avery',
    name: 'Avery Martinez',
    avatar: 'AM',
    classId: 'c5',
    className: 'Algebra I - Period 2',
    grade: 'Grade 9',
    teacherName: 'Emily Rodriguez',
    weakConcepts: [
      { concept: 'Distributive Property', score: 40 },
      { concept: 'Factoring Trinomials', score: 46 },
    ],
    affectedAssessmentsCount: 2,
    overallScore: 50,
    status: 'critical',
    lastAssessmentDate: 'Sep 3, 2025',
  },
  {
    id: 's-reese',
    name: 'Reese Wilson',
    avatar: 'RW',
    classId: 'c5',
    className: 'Algebra I - Period 2',
    grade: 'Grade 9',
    teacherName: 'Emily Rodriguez',
    weakConcepts: [
      { concept: 'One-Step Equations', score: 48 },
    ],
    affectedAssessmentsCount: 1,
    overallScore: 62,
    status: 'improving',
    lastAssessmentDate: 'Sep 3, 2025',
  },
  {
    id: 's-skylar',
    name: 'Skylar Brown',
    avatar: 'SB',
    classId: 'c2',
    className: 'Geometry - Period 5',
    grade: 'Grade 9',
    teacherName: 'Sarah Mitchell',
    weakConcepts: [
      { concept: 'Angle Bisectors', score: 44 },
    ],
    affectedAssessmentsCount: 1,
    overallScore: 60,
    status: 'needs-attention',
    lastAssessmentDate: 'Sep 2, 2025',
  },
  {
    id: 's-jamie',
    name: 'Jamie Garcia',
    avatar: 'JG',
    classId: 'c1',
    className: 'Algebra II - Period 3',
    grade: 'Grade 10',
    teacherName: 'Sarah Mitchell',
    weakConcepts: [
      { concept: 'Synthetic Division', score: 46 },
    ],
    affectedAssessmentsCount: 1,
    overallScore: 63,
    status: 'needs-attention',
    lastAssessmentDate: 'Sep 4, 2025',
  },
  {
    id: 's-morgan',
    name: 'Morgan Walsh',
    avatar: 'MW',
    classId: 'c5',
    className: 'Algebra I - Period 2',
    grade: 'Grade 9',
    teacherName: 'Emily Rodriguez',
    weakConcepts: [
      { concept: 'Solving for X', score: 42 },
      { concept: 'Word Problems', score: 36 },
    ],
    affectedAssessmentsCount: 2,
    overallScore: 44,
    status: 'critical',
    lastAssessmentDate: 'Sep 3, 2025',
  },
  {
    id: 's-phoenix',
    name: 'Phoenix Anderson',
    avatar: 'PA',
    classId: 'c2',
    className: 'Geometry - Period 5',
    grade: 'Grade 9',
    teacherName: 'Sarah Mitchell',
    weakConcepts: [
      { concept: 'Inscribed Angles', score: 45 },
    ],
    affectedAssessmentsCount: 1,
    overallScore: 64,
    status: 'improving',
    lastAssessmentDate: 'Sep 2, 2025',
  },
  {
    id: 's-sage',
    name: 'Sage O\'Connor',
    avatar: 'SO',
    classId: 'c5',
    className: 'Algebra I - Period 2',
    grade: 'Grade 9',
    teacherName: 'Emily Rodriguez',
    weakConcepts: [
      { concept: 'Rational Numbers', score: 44 },
    ],
    affectedAssessmentsCount: 1,
    overallScore: 59,
    status: 'needs-attention',
    lastAssessmentDate: 'Sep 3, 2025',
  },
];

export const principalInterventions: InterventionItem[] = [
  {
    id: 'int-1',
    problem: '14 students identified with concept gaps below 50% across Algebra I & Geometry',
    targetType: 'student',
    targetName: 'Grade 9 Support Cohort (8 students)',
    action: 'Initiated structured small-group peer tutoring paired with Grade 11 Pre-Calculus students twice weekly.',
    responsibleTeacher: 'Emily Rodriguez & Sarah Mitchell',
    status: 'in-progress',
    startDate: 'Sep 12, 2025',
    outcome: 'Early progress check showed +8% gain in geometry definitions; Algebra I review in progress.',
    measurableChange: '+8% on definition check',
  },
  {
    id: 'int-2',
    problem: 'Vertex Form & Completing the Square persistent gaps in Algebra II - Period 3',
    targetType: 'concept',
    targetName: 'Algebra II (Jordan Lee, Taylor Kim, Sam Rodriguez)',
    action: 'Provided visual conversion reference guides and 5-question targeted adaptive practice quizzes.',
    responsibleTeacher: 'Sarah Mitchell',
    status: 'in-progress',
    startDate: 'Sep 08, 2025',
    outcome: 'Sam Rodriguez resolved concept gap (82% on re-quiz); 2 students continuing practice set.',
    measurableChange: '1 of 3 students exited gap',
  },
  {
    id: 'int-3',
    problem: 'Algebra I - Period 2 overall average score (68%) below school benchmark threshold (70%)',
    targetType: 'class',
    targetName: 'Algebra I - Period 2',
    action: 'Implemented bi-weekly curriculum pacing alignment and scaffolded formative check-ins.',
    responsibleTeacher: 'Emily Rodriguez',
    status: 'in-progress',
    startDate: 'Sep 05, 2025',
    outcome: 'Assessment completion improved from 79% to 88%; next comprehensive assessment scheduled.',
    measurableChange: '+9% completion rate',
  },
  {
    id: 'int-4',
    problem: 'Triangle Congruence SSS/SAS theorem confusion in Geometry - Period 5',
    targetType: 'concept',
    targetName: 'Geometry - Period 5',
    action: 'Conducted hands-on geometric proof workshop with visual color-coded angle overlays.',
    responsibleTeacher: 'Sarah Mitchell',
    status: 'completed',
    startDate: 'Aug 26, 2025',
    outcome: 'Class pass rate increased from 71% to 79% (+8% net gain); 3 students exited support group.',
    measurableChange: '+8% class pass rate',
  },
  {
    id: 'int-5',
    problem: 'Synthetic Division learning gaps in Grade 10 Polynomials unit',
    targetType: 'concept',
    targetName: 'Algebra II - Period 3',
    action: 'Assigned step-by-step video reinforcement and interactive division algorithm practice.',
    responsibleTeacher: 'Sarah Mitchell',
    status: 'completed',
    startDate: 'Aug 20, 2025',
    outcome: 'All participating students completed re-assessment with 84% average mastery score.',
    measurableChange: '84% re-assessment score',
  },
];

export const principalImportantUpdates: ImportantUpdateItem[] = [
  {
    id: 'up-1',
    type: 'performance',
    title: 'Pre-Calculus average score improved by +5%',
    description: 'Class average rose to 85% on the Limits & Continuity exam, leading the school in concept mastery.',
    time: 'Yesterday',
    impact: 'positive',
    linkTo: '/principal/classes',
  },
  {
    id: 'up-2',
    type: 'support-group',
    title: '3 students exited the support group',
    description: 'Students in Geometry - Period 5 achieved >= 80% on Triangle Congruence and successfully cleared learning gaps.',
    time: '2 days ago',
    impact: 'positive',
    linkTo: '/principal/weak-students',
  },
  {
    id: 'up-3',
    type: 'completion',
    title: 'Algebra II - Period 3 reached 100% completion',
    description: 'All 28 students submitted Quadratic Equations Mastery assessment within the scheduled deadline.',
    time: '3 days ago',
    impact: 'positive',
    linkTo: '/principal/assessments',
  },
  {
    id: 'up-4',
    type: 'concept',
    title: 'Synthetic Division flagged as persistent gap',
    description: '12 students scored below 60% across 2 assessments; review intervention recommended.',
    time: '4 days ago',
    impact: 'warning',
    linkTo: '/principal/insights',
  },
];

export const principalLearningProgress: LearningProgressItem[] = [
  {
    id: 'lp-1',
    subject: 'Mathematics',
    grade: 'Grade 11',
    area: 'Pre-Calculus - Limits & Continuity',
    baselineScore: 78,
    currentScore: 85,
    change: 7,
    improvingCount: 19,
    supportCount: 2,
    status: 'improving',
  },
  {
    id: 'lp-2',
    subject: 'Mathematics',
    grade: 'Grade 9',
    area: 'Geometry - Triangle Congruence',
    baselineScore: 68,
    currentScore: 74,
    change: 6,
    improvingCount: 22,
    supportCount: 4,
    status: 'improving',
  },
  {
    id: 'lp-3',
    subject: 'Mathematics',
    grade: 'Grade 10',
    area: 'Algebra II - Quadratics & Polynomials',
    baselineScore: 76,
    currentScore: 78,
    change: 2,
    improvingCount: 18,
    supportCount: 4,
    status: 'steady',
  },
  {
    id: 'lp-4',
    subject: 'Mathematics',
    grade: 'Grade 9',
    area: 'Algebra I - Linear Equations & Inequalities',
    baselineScore: 70,
    currentScore: 68,
    change: -2,
    improvingCount: 12,
    supportCount: 6,
    status: 'declining',
  },
];
