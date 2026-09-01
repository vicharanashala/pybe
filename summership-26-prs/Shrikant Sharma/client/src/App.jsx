import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import StorySelection from "./pages/StorySelection";
import StoryReader from "./pages/StoryReader";
import ThinkingChallenge from "./pages/ThinkingChallenge";
import SecretBehindStory from "./pages/SecretBehindStory";
import Practice from "./pages/Practice";
import Moral from "./pages/Moral";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/stories" element={<StorySelection />} />
        <Route path="/story/:id" element={<StoryReader />} />
        <Route path="/challenge/:id" element={<ThinkingChallenge />} />
        <Route path="/reveal/:id" element={<SecretBehindStory />} />
        <Route path="/practice/:id" element={<Practice />} />
        <Route path="/moral/:id" element={<Moral />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
