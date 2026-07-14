import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Logo from '../components/layout/Logo';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <div className="flex items-center justify-center py-24 flex-col gap-4 text-center px-4">
        <Logo size={64} />
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">404</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          Looks like this page slithered away. Let's get you back on track.
        </p>
        <Link to="/" className="btn-primary mt-2">Back to home</Link>
      </div>
    </div>
  );
}
