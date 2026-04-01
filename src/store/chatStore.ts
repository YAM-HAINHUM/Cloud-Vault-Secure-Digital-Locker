import { create } from 'zustand';
import type { ChatMessage } from '../types';

interface ChatStore {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  toggleChat: () => void;
  sendMessage: (content: string) => void;
  clearMessages: () => void;
}

const intentResponses: Record<string, string> = {
  'show files': '📂 You have **23 files** in your vault (4.2 GB total). Recent uploads:\n• Q4-Report-2025.pdf (2.4 MB)\n• Brand-Guidelines.png (8.1 MB)\n• API-Documentation.docx (1.2 MB)\n• Team-Photo-2025.jpg (3.8 MB)',
  'my files': '📂 You have **23 files** in your vault (4.2 GB total). Your storage usage is at 40%. Go to File Manager for details.',
  'security status': '🛡️ **Security Status: Good**\n\n• 2 low-risk alerts found\n• No high-risk threats detected\n• Last scan: 2 hours ago\n• All files passed security check\n• 3 suspicious login attempts blocked this month',
  'check security': '🛡️ **Security Report:**\n• Scan completed: All clear\n• 2 files flagged with sensitive data (emails)\n• 0 malicious patterns detected\n• Next scheduled scan: Tomorrow 3:00 AM',
  'storage usage': '💾 **Storage Usage:**\n\n• Used: 4.2 GB / 10 GB (42%)\n• Largest file: Brand-Guidelines.png (8.1 MB)\n• Most active: Documents (15 files)\n• Recommended: Consider archiving old files to free up space',
  'help': '🤖 **CloudVault AI Assistant** — I can help you with:\n\n• **"Show my files"** — View file inventory\n• **"Security status"** — Check security reports\n• **"Storage usage"** — View storage analytics\n• **"Upload file"** — Start file upload\n• **"Recent activity"** — View recent actions\n• **"Afterlife settings"** — Digital afterlife config\n• **"Generate report"** — Create PDF report',
  'upload': '📤 To upload a file:\n1. Go to **File Manager**\n2. Click the **Upload** button (top right)\n3. Select your file or drag & drop\n4. Files are auto-scanned for security\n5. AI analysis starts automatically',
  'recent activity': '📋 **Recent Activity:**\n\n• 2 min ago — Uploaded Q4-Report.pdf\n• 15 min ago — Login from Chrome/macOS\n• 1 hour ago — Shared Brand-Guidelines.png\n• 3 hours ago — Updated API-Docs.docx\n• Yesterday — Downloaded Team-Photo.jpg',
  'afterlife': '🧬 **Digital Afterlife Mode:**\n\n• Status: **Active** (2 legacy files)\n• Inactivity timer: 6 months\n• Trusted contacts: 2 emails configured\n• Legacy files will be summarized and shared if you\'re inactive.',
  'report': '📊 **Report Generation:**\n\nGo to **Analytics** → Click **"Generate Report"** to create a comprehensive PDF report including:\n• File inventory & storage metrics\n• Security audit results\n• Usage statistics & trends\n• Access logs summary',
};

function findResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [intent, response] of Object.entries(intentResponses)) {
    if (lower.includes(intent)) return response;
  }
  return "🤔 I'm not sure about that. Try asking about:\n• **Show my files**\n• **Security status**\n• **Storage usage**\n• **Help** — for all available commands";
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: '👋 Hi! I\'m **CloudVault AI Assistant**. I can help you manage files, check security, view analytics, and more. Type **"help"** to see what I can do!',
      timestamp: new Date().toISOString(),
    },
  ],
  isOpen: false,
  isTyping: false,

  toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),

  sendMessage: (content: string) => {
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    set((s) => ({ messages: [...s.messages, userMsg], isTyping: true }));

    setTimeout(() => {
      const response = findResponse(content);
      const botMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      set((s) => ({ messages: [...s.messages, botMsg], isTyping: false }));
    }, 800 + Math.random() * 700);
  },

  clearMessages: () => set({
    messages: [{
      id: 'welcome',
      role: 'assistant',
      content: '👋 Chat cleared! How can I help you?',
      timestamp: new Date().toISOString(),
    }],
  }),
}));
