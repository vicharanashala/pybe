import React from 'react';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { WelcomeView } from './views/WelcomeView';
import { TopicSelectionView } from './views/TopicSelectionView';
import { StoryView } from './views/StoryView';
import { ReflectionView } from './views/ReflectionView';
import { StoryIntroView } from './views/StoryIntroView';
import { ChallengeView } from './views/ChallengeView';
import { BridgeView } from './views/BridgeView';
import { LessonView } from './views/LessonView';
import { PlaygroundView } from './views/PlaygroundView';
import { StoryCompletionView } from './views/StoryCompletionView';
import { StoryActivityView } from './views/StoryActivityView';
import { ConceptGuideView } from './views/ConceptGuideView';
import { DashboardView } from './views/DashboardView';
import { AIMentorView } from './views/AIMentorView';
import { UserDashboard } from './views/UserDashboard';
import { ProgressTracker } from './components/Ornaments';

function App() {
  const { currentStep } = useProgress();
  const [pathname, setPathname] = React.useState(window.location.pathname);

  React.useEffect(() => {
    const onRouteChange = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onRouteChange);
    window.addEventListener('pybe-route-change', onRouteChange);
    return () => {
      window.removeEventListener('popstate', onRouteChange);
      window.removeEventListener('pybe-route-change', onRouteChange);
    };
  }, []);

  const isDashboard = pathname === '/dashboard';

  if (isDashboard) {
    return (
      <div className="w-full min-h-screen bg-[var(--bg-primary)]">
        <UserDashboard />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeView />;
      case 1:
        return <TopicSelectionView />;
      case 2:
        return <StoryIntroView />;
      case 3:
        return <StoryView />;
      case 4:
        return <StoryView />;
      case 5:
        return <StoryActivityView />;
      case 6:
        return <ConceptGuideView />;
      case 7:
        return <BridgeView />;
      case 8:
        return <LessonView />;
      case 9:
        return <PlaygroundView />;
      case 10:
        return <ChallengeView />;
      case 11:
        return <ReflectionView />;
      case 12:
        return <AIMentorView />;
      case 13:
        return <StoryCompletionView />;
      case 14:
        return <DashboardView />;
      default:
        return <StoryCompletionView />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[var(--bg-primary)]">
      <ProgressTracker />
      <div className="w-full max-w-4xl mx-auto px-4 pb-24">
        {renderStep()}
      </div>
    </div>
  );
}

export default function Root() {
  return (
    <ProgressProvider>
      <App />
    </ProgressProvider>
  );
}
