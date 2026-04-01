import { create } from 'zustand';
import type { VaultFile, RiskScore, FileVersion } from '../types';
import { mockFiles } from '../services/mockData';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

interface FileStore {
  files: VaultFile[];
  selectedFile: VaultFile | null;
  isLoading: boolean;
  searchQuery: string;
  filterType: string;
  filterAccess: string;
  sortBy: string;
  uploadProgress: number;
  isUploading: boolean;
  setFiles: (files: VaultFile[]) => void;
  uploadFile: (file: File) => Promise<VaultFile>;
  deleteFile: (id: string) => Promise<void>;
  updateFile: (id: string, updates: Partial<VaultFile>) => Promise<void>;
  selectFile: (file: VaultFile | null) => void;
  setSearchQuery: (q: string) => void;
  setFilterType: (t: string) => void;
  setFilterAccess: (a: string) => void;
  setSortBy: (s: string) => void;
  restoreVersion: (fileId: string, versionId: string) => Promise<void>;
  generateShareLink: (fileId: string, permission: 'view' | 'edit') => string;
  toggleLegacy: (fileId: string) => Promise<void>;
  getFilteredFiles: () => VaultFile[];
}

let versionCounter = 100;

export const useFileStore = create<FileStore>((set, get) => ({
  files: mockFiles,
  selectedFile: null,
  isLoading: false,
  searchQuery: '',
  filterType: 'all',
  filterAccess: 'all',
  sortBy: 'date',
  uploadProgress: 0,
  isUploading: false,

  setFiles: (files) => set({ files }),

  uploadFile: async (file: File) => {
    set({ isUploading: true, uploadProgress: 0 });
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await delay(150);
      set({ uploadProgress: i });
    }

    const riskScore: RiskScore = Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low';

    const newFile: VaultFile = {
      id: 'file_' + Math.random().toString(36).substr(2, 9),
      filename: file.name.toLowerCase().replace(/\s+/g, '-'),
      originalName: file.name,
      size: file.size,
      type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
      mimeType: file.type,
      url: URL.createObjectURL(file),
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      owner: 'usr_1a2b3c4d',
      accessLevel: 'private',
      riskScore,
      versions: [{
        versionId: 'v_' + (++versionCounter),
        versionNumber: 1,
        size: file.size,
        url: URL.createObjectURL(file),
        createdAt: new Date().toISOString(),
        changes: 'Initial upload',
      }],
      tags: [],
      aiSummary: 'AI analysis in progress... This document contains various types of content that has been automatically categorized by our intelligent system.',
      aiKeywords: ['document', 'content', 'upload'],
      sensitiveData: [],
      isLegacy: false,
      accessHistory: [],
    };

    set((state) => ({
      files: [newFile, ...state.files],
      isUploading: false,
      uploadProgress: 0,
    }));
    return newFile;
  },

  deleteFile: async (id: string) => {
    await delay(500);
    set((state) => ({ files: state.files.filter(f => f.id !== id) }));
  },

  updateFile: async (id: string, updates: Partial<VaultFile>) => {
    await delay(300);
    set((state) => ({
      files: state.files.map(f => f.id === id ? { ...f, ...updates, lastModified: new Date().toISOString() } : f),
    }));
  },

  selectFile: (file) => set({ selectedFile: file }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterType: (t) => set({ filterType: t }),
  setFilterAccess: (a) => set({ filterAccess: a }),
  setSortBy: (s) => set({ sortBy: s }),

  restoreVersion: async (fileId: string, versionId: string) => {
    await delay(500);
    set((state) => ({
      files: state.files.map(f => {
        if (f.id !== fileId) return f;
        const version = f.versions.find(v => v.versionId === versionId);
        if (!version) return f;
        const newVersion: FileVersion = {
          versionId: 'v_' + (++versionCounter),
          versionNumber: f.versions.length + 1,
          size: version.size,
          url: version.url,
          createdAt: new Date().toISOString(),
          changes: `Restored from version ${version.versionNumber}`,
        };
        return { ...f, url: version.url, versions: [...f.versions, newVersion] };
      }),
    }));
  },

  generateShareLink: (_fileId: string, _permission: 'view' | 'edit') => {
    const token = Math.random().toString(36).substr(2, 16);
    return `https://cloudvault.io/share/${token}`;
  },

  toggleLegacy: async (fileId: string) => {
    await delay(300);
    set((state) => ({
      files: state.files.map(f =>
        f.id === fileId ? { ...f, isLegacy: !f.isLegacy, legacyTimer: !f.isLegacy ? '2026-09-30T00:00:00Z' : undefined } : f
      ),
    }));
  },

  getFilteredFiles: () => {
    const { files, searchQuery, filterType, filterAccess, sortBy } = get();
    let filtered = [...files];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.originalName.toLowerCase().includes(q) ||
        f.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(f => f.type.toLowerCase() === filterType.toLowerCase());
    }

    if (filterAccess !== 'all') {
      filtered = filtered.filter(f => f.accessLevel === filterAccess);
    }

    switch (sortBy) {
      case 'name': filtered.sort((a, b) => a.originalName.localeCompare(b.originalName)); break;
      case 'size': filtered.sort((a, b) => b.size - a.size); break;
      case 'date': filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()); break;
    }

    return filtered;
  },
}));
