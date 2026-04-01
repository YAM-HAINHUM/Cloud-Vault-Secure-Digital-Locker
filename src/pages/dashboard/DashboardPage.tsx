import { useAuthStore } from '../../store/authStore';
import { useFileStore } from '../../store/fileStore';
import { mockAnalytics, mockSecurityAlerts, mockAccessLogs } from '../../services/mockData';
import { formatBytes, formatDate, getRiskBg } from '../../utils/format';
import {
  Cloud,
  HardDrive,
  Upload,
  Share2,
  Shield,
  AlertTriangle,
  TrendingUp,
  Users,
  FileText,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { files } = useFileStore();
  const navigate = useNavigate();
  const storagePercent = user ? Math.round((user.storageUsed / user.storageLimit) * 100) : 0;
  const recentFiles = files.slice(0, 5);
  const recentAlerts = mockSecurityAlerts.filter(a => !a.resolved).slice(0, 3);
  const recentLogs = mockAccessLogs.slice(0, 5);

  const statCards = [
    { label: 'Total Files', value: mockAnalytics.totalFiles.toString(), icon: FileText, color: 'from-blue-500 to-cyan-500', change: '+12%' },
    { label: 'Storage Used', value: formatBytes(mockAnalytics.totalStorage), icon: HardDrive, color: 'from-purple-500 to-pink-500', change: `${storagePercent}%` },
    { label: 'Active Users', value: mockAnalytics.totalUsers.toString(), icon: Users, color: 'from-green-500 to-emerald-500', change: '+3' },
    { label: 'Shared Files', value: mockAnalytics.totalShares.toString(), icon: Share2, color: 'from-orange-500 to-amber-500', change: '+5' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'User'}</h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your cloud vault today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass-card p-5 group cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-green-400">
              <TrendingUp className="w-3 h-3" />
              <span>{stat.change} from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Storage Usage */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Storage Usage</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="12" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="url(#gradient)" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${storagePercent * 3.14} ${314 - storagePercent * 3.14}`} />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{storagePercent}%</span>
                <span className="text-xs text-slate-500">Used</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Documents', size: 1_500_000_000, color: 'bg-blue-500' },
              { label: 'Images', size: 1_200_000_000, color: 'bg-purple-500' },
              { label: 'Videos', size: 800_000_000, color: 'bg-pink-500' },
              { label: 'Other', size: 700_000_000, color: 'bg-slate-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-slate-400">{item.label}</span>
                </div>
                <span className="text-slate-300">{formatBytes(item.size)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Files */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent Files</h3>
            <button onClick={() => navigate('/files')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/30 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-lg">
                  {file.type === 'PDF' ? '📄' : file.type === 'PNG' || file.type === 'JPG' ? '🖼️' : file.type === 'DOCX' ? '📝' : '📁'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.originalName}</p>
                  <p className="text-xs text-slate-500">{formatBytes(file.size)} • {formatDate(file.uploadDate)}</p>
                </div>
                <span className={`badge ${getRiskBg(file.riskScore)}`}>{file.riskScore}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Alerts */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Security Alerts</h3>
            <button onClick={() => navigate('/security')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          {recentAlerts.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-green-500/50 mx-auto mb-3" />
              <p className="text-sm text-slate-500">All clear! No security threats detected.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${alert.severity === 'high' ? 'text-red-400' : 'text-yellow-400'}`} />
                    <div>
                      <p className="text-sm font-medium">{alert.type}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent Activity */}
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-3">Activity Log</h3>
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-2 text-xs">
                <Clock className="w-3 h-3 text-slate-600" />
                <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-green-500' : log.status === 'blocked' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                <span className="text-slate-400 flex-1 truncate">{log.userName} — {log.action}</span>
                <span className="text-slate-600">{formatDate(log.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
