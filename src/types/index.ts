// ============ User Types ============
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  storageUsed: number;
  storageLimit: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ============ File Types ============
export type AccessLevel = 'private' | 'public' | 'shared';
export type RiskScore = 'low' | 'medium' | 'high';

export interface VaultFile {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  mimeType: string;
  url: string;
  thumbnail?: string;
  uploadDate: string;
  lastModified: string;
  owner: string;
  accessLevel: AccessLevel;
  riskScore: RiskScore;
  versions: FileVersion[];
  shareLink?: string;
  sharePermission?: 'view' | 'edit';
  tags: string[];
  aiSummary?: string;
  aiKeywords?: string[];
  sensitiveData?: string[];
  isLegacy: boolean;
  legacyTimer?: string;
  accessHistory: AccessRecord[];
}

export interface FileVersion {
  versionId: string;
  versionNumber: number;
  size: number;
  url: string;
  createdAt: string;
  changes?: string;
}

export interface AccessRecord {
  userId: string;
  userName: string;
  action: 'view' | 'edit' | 'download' | 'share';
  timestamp: string;
  ip: string;
}

// ============ Notification Types ============
export type NotificationType = 'upload' | 'security' | 'login' | 'share' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon?: string;
}

// ============ Analytics Types ============
export interface AnalyticsData {
  uploadsOverTime: UploadDataPoint[];
  fileTypeDistribution: FileTypeData[];
  storagePerUser: StorageData[];
  securityAlerts: SecurityAlert[];
  totalFiles: number;
  totalStorage: number;
  totalUsers: number;
  totalShares: number;
}

export interface UploadDataPoint {
  date: string;
  uploads: number;
}

export interface FileTypeData {
  type: string;
  count: number;
  size: number;
  color: string;
}

export interface StorageData {
  user: string;
  used: number;
  limit: number;
}

// ============ Security Types ============
export interface SecurityAlert {
  id: string;
  severity: RiskScore;
  type: string;
  message: string;
  timestamp: string;
  fileId?: string;
  filename?: string;
  resolved: boolean;
}

export interface SecurityScanResult {
  riskScore: RiskScore;
  threats: Threat[];
  summary: string;
}

export interface Threat {
  type: string;
  pattern: string;
  location: string;
  severity: RiskScore;
}

// ============ AI Types ============
export interface AIAnalysis {
  summary: string;
  keywords: string[];
  sensitiveData: {
    emails: string[];
    phones: string[];
    patterns: string[];
  };
  language: string;
  pageCount?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ============ Log Types ============
export interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'failed' | 'blocked';
}

// ============ Digital Afterlife Types ============
export interface AfterlifeConfig {
  enabled: boolean;
  inactivityPeriod: number; // months
  trustedEmails: string[];
  legacyFiles: string[];
  lastActiveDate: string;
}

// ============ Sharing Types ============
export interface ShareLink {
  id: string;
  fileId: string;
  filename: string;
  token: string;
  permission: 'view' | 'edit';
  createdAt: string;
  expiresAt: string;
  accessCount: number;
  isActive: boolean;
}
