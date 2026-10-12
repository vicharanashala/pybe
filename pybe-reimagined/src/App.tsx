import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './ui/LandingPage.js';
import { CasesIndex } from './ui/CasesIndex.tsx';
import { CaseStudyPlayer } from './ui/CaseStudyPlayer.tsx';
import { Dashboard } from './ui/Dashboard.tsx';
import { Onboarding } from './ui/Onboarding.tsx';
import { ConceptGraphPage } from './ui/ConceptGraphPage.tsx';
import { DraftCasesPage } from './admin/DraftCasesPage.tsx';
import { WeeklyReview } from './ui/WeeklyReview.tsx';
import { LevelCrossingToast } from './ui/LevelCrossingToast.tsx';
import { LearnerProvider, useLearner } from './state/LearnerContext.tsx';
import { ThemeProvider } from './state/ThemeContext.tsx';

function FirstRunGuard({ children }: { children: React.ReactNode }) {
  const { learner } = useLearner();
  const location = useLocation();

  if (
    location.pathname === '/onboarding' ||
    location.pathname.startsWith('/assets')
  ) {
    return <>{children}</>;
  }

  if (!learner.hasOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

function SyncOnboardingIntoDom(): null {
  // Reserved for future client-side sanity checks. Currently no-op.
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <LearnerProvider>
        <SyncOnboardingIntoDom />
        <FirstRunGuard>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/cases" element={<CasesIndex />} />
            <Route path="/learn/:caseStudyId" element={<CaseStudyPlayer />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/concept-graph" element={<ConceptGraphPage />} />
            <Route path="/admin/draft-cases" element={<DraftCasesPage />} />
            <Route path="/weekly-review" element={<WeeklyReview />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route
              path="*"
              element={
                <main className="mx-auto max-w-md px-6 py-16 text-center">
                  <h1 className="mb-3 text-3xl font-bold text-stone-900 dark:text-stone-100">404</h1>
                  <p className="mb-6 text-stone-600 dark:text-stone-400">That route does not exist yet.</p>
                  <Link to="/" className="pybe-btn-primary inline-flex">
                    Back to home
                  </Link>
                </main>
              }
            />
          </Routes>
        </FirstRunGuard>
        <LevelCrossingToast />
      </LearnerProvider>
    </ThemeProvider>
  );
}