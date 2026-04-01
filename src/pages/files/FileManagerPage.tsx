import { useState, useRef } from 'react';
import { useFileStore } from '../../store/fileStore';
import { useNotificationStore } from '../../store/notificationStore';
import { formatBytes, formatDate, getRiskBg, getAccessColor, getFileIcon, formatFullDate } from '../../utils/format';
import type { VaultFile } from '../../types';
import {
  Upload,
  Search,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Trash2,
  Share2,
  Eye,
  Download,
  MoreVertical,
  X,
  Copy,
  Shield,
  Clock,
  RotateCcw,
  Lock,
  Globe,
  Users,
  ChevronDown,
  FileText,
  Sparkles,
  AlertTriangle,
  Loader2,
  Check,
} from 'lucide-react';

export default function FileManagerPage() {
  const {
    files, searchQuery, filterType, filterAccess, sortBy,
    uploadProgress, isUploading,
    setSearchQuery, setFilterType, setFilterAccess, setSortBy,
    uploadFile, deleteFile, updateFile, restoreVersion, generateShareLink, toggleLegacy, getFilteredFiles,
  } = useFileStore();
  const { addNotification } = useNotificationStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<VaultFile | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState<string | null>(null);

  const filteredFiles = getFilteredFiles();

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    for (const file of Array.from(fileList).slice(0, 5)) {
      setAiAnalyzing(file.name);
      const uploaded = await uploadFile(file);
      addNotification('upload', 'File Uploaded', `${file.name} was uploaded successfully. Risk score: ${uploaded.riskScore}.`);
      // Simulate AI analysis
      setTimeout(() => setAiAnalyzing(null), 2000);
    }
    setShowUploadArea(false);
  };

  const handleDelete = async (id: string, name: string) => {
    await deleteFile(id);
    addNotification('warning', 'File Deleted', `${name} has been permanently removed.`);
    if (selectedFile?.id === id) setSelectedFile(null);
  };

  const handleShare = (file: VaultFile) => {
    const link = generateShareLink(file.id, 'view');
    setShareLink(link);
    setShowShareModal(true);
  };

  const handleRestore = async (fileId: string, versionId: string) => {
    await restoreVersion(fileId, versionId);
    addNotification('info', 'Version Restored', 'File has been restored to the selected version.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">File Manager</h1>
          <p className="text-slate-500 mt-1">{filteredFiles.length} files • {formatBytes(files.reduce((a, f) => a + f.size, 0))} total</p>
        </div>
        <button onClick={() => setShowUploadArea(true)} className="btn-primary flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload Files
        </button>
      </div>

      {/* Upload Area */}
      {showUploadArea && (
        <div className="glass-card p-8 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Upload Files</h3>
            <button onClick={() => setShowUploadArea(false)} className="p-1 hover:bg-slate-700/50 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
          </div>
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${
              dragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-indigo-500/50'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
            {isUploading ? (
              <div className="space-y-3">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto" />
                <p className="text-sm text-slate-400">Uploading... {uploadProgress}%</p>
                <div className="w-64 mx-auto h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            ) : aiAnalyzing ? (
              <div className="space-y-3">
                <Sparkles className="w-10 h-10 text-indigo-500 mx-auto animate-pulse" />
                <p className="text-sm text-slate-400">AI analyzing {aiAnalyzing}...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400">Drag & drop files here or click to browse</p>
                <p className="text-xs text-slate-600">PDF, Images, Documents up to 50MB</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-10 py-2.5 text-sm"
          />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="glass-input py-2.5 text-sm min-w-[120px]">
          <option value="all">All Types</option>
          <option value="pdf">PDF</option>
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="docx">DOCX</option>
          <option value="csv">CSV</option>
          <option value="pptx">PPTX</option>
          <option value="json">JSON</option>
        </select>
        <select value={filterAccess} onChange={(e) => setFilterAccess(e.target.value)} className="glass-input py-2.5 text-sm min-w-[130px]">
          <option value="all">All Access</option>
          <option value="private">Private</option>
          <option value="shared">Shared</option>
          <option value="public">Public</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="glass-input py-2.5 text-sm min-w-[120px]">
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="size">Sort by Size</option>
        </select>
        <div className="flex border border-slate-700/50 rounded-xl overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-400'}`}>
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-400'}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File Grid / List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className={`glass-card p-4 cursor-pointer group relative ${selectedFile?.id === file.id ? 'ring-2 ring-indigo-500/50' : ''}`}
              onClick={() => setSelectedFile(file)}
            >
              {/* File preview area */}
              <div className="w-full h-32 rounded-xl bg-slate-800/50 flex items-center justify-center mb-3 overflow-hidden">
                {['PNG', 'JPG', 'GIF', 'SVG', 'WEBP'].includes(file.type) ? (
                  <div className="text-5xl">🖼️</div>
                ) : (
                  <span className="text-4xl">{getFileIcon(file.type)}</span>
                )}
              </div>

              {/* Actions overlay */}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); handleShare(file); }} className="p-1.5 rounded-lg glass text-slate-400 hover:text-indigo-400">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(file.id, file.originalName); }} className="p-1.5 rounded-lg glass text-slate-400 hover:text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Risk badge */}
              <div className="flex items-center justify-between mb-2">
                <span className={`badge ${getRiskBg(file.riskScore)}`}>{file.riskScore}</span>
                {file.isLegacy && <span className="badge bg-purple-500/20 border-purple-500/30 text-purple-400">🧬 Legacy</span>}
              </div>

              <p className="text-sm font-medium truncate">{file.originalName}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-500">{formatBytes(file.size)}</span>
                <span className={`badge text-[10px] ${getAccessColor(file.accessLevel)}`}>
                  {file.accessLevel === 'private' ? <Lock className="w-2.5 h-2.5 mr-1" /> : file.accessLevel === 'public' ? <Globe className="w-2.5 h-2.5 mr-1" /> : <Users className="w-2.5 h-2.5 mr-1" />}
                  {file.accessLevel}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2">{formatDate(file.uploadDate)} • v{file.versions.length}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-4">File</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-4">Size</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-4">Type</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-4">Access</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-4">Risk</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-4">Modified</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr key={file.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getFileIcon(file.type)}</span>
                      <div>
                        <p className="text-sm font-medium">{file.originalName}</p>
                        <p className="text-xs text-slate-600">v{file.versions.length} • {file.tags.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-400">{formatBytes(file.size)}</td>
                  <td className="p-4"><span className="badge bg-slate-800 border-slate-700 text-slate-400">{file.type}</span></td>
                  <td className="p-4"><span className={`badge ${getAccessColor(file.accessLevel)}`}>{file.accessLevel}</span></td>
                  <td className="p-4"><span className={`badge ${getRiskBg(file.riskScore)}`}>{file.riskScore}</span></td>
                  <td className="p-4 text-sm text-slate-500">{formatDate(file.lastModified)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleShare(file)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-indigo-400"><Share2 className="w-4 h-4" /></button>
                      <button onClick={() => setSelectedFile(file)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-indigo-400"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(file.id, file.originalName)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* File Detail Panel */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedFile(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-lg glass-strong animate-slide-right overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 glass-strong p-5 border-b border-slate-800 flex items-center justify-between z-10">
              <h3 className="font-semibold">File Details</h3>
              <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-slate-700/50 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>

            <div className="p-5 space-y-6">
              {/* File Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl">
                  {getFileIcon(selectedFile.type)}
                </div>
                <div>
                  <p className="font-semibold">{selectedFile.originalName}</p>
                  <p className="text-sm text-slate-500">{selectedFile.type} • {formatBytes(selectedFile.size)}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`badge ${getRiskBg(selectedFile.riskScore)}`}>{selectedFile.riskScore} risk</span>
                    <span className={`badge ${getAccessColor(selectedFile.accessLevel)}`}>{selectedFile.accessLevel}</span>
                    {selectedFile.isLegacy && <span className="badge bg-purple-500/20 border-purple-500/30 text-purple-400">Legacy</span>}
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              <div>
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> AI Analysis
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedFile.aiSummary}</p>
                {selectedFile.aiKeywords && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {selectedFile.aiKeywords.map((kw) => (
                      <span key={kw} className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs">{kw}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Sensitive Data */}
              {selectedFile.sensitiveData && selectedFile.sensitiveData.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" /> Sensitive Data Detected
                  </h4>
                  <div className="space-y-1.5">
                    {selectedFile.sensitiveData.map((data, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                        <Shield className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="text-xs text-yellow-400 font-mono">{data}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Version History */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Version History
                  </h4>
                </div>
                <div className="space-y-2">
                  {selectedFile.versions.map((v) => (
                    <div key={v.versionId} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                      <div>
                        <p className="text-sm font-medium">Version {v.versionNumber}</p>
                        <p className="text-xs text-slate-500">{formatFullDate(v.createdAt)} • {formatBytes(v.size)}</p>
                        {v.changes && <p className="text-xs text-slate-600 mt-0.5">{v.changes}</p>}
                      </div>
                      {v.versionNumber !== selectedFile.versions.length && (
                        <button
                          onClick={() => handleRestore(selectedFile.id, v.versionId)}
                          className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Restore
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Access History */}
              {selectedFile.accessHistory.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Access History</h4>
                  <div className="space-y-2">
                    {selectedFile.accessHistory.map((a, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg">
                        <span className="text-slate-400">{a.userName} — <span className="capitalize">{a.action}</span></span>
                        <span className="text-slate-600">{formatDate(a.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => handleShare(selectedFile)} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-2.5">
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button onClick={() => toggleLegacy(selectedFile.id)} className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm py-2.5">
                  🧬 {selectedFile.isLegacy ? 'Remove Legacy' : 'Mark Legacy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative glass-card p-6 w-full max-w-md animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Share File</h3>
              <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-slate-700/50 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Shareable Link</label>
                <div className="flex gap-2">
                  <input type="text" value={shareLink} readOnly className="glass-input flex-1 text-sm font-mono" />
                  <button
                    onClick={() => { navigator.clipboard.writeText(shareLink); }}
                    className="btn-primary px-4 flex items-center gap-1 text-sm"
                  >
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Permission</label>
                <div className="flex gap-2">
                  <button className="btn-secondary flex-1 text-sm py-2">👁️ View Only</button>
                  <button className="btn-primary flex-1 text-sm py-2">✏️ Can Edit</button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Expires In</label>
                <select className="glass-input w-full text-sm">
                  <option>7 days</option>
                  <option>30 days</option>
                  <option>90 days</option>
                  <option>Never</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
