import { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, Legend,
} from 'recharts';
import { Users, BookOpenCheck, Activity, TrendingUp } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={17} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [conceptData, setConceptData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/analytics/summary'),
      api.get('/admin/analytics/concepts'),
      api.get('/admin/analytics/users'),
      api.get('/admin/analytics/activity', { params: { days: 30 } }),
    ]).then(([s, c, u, a]) => {
      setSummary(s.data);
      setConceptData(c.data);
      setUserData(u.data);
      setActivity(a.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-24 text-gray-400 text-sm">Loading analytics...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Analytics</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Progress, engagement, and speed across all learners.</p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Learners" value={summary.totalUsers} color="bg-brand-50 dark:bg-brand-900/20 text-brand-500" />
        <StatCard icon={BookOpenCheck} label="Modules completed" value={summary.totalCompletions} sub={`${summary.inProgressCount} in progress`} color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500" />
        <StatCard icon={Activity} label="Active (7 days)" value={summary.activeUsersLast7Days} color="bg-amber-50 dark:bg-amber-900/20 text-amber-500" />
        <StatCard icon={TrendingUp} label="Active (30 days)" value={summary.activeUsersLast30Days} color="bg-violet-50 dark:bg-violet-900/20 text-violet-500" />
      </div>

      {/* Per-module completion */}
      <div className="card p-5 mb-8">
        <h2 className="font-semibold text-sm text-gray-900 dark:text-white mb-4">Completion rate by module</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={conceptData} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="title" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 11 }} unit="%" />
            <Tooltip
              formatter={(value, name) => name === 'completionRate' ? [`${value}%`, 'Completion rate'] : [value, name]}
              labelStyle={{ fontWeight: 600 }}
            />
            <Bar dataKey="completionRate" fill="#4F46E5" radius={[6, 6, 0, 0]} name="Completion rate" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Activity over time */}
      <div className="card p-5 mb-8">
        <h2 className="font-semibold text-sm text-gray-900 dark:text-white mb-4">Engagement — last 30 days</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={activity} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={Math.ceil(activity.length / 10)} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip labelStyle={{ fontWeight: 600 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="activeUsers" name="Active users" stroke="#4F46E5" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="completions" name="Modules completed" stroke="#10B981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Per-module table (completion + avg speed) */}
      <div className="card p-5 mb-8 overflow-x-auto">
        <h2 className="font-semibold text-sm text-gray-900 dark:text-white mb-4">Module performance</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100 dark:border-gray-800">
              <th className="pb-2 pr-4">Module</th>
              <th className="pb-2 pr-4">Started</th>
              <th className="pb-2 pr-4">Completed</th>
              <th className="pb-2 pr-4">Completion rate</th>
              <th className="pb-2">Avg. time to complete</th>
            </tr>
          </thead>
          <tbody>
            {conceptData.map(c => (
              <tr key={c.conceptId} className="border-b border-gray-50 dark:border-gray-900">
                <td className="py-2.5 pr-4 font-medium text-gray-800 dark:text-gray-200">{c.icon} {c.title}</td>
                <td className="py-2.5 pr-4 text-gray-500">{c.learnersStarted}</td>
                <td className="py-2.5 pr-4 text-gray-500">{c.learnersCompleted}</td>
                <td className="py-2.5 pr-4 text-gray-500">{c.completionRate}%</td>
                <td className="py-2.5 text-gray-500">{c.avgTimeToCompleteMinutes !== null ? `${c.avgTimeToCompleteMinutes} min` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Per-user table */}
      <div className="card p-5 overflow-x-auto">
        <h2 className="font-semibold text-sm text-gray-900 dark:text-white mb-4">Learner progress</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100 dark:border-gray-800">
              <th className="pb-2 pr-4">Name</th>
              <th className="pb-2 pr-4">Email</th>
              <th className="pb-2 pr-4">Progress</th>
              <th className="pb-2 pr-4">Avg. speed</th>
              <th className="pb-2 pr-4">Logins</th>
              <th className="pb-2">Last active</th>
            </tr>
          </thead>
          <tbody>
            {userData.map(u => (
              <tr key={u.userId} className="border-b border-gray-50 dark:border-gray-900">
                <td className="py-2.5 pr-4 font-medium text-gray-800 dark:text-gray-200">{u.name}</td>
                <td className="py-2.5 pr-4 text-gray-500">{u.email}</td>
                <td className="py-2.5 pr-4 text-gray-500">
                  {u.conceptsCompleted}/{u.totalConcepts} <span className="text-gray-400">({u.completionRate}%)</span>
                </td>
                <td className="py-2.5 pr-4 text-gray-500">{u.avgTimeToCompleteMinutes !== null ? `${u.avgTimeToCompleteMinutes} min` : '—'}</td>
                <td className="py-2.5 pr-4 text-gray-500">{u.loginCount}</td>
                <td className="py-2.5 text-gray-500">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
