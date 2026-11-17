/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import PlaylistParadox from "./PlaylistParadox.jsx";

export default function App() {
  const handleExit = () => {
    // If running in a host application, onExit allows navigating away
    if (window.history.length > 1) {
      window.history.back();
    }
  };

  const handleComplete = (summary: unknown) => {
    console.log("Lesson completed summary:", summary);
  };

  return <PlaylistParadox onExit={handleExit} onComplete={handleComplete} />;
}
