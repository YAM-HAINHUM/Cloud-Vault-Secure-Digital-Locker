import { useState } from 'react';
import { mockAnalytics, mockShareLinks } from '../../services/mockData';
import { formatBytes, formatDate } from '../../utils/format';
import {
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import {
  BarChart3, Download, FileText, HardDrive, TrendingUp, Users, Share2,
  Shield, Calendar, RefreshCw,
} from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong p-3 rounded-xl border border-indigo-500/20 text-sm">
      <p className="font-medium text-slate-300">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.value > 1000 ? formatBytes(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const { uploadsOverTime, fileTypeDistribution, storagePerUser, totalFiles, totalStorage, totalUsers, totalShares } = mockAnalytics;

  const handleGenerateReport = () => {
    alert('📊 PDF report generation would be triggered here. In production, this connects to a PDF generation service.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1">Comprehensive insights into your cloud storage usage.</p>
        </div>
        <div className="flex gap-2">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="glass-input py-2 text-sm">
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button onClick={handleGenerateReport} className="btn-primary flex items-center gap-2 text-sm py-2.5">
            <Download className="w-4 h-4" /> Generate Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Files', value: totalFiles, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Total Storage', value: formatBytes(totalStorage), icon: HardDrive, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Active Shares', value: totalShares, icon: Share2, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map((item) => (
          <div key={item.label} className="glass-card p-5">
            <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uploads Over Time - Area Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Upload Activity</h3>
              <p className="text-sm text-slate-500">Files uploaded over time</p>
            </div>
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={uploadsOverTime}>
              <defs>
                <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="uploads" stroke="#6366f1" fill="url(#uploadGradient)" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* File Type Distribution - Pie Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">File Types</h3>
              <p className="text-sm text-slate-500">Distribution by category</p>
            </div>
            <BarChart3 className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={250}>
              <PieChart>
                <Pie data={fileTypeDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="count" paddingAngle={3} strokeWidth={0}>
                  {fileTypeDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {fileTypeDistribution.map((type) => (
                <div key={type.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                    <span className="text-sm text-slate-400">{type.type}</span>
                  </div>
                  <span className="text-sm font-medium">{type.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Per User - Bar Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Storage Per User</h3>
              <p className="text-sm text-slate-500">Usage breakdown by team member</p>
            </div>
            <HardDrive className="w-5 h-5 text-indigo-400" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={storagePerUser.map(s => ({ ...s, name: s.user.split(' ')[0], usage: s.used / (1024 * 1024 * 1024) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="usage" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active Share Links */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Active Shares</h3>
              <p className="text-sm text-slate-500">Currently shared files</p>
            </div>
            <Share2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-3">
            {mockShareLinks.map((share) => (
              <div key={share.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{share.filename}</p>
                  <p className="text-xs text-slate-500">{share.permission === 'view' ? '👁️ View' : '✏️ Edit'} • Expires {formatDate(share.expiresAt)}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-sm font-medium">{share.accessCount}</p>
                  <p className="text-xs text-slate-500">accesses</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Trend Line Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">Upload Trend Analysis</h3>
            <p className="text-sm text-slate-500">7-day vs 30-day comparison</p>
          </div>
          <Calendar className="w-5 h-5 text-indigo-400" />
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={uploadsOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="uploads" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
