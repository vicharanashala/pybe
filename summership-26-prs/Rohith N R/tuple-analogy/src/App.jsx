import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TourProvider } from './context/TourContext';

// Components
import Sidebar from './components/Sidebar';
import BittuTourGlobal from './components/BittuTourGlobal';

// Pages
import Home from './pages/Home';
import Ordered from './pages/Ordered';
// import Immutable from './pages/Immutable';
import Heterogeneous from './pages/Heterogeneous';
import NestedMutable from './pages/NestedMutable';
import FinalTest from './pages/FinalTest'

export default function App() {
  return (
    <TourProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-sky-50 text-black font-sans selection:bg-black selection:text-white">
          <Sidebar />
          <main
            className="flex-1 p-12 overflow-y-auto relative bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/bg.png')" }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ordered" element={<Ordered />} />
              {/* <Route path="/immutable" element={<Immutable />} /> */}
              <Route path="/heterogeneous" element={<Heterogeneous />} />
              <Route path="/nested" element={<NestedMutable />} />
              <Route path="/finalTest" element={<FinalTest />} />
            </Routes>
          </main>
        </div>

        {/* The global tour component sits outside the main routes, but inside the Router and Provider */}
        <BittuTourGlobal />
      </BrowserRouter>
    </TourProvider>
  );
}