import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Search } from 'lucide-react';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.get('/admin/logs', { params: { limit: 500 } })
      .then(res => setLogs(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter(l =>
    !query ||
    l.name?.toLowerCase().includes(query.toLowerCase()) ||
    l.email?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Login Logs</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Every sign-in, most recent first.</p>

      <div className="relative mb-5 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="input pl-9"
        />
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading logs...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No login activity yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <th className="py-3 pl-5 pr-4">Name</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Logged in at</th>
                <th className="py-3 pr-5">IP address</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log._id} className="border-b border-gray-50 dark:border-gray-900">
                  <td className="py-2.5 pl-5 pr-4 font-medium text-gray-800 dark:text-gray-200">{log.name}</td>
                  <td className="py-2.5 pr-4 text-gray-500">{log.email}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${log.role === 'admin' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                      {log.role}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-gray-500">{new Date(log.loginAt).toLocaleString()}</td>
                  <td className="py-2.5 pr-5 text-gray-400 font-mono text-xs">{log.ipAddress || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
