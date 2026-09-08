import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';

import { TeacherDashboard } from '@/pages/teacher/TeacherDashboard';
import { TeacherClasses } from '@/pages/teacher/TeacherClasses';
import { ClassDetail } from '@/pages/teacher/ClassDetail';
import { TeacherMaterials } from '@/pages/teacher/TeacherMaterials';
import { TeacherAssessments } from '@/pages/teacher/TeacherAssessments';
import { AssessmentCreate } from '@/pages/teacher/AssessmentCreate';
import { AssessmentDetail } from '@/pages/teacher/AssessmentDetail';
import { TeacherResults } from '@/pages/teacher/TeacherResults';
import { StudentResultDetail } from '@/pages/teacher/StudentResultDetail';
import { TeacherInsights } from '@/pages/teacher/TeacherInsights';

import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { StudentClasses } from '@/pages/student/StudentClasses';
import { StudentAssessments } from '@/pages/student/StudentAssessments';
import { AssessmentTake } from '@/pages/student/AssessmentTake';
import { StudentResults } from '@/pages/student/StudentResults';
import { StudentPractice } from '@/pages/student/StudentPractice';

import { PrincipalDashboard } from '@/pages/principal/PrincipalDashboard';
import { PrincipalClasses } from '@/pages/principal/PrincipalClasses';
import { PrincipalTeachers } from '@/pages/principal/PrincipalTeachers';
import { PrincipalAssessments } from '@/pages/principal/PrincipalAssessments';
import { PrincipalInsights } from '@/pages/principal/PrincipalInsights';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />

          <Route element={<AppShell />}>
            {/* Teacher routes */}
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/classes" element={<TeacherClasses />} />
            <Route path="/teacher/classes/:classId" element={<ClassDetail />} />
            <Route path="/teacher/materials" element={<TeacherMaterials />} />
            <Route path="/teacher/assessments" element={<TeacherAssessments />} />
            <Route path="/teacher/assessments/create" element={<AssessmentCreate />} />
            <Route path="/teacher/assessments/:assessmentId" element={<AssessmentDetail />} />
            <Route path="/teacher/results" element={<TeacherResults />} />
            <Route path="/teacher/results/:studentId" element={<StudentResultDetail />} />
            <Route path="/teacher/insights" element={<TeacherInsights />} />

            {/* Student routes */}
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/classes" element={<StudentClasses />} />
            <Route path="/student/assessments" element={<StudentAssessments />} />
            <Route path="/student/assessments/:assessmentId" element={<AssessmentTake />} />
            <Route path="/student/results" element={<StudentResults />} />
            <Route path="/student/results/:assessmentId" element={<StudentResults />} />
            <Route path="/student/practice" element={<StudentPractice />} />

            {/* Principal routes */}
            <Route path="/principal" element={<PrincipalDashboard />} />
            <Route path="/principal/classes" element={<PrincipalClasses />} />
            <Route path="/principal/teachers" element={<PrincipalTeachers />} />
            <Route path="/principal/assessments" element={<PrincipalAssessments />} />
            <Route path="/principal/insights" element={<PrincipalInsights />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
