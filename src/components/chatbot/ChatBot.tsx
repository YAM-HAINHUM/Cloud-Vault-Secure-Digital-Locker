import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { MessageSquare, X, Send, Sparkles, Trash2, Minimize2 } from 'lucide-react';

export default function ChatBot() {
  const { isOpen, messages, isTyping, toggleChat, sendMessage, clearMessages } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    sendMessage(input.trim());
    setInput('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all animate-pulse-glow"
        title="AI Assistant"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[520px] glass-strong rounded-2xl shadow-2xl border border-indigo-500/20 flex flex-col overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-500/10 bg-gradient-to-r from-indigo-600/10 to-purple-600/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">CloudVault AI</h3>
            <p className="text-[10px] text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={clearMessages} className="p-1.5 hover:bg-slate-700/50 rounded-lg text-slate-500 hover:text-slate-400" title="Clear chat">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={toggleChat} className="p-1.5 hover:bg-slate-700/50 rounded-lg text-slate-500 hover:text-slate-400" title="Minimize">
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-indigo-600/20 border border-indigo-500/20 text-indigo-100'
                : 'bg-slate-800/50 border border-slate-700/30 text-slate-300'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-2xl px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-2">
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
          {['Show my files', 'Security status', 'Storage usage', 'Help'].map((action) => (
            <button
              key={action}
              onClick={() => sendMessage(action)}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/30 text-xs text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors flex-shrink-0"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-indigo-500/10">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="glass-input flex-1 text-sm py-2.5"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white disabled:opacity-50 hover:scale-105 transition-transform flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
