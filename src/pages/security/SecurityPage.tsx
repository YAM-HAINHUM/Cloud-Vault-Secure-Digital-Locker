import { useState } from 'react';
import { mockSecurityAlerts, mockAccessLogs } from '../../services/mockData';
import { formatDate, formatFullDate, getRiskBg } from '../../utils/format';
import type { SecurityAlert } from '../../types';
import {
  Shield, ShieldCheck, ShieldAlert, AlertTriangle, Eye, EyeOff,
  Lock, Unlock, Globe, Search, RefreshCw, Activity, Fingerprint,
  Terminal, FileWarning, Users, Clock, CheckCircle, XCircle,
  Wifi, WifiOff, Download,
} from 'lucide-react';

export default function SecurityPage() {
  const [alerts, setAlerts] = useState(mockSecurityAlerts);
  const [logs] = useState(mockAccessLogs);
  const [scanRunning, setScanRunning] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);

  const unresolvedAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  const handleScan = () => {
    setScanRunning(true);
    setTimeout(() => setScanRunning(false), 3000);
  };

  const securityScore = Math.max(0, 100 - (unresolvedAlerts.filter(a => a.severity === 'high').length * 25) - (unresolvedAlerts.filter(a => a.severity === 'medium').length * 10));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Security Center</h1>
          <p className="text-slate-500 mt-1">Monitor and manage your vault's security posture.</p>
        </div>
        <button onClick={handleScan} disabled={scanRunning} className="btn-primary flex items-center gap-2 text-sm">
          {scanRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          {scanRunning ? 'Scanning...' : 'Run Security Scan'}
        </button>
      </div>

      {/* Security Score & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Score */}
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 mb-4">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="10" />
              <circle cx="60" cy="60" r="50" fill="none"
                stroke={securityScore >= 80 ? '#22c55e' : securityScore >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${securityScore * 3.14} ${314 - securityScore * 3.14}`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{securityScore}</span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
          </div>
          <h3 className="font-semibold text-lg">
            {securityScore >= 80 ? '🟢 Good' : securityScore >= 60 ? '🟡 Needs Attention' : '🔴 Critical'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">Security Health Score</p>
        </div>

        {/* Security Features */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Security Features</h3>
          {[
            { label: 'Two-Factor Auth', enabled: twoFactor, toggle: () => setTwoFactor(!twoFactor), icon: Fingerprint, desc: 'Require 2FA for all logins' },
            { label: 'IP Whitelisting', enabled: ipWhitelist, toggle: () => setIpWhitelist(!ipWhitelist), icon: Globe, desc: 'Restrict access by IP range' },
            { label: 'AES-256 Encryption', enabled: encryptionEnabled, toggle: () => setEncryptionEnabled(!encryptionEnabled), icon: Lock, desc: 'End-to-end file encryption' },
          ].map((feature) => (
            <div key={feature.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center gap-3">
                <feature.icon className={`w-5 h-5 ${feature.enabled ? 'text-indigo-400' : 'text-slate-600'}`} />
                <div>
                  <p className="text-sm font-medium">{feature.label}</p>
                  <p className="text-xs text-slate-600">{feature.desc}</p>
                </div>
              </div>
              <button
                onClick={feature.toggle}
                className={`w-12 h-6 rounded-full transition-colors relative ${feature.enabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${feature.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Quick Stats</h3>
          {[
            { label: 'Total Alerts', value: alerts.length, icon: ShieldAlert, color: 'text-red-400' },
            { label: 'Blocked Logins', value: logs.filter(l => l.status === 'blocked').length, icon: XCircle, color: 'text-orange-400' },
            { label: 'Successful Logins', value: logs.filter(l => l.status === 'success').length, icon: CheckCircle, color: 'text-green-400' },
            { label: 'Files Scanned', value: '35/35', icon: FileWarning, color: 'text-blue-400' },
            { label: 'Active Sessions', value: '2', icon: Users, color: 'text-purple-400' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-sm text-slate-400">{stat.label}</span>
              </div>
              <span className="text-sm font-semibold">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Alerts */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Active Alerts ({unresolvedAlerts.length})
          </h3>
        </div>
        {unresolvedAlerts.length === 0 ? (
          <div className="text-center py-8">
            <ShieldCheck className="w-12 h-12 text-green-500/50 mx-auto mb-3" />
            <p className="text-slate-500">No active security alerts. Your vault is secure!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unresolvedAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-xl border ${
                alert.severity === 'high' ? 'bg-red-500/5 border-red-500/20' :
                alert.severity === 'medium' ? 'bg-yellow-500/5 border-yellow-500/20' :
                'bg-blue-500/5 border-blue-500/20'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      alert.severity === 'high' ? 'bg-red-500/20' :
                      alert.severity === 'medium' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                    }`}>
                      <ShieldAlert className={`w-4 h-4 ${
                        alert.severity === 'high' ? 'text-red-400' :
                        alert.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{alert.type}</p>
                        <span className={`badge ${getRiskBg(alert.severity)}`}>{alert.severity}</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-0.5">{alert.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(alert.timestamp)}</span>
                        {alert.filename && <span>📎 {alert.filename}</span>}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 flex-shrink-0"
                  >
                    <CheckCircle className="w-3 h-3" /> Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolved Alerts */}
      {resolvedAlerts.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            Resolved ({resolvedAlerts.length})
          </h3>
          <div className="space-y-2">
            {resolvedAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/20 border border-slate-700/20 opacity-60">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm">{alert.type} — {alert.message}</p>
                </div>
                <span className="text-xs text-slate-600">{formatDate(alert.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Access Logs */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Access Logs
          </h3>
          <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
            <Download className="w-3 h-3" /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-3">User</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-3">Action</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-3">Resource</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-3">IP Address</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-3">Time</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                  <td className="p-3 text-sm">{log.userName}</td>
                  <td className="p-3 text-sm text-slate-400">{log.action}</td>
                  <td className="p-3 text-sm text-slate-400 truncate max-w-[200px]">{log.resource}</td>
                  <td className="p-3 text-sm font-mono text-slate-500">{log.ip}</td>
                  <td className="p-3 text-sm text-slate-500">{formatDate(log.timestamp)}</td>
                  <td className="p-3">
                    <span className={`badge text-[10px] ${
                      log.status === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-400' :
                      log.status === 'blocked' ? 'bg-red-500/20 border-red-500/30 text-red-400' :
                      'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
