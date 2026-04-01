import { useState } from 'react';
import { useFileStore } from '../../store/fileStore';
import { formatDate } from '../../utils/format';
import {
  Skull, Clock, Mail, Shield, FileText, Sparkles,
  Plus, Trash2, AlertTriangle, CheckCircle, Settings,
  Heart, Send, Calendar, ToggleLeft, ToggleRight,
} from 'lucide-react';

interface TrustedContact {
  id: string;
  email: string;
  name: string;
  relation: string;
}

export default function AfterlifePage() {
  const { files, toggleLegacy } = useFileStore();
  const legacyFiles = files.filter(f => f.isLegacy);
  const nonLegacyFiles = files.filter(f => !f.isLegacy);

  const [enabled, setEnabled] = useState(true);
  const [inactivityMonths, setInactivityMonths] = useState(6);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([
    { id: '1', email: 'sarah@family.com', name: 'Sarah Johnson', relation: 'Spouse' },
    { id: '2', email: 'mike@legal.com', name: 'Mike Chen', relation: 'Attorney' },
  ]);
  const [newContact, setNewContact] = useState({ email: '', name: '', relation: '' });
  const [lastActive] = useState('2026-03-31T14:00:00Z');

  const addContact = () => {
    if (!newContact.email || !newContact.name) return;
    setTrustedContacts(prev => [...prev, { ...newContact, id: Date.now().toString() }]);
    setNewContact({ email: '', name: '', relation: '' });
  };

  const removeContact = (id: string) => {
    setTrustedContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleSimulateTrigger = () => {
    alert('🧬 Digital Afterlife Triggered!\n\nIn a real scenario:\n1. AI would generate summaries of all legacy files\n2. An email would be sent to trusted contacts\n3. Files would be packaged for transfer\n4. A final archive would be created');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Skull className="w-7 h-7 text-purple-400" />
          Digital Afterlife Mode
        </h1>
        <p className="text-slate-500 mt-1">Ensure your digital legacy is preserved and shared when you're no longer active.</p>
      </div>

      {/* Status Banner */}
      <div className={`glass-card p-5 border-l-4 ${enabled ? 'border-l-purple-500' : 'border-l-slate-600'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${enabled ? 'bg-purple-500/20' : 'bg-slate-800'}`}>
              {enabled ? <Heart className="w-6 h-6 text-purple-400 animate-pulse" /> : <Heart className="w-6 h-6 text-slate-600" />}
            </div>
            <div>
              <h3 className="font-semibold">{enabled ? 'Afterlife Mode Active' : 'Afterlife Mode Inactive'}</h3>
              <p className="text-sm text-slate-500">
                {enabled
                  ? `Your files will be preserved after ${inactivityMonths} months of inactivity.`
                  : 'Enable to protect your digital legacy.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
              enabled ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}
          >
            {enabled ? <><ToggleRight className="w-5 h-5" /> Active</> : <><ToggleLeft className="w-5 h-5" /> Disabled</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="glass-card p-6 space-y-6">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" /> Configuration
          </h3>

          {/* Inactivity Timer */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Inactivity Period</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="24"
                value={inactivityMonths}
                onChange={(e) => setInactivityMonths(Number(e.target.value))}
                className="flex-1 accent-purple-500"
              />
              <span className="text-sm font-mono font-bold text-purple-400 min-w-[80px]">{inactivityMonths} months</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Files will trigger after this period of account inactivity.</p>
          </div>

          {/* Trigger Date Preview */}
          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400">Last active:</span>
              <span className="font-medium">{formatDate(lastActive)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400">Trigger date:</span>
              <span className="font-medium">
                {new Date(new Date(lastActive).setMonth(new Date(lastActive).getMonth() + inactivityMonths)).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* What Happens */}
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-3">When triggered, CloudVault will:</h4>
            <div className="space-y-2">
              {[
                { icon: Sparkles, text: 'Generate AI summaries for all legacy files' },
                { icon: Mail, text: 'Send summaries to trusted contacts via email' },
                { icon: FileText, text: 'Create a comprehensive file archive' },
                { icon: Shield, text: 'Transfer access permissions to designated contacts' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/20">
                  <span className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center text-xs font-bold text-purple-400">{i + 1}</span>
                  <step.icon className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-400">{step.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trusted Contacts */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-400" /> Trusted Contacts
          </h3>

          <div className="space-y-3">
            {trustedContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-slate-500">{contact.email}</p>
                    <span className="text-xs text-indigo-400">{contact.relation}</span>
                  </div>
                </div>
                <button onClick={() => removeContact(contact.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Contact */}
          <div className="p-4 rounded-xl bg-slate-800/20 border border-dashed border-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newContact.name}
                onChange={(e) => setNewContact(p => ({ ...p, name: e.target.value }))}
                className="glass-input text-sm py-2"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newContact.email}
                onChange={(e) => setNewContact(p => ({ ...p, email: e.target.value }))}
                className="glass-input text-sm py-2"
              />
              <input
                type="text"
                placeholder="Relation"
                value={newContact.relation}
                onChange={(e) => setNewContact(p => ({ ...p, relation: e.target.value }))}
                className="glass-input text-sm py-2"
              />
            </div>
            <button onClick={addContact} className="btn-secondary w-full text-sm py-2 flex items-center justify-center gap-1">
              <Plus className="w-4 h-4" /> Add Contact
            </button>
          </div>
        </div>
      </div>

      {/* Legacy Files */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" /> Legacy Files ({legacyFiles.length})
          </h3>
          <button onClick={handleSimulateTrigger} className="btn-primary text-sm py-2 flex items-center gap-1">
            <Send className="w-4 h-4" /> Simulate Trigger
          </button>
        </div>

        {legacyFiles.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No legacy files marked. Select files in File Manager to mark as legacy.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {legacyFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📄</span>
                  <div>
                    <p className="text-sm font-medium">{file.originalName}</p>
                    <p className="text-xs text-slate-500">{file.aiSummary?.slice(0, 80)}...</p>
                  </div>
                </div>
                <button onClick={() => toggleLegacy(file.id)} className="btn-danger text-xs py-1.5 px-3">Remove</button>
              </div>
            ))}
          </div>
        )}

        {/* Available files to mark */}
        {nonLegacyFiles.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-sm text-slate-500 mb-3">Mark additional files as legacy:</p>
            <div className="flex flex-wrap gap-2">
              {nonLegacyFiles.slice(0, 5).map((file) => (
                <button
                  key={file.id}
                  onClick={() => toggleLegacy(file.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/30 text-xs text-slate-400 hover:border-purple-500/30 hover:text-purple-400 transition-colors"
                >
                  + {file.originalName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
