export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRiskColor(score: string): string {
  switch (score) {
    case 'high': return 'text-red-400';
    case 'medium': return 'text-yellow-400';
    case 'low': return 'text-green-400';
    default: return 'text-gray-400';
  }
}

export function getRiskBg(score: string): string {
  switch (score) {
    case 'high': return 'bg-red-500/20 border-red-500/30 text-red-400';
    case 'medium': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
    case 'low': return 'bg-green-500/20 border-green-500/30 text-green-400';
    default: return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
  }
}

export function getAccessColor(level: string): string {
  switch (level) {
    case 'public': return 'bg-blue-500/20 text-blue-400';
    case 'shared': return 'bg-purple-500/20 text-purple-400';
    case 'private': return 'bg-gray-500/20 text-gray-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
}

export function getFileIcon(type: string): string {
  const t = type.toLowerCase();
  if (t.includes('pdf')) return '📄';
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(t)) return '🖼️';
  if (['doc', 'docx'].includes(t)) return '📝';
  if (['xls', 'xlsx', 'csv'].includes(t)) return '📊';
  if (['ppt', 'pptx'].includes(t)) return '📽️';
  if (['js', 'ts', 'json', 'py', 'html', 'css'].includes(t)) return '💻';
  if (['mp4', 'mov', 'avi'].includes(t)) return '🎬';
  if (['mp3', 'wav'].includes(t)) return '🎵';
  if (['zip', 'rar', '7z'].includes(t)) return '📦';
  return '📎';
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function storagePercent(used: number, limit: number): number {
  return Math.round((used / limit) * 100);
}

