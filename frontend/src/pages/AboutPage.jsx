import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">About PyBe</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
          PyBe is a Python learning platform that combines AI-guided Socratic discovery with step-by-step
          code visualization. We believe that understanding <em>why</em> something works is what separates
          programmers who can solve new problems from those who can only repeat what they've seen.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">The two-stage approach</h2>
        <div className="space-y-4 mb-10">
          <div className="card p-5">
            <h3 className="font-bold text-brand-600 dark:text-brand-400 mb-2">Stage 1 — Discovery Learning</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">An AI tutor guides you through questions before showing you anything. You arrive at the concept yourself. This is Socratic learning — proven to create deeper, longer-lasting understanding.</p>
          </div>
          <div className="card p-5">
            <h3 className="font-bold text-emerald-600 dark:text-emerald-400 mb-2">Stage 2 — Code Visualization</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">After you understand the concept, you write code and watch it execute line by line with live variable tracking. No black boxes.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/register" className="btn-primary">Get started free</Link>
          <Link to="/" className="btn-secondary">← Back home</Link>
        </div>
      </div>
    </div>
  );
}
