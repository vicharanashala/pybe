import React, { useEffect } from "react";
import { MemoryRouter, useLocation } from "react-router-dom";
import AuthoredStory from "./AuthoredStory.jsx";
function CompletionRoute({ path, onComplete }) {
  const location = useLocation();
  useEffect(() => {
    if (path && location.pathname === path) onComplete?.();
  }, [path, location.pathname, onComplete]);
  return null;
}
// Preserve an authored app's internal route sequence inside the current study.
// Internal links cannot replace PyBe's document URL or open a separate app.
export default function AuthoredRouterStory({
  children,
  completionPath,
  onComplete,
  ...surface
}) {
  return (
    <AuthoredStory {...surface}>
      <MemoryRouter>
        <CompletionRoute path={completionPath} onComplete={onComplete} />
        {children}
      </MemoryRouter>
    </AuthoredStory>
  );
}
