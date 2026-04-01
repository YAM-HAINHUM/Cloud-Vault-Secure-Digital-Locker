import { create } from 'zustand';
import type { Notification, NotificationType } from '../types';

interface NotificationStore {
  notifications: Notification[];
  addNotification: (type: NotificationType, title: string, message: string) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [
    {
      id: 'n1',
      type: 'upload',
      title: 'File Uploaded',
      message: 'Q4-Report-2025.pdf was uploaded successfully.',
      timestamp: '2026-03-31T14:30:00Z',
      read: false,
    },
    {
      id: 'n2',
      type: 'security',
      title: 'Security Alert',
      message: 'Suspicious login attempt detected from IP 192.168.1.45.',
      timestamp: '2026-03-31T13:15:00Z',
      read: false,
    },
    {
      id: 'n3',
      type: 'login',
      title: 'Login Successful',
      message: 'You logged in from Chrome on macOS.',
      timestamp: '2026-03-31T14:00:00Z',
      read: true,
    },
  ],

  addNotification: (type, title, message) => {
    const notification: Notification = {
      id: 'n_' + Math.random().toString(36).substr(2, 9),
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50),
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    }));
  },

  markAllRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },

  unreadCount: () => get().notifications.filter(n => !n.read).length,
}));
