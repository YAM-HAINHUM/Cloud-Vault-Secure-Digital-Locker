import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useChatStore } from '../../store/chatStore';
import { formatBytes } from '../../utils/format';
import {
  Bell,
  Search,
  MessageSquare,
  X,
  Check,
  Shield,
  Upload,
  AlertTriangle,
} from 'lucide-react';
import type { NotificationType } from '../../types';

const typeIcons: Record<NotificationType, string> = {
  upload: '📤',
  security: '🛡️',
  login: '🔑',
  share: '🔗',
  warning: '⚠️',
  info: 'ℹ️',
};

const typeColors: Record<NotificationType, string> = {
  upload: 'border-blue-500/30',
  security: 'border-red-500/30',
  login: 'border-green-500/30',
  share: 'border-purple-500/30',
  warning: 'border-yellow-500/30',
  info: 'border-slate-500/30',
};

export default function Header() {
  const { user } = useAuthStore();
  const { notifications, markAsRead, markAllRead, unreadCount } = useNotificationStore();
  const { toggleChat } = useChatStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const unread = unreadCount();

  return (
    <header className="sticky top-0 z-30 glass-strong h-16 flex items-center justify-between px-6 border-b border-indigo-500/10">
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search files, settings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="glass-input w-full pl-10 py-2.5 text-sm"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Storage indicator */}
        {user && (
          <div className="hidden md:flex items-center gap-2 mr-4">
            <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${Math.min((user.storageUsed / user.storageLimit) * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs text-slate-500">
              {formatBytes(user.storageUsed)} / {formatBytes(user.storageLimit)}
            </span>
          </div>
        )}

        {/* Chat toggle */}
        <button
          onClick={toggleChat}
          className="relative p-2.5 rounded-xl hover:bg-indigo-500/10 transition-colors"
          title="AI Assistant"
        >
          <MessageSquare className="w-5 h-5 text-slate-400" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl hover:bg-indigo-500/10 transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-400" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                {unread}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-96 glass-strong rounded-2xl shadow-2xl border border-indigo-500/20 overflow-hidden animate-slide-up">
              <div className="flex items-center justify-between p-4 border-b border-indigo-500/10">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <div className="flex gap-2">
                  {unread > 0 && (
                    <button onClick={markAllRead} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                  <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-slate-700/50 rounded-lg">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-4 border-b border-slate-800/50 cursor-pointer hover:bg-slate-800/30 transition-colors ${
                        !n.read ? 'bg-indigo-500/5' : ''
                      } ${typeColors[n.type]}`}
                    >
                      <div className="flex gap-3">
                        <span className="text-lg">{typeIcons[n.type]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">{n.message}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        {user && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white cursor-pointer hover:scale-105 transition-transform">
            {user.name.charAt(0)}
          </div>
        )}
      </div>
    </header>
  );
}
