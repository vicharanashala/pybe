import { useNavigate } from 'react-router-dom';
import { Map, Compass, Check } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

export default function ModeSelectionPage() {
  const navigate = useNavigate();

  const handleModeSelect = (mode) => {
    // In a real app we'd save this
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Choose Your Learning Experience</h1>
          <p className="text-lg text-gray-500">Pick the path that fits your learning style best.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Guided Journey */}
          <button
            onClick={() => handleModeSelect('guided')}
            className="text-left p-10 rounded-[2.5rem] bg-white border-2 border-gray-100 hover:border-brand-500 hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-500 mb-8 group-hover:scale-110 transition-transform">
              <Map size={36} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Guided Journey</h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-600">
                <span className="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center mr-3"><Check size={12} /></span>
                Structured learning path
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center mr-3"><Check size={12} /></span>
                Topics unlock sequentially
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center mr-3"><Check size={12} /></span>
                Progress-based learning
              </li>
            </ul>
            <div className="btn-primary w-full py-4 text-lg">
              Start Journey
            </div>
          </button>

          {/* Explore Freely */}
          <button
            onClick={() => handleModeSelect('explore')}
            className="text-left p-10 rounded-[2.5rem] bg-white border-2 border-gray-100 hover:border-brand-500 hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="w-20 h-20 bg-cyan-50 rounded-3xl flex items-center justify-center text-cyan-500 mb-8 group-hover:scale-110 transition-transform">
              <Compass size={36} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Freely</h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-600">
                <span className="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center mr-3"><Check size={12} /></span>
                Access any topic anytime
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center mr-3"><Check size={12} /></span>
                Learn in any order
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center mr-3"><Check size={12} /></span>
                Flexible exploration
              </li>
            </ul>
            <div className="btn-secondary w-full py-4 text-lg border-gray-200">
              Start Exploring
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
