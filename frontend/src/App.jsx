import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConceptProvider, useActiveConcept } from './context/ConceptContext';
import ThemeSync from './context/ThemeSync';
import TopicChatBot from './components/chat/TopicChatBot';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import ModeSelectionPage from './pages/ModeSelectionPage';
import DashboardPage from './pages/DashboardPage';
import ModulesPage from './pages/ModulesPage';
import NotesPage from './pages/NotesPage';
import ConceptPage from './pages/ConceptPage';
import NotFoundPage from './pages/NotFoundPage';

import PracticeTopicsPage from './practice/pages/TopicsPage';
import PracticeTopicProblemsPage from './practice/pages/TopicProblemsPage';
import PracticeProblemWorkspace from './practice/pages/ProblemWorkspace';

import AdminLayout from './pages/admin/AdminLayout';
import AdminQuestionsPage from './pages/admin/AdminQuestionsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminLogsPage from './pages/admin/AdminLogsPage';
import AdminFeedbackPage from './pages/admin/AdminFeedbackPage';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (!user.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return children;
}

function OnboardingRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.onboardingComplete) return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user && user.onboardingComplete) return <Navigate to="/dashboard" replace />;
  if (user && !user.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/admin" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/onboarding" element={<OnboardingRoute><OnboardingPage /></OnboardingRoute>} />
      <Route path="/mode-selection" element={<ModeSelectionPage />} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/modules" element={<PrivateRoute><ModulesPage /></PrivateRoute>} />
      <Route path="/notes" element={<PrivateRoute><NotesPage /></PrivateRoute>} />
      <Route path="/concept/:id" element={<PrivateRoute><ConceptPage /></PrivateRoute>} />

      {/* Practice Questions */}
      <Route path="/practice" element={<PrivateRoute><PracticeTopicsPage /></PrivateRoute>} />
      <Route path="/practice/topic/:topic" element={<PrivateRoute><PracticeTopicProblemsPage /></PrivateRoute>} />
      <Route path="/practice/problem/:slug" element={<PrivateRoute><PracticeProblemWorkspace /></PrivateRoute>} />

      {/* Admin dashboard */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Navigate to="questions" replace />} />
        <Route path="questions" element={<AdminQuestionsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="logs" element={<AdminLogsPage />} />
        <Route path="feedback" element={<AdminFeedbackPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// Floating chatbot — learners only, and ONLY while actually viewing a
// module's lesson page (/concept/:id). It reads the active concept from
// context, but that context alone isn't enough to know the bot should
// disappear when the learner navigates away (e.g. back to the dashboard),
// so this also checks the current route directly.
function ChatBotLayer() {
  const { user } = useAuth();
  const { activeConcept } = useActiveConcept();
  const location = useLocation();
  const onModulePage = location.pathname.startsWith('/concept/');
  if (!user || user.role === 'admin' || !onModulePage) return null;
  return <TopicChatBot concept={activeConcept} />;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeSync />
      <ConceptProvider>
        <BrowserRouter>
          <AppRoutes />
          <ChatBotLayer />
        </BrowserRouter>
      </ConceptProvider>
    </AuthProvider>
  );
}
