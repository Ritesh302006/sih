import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { Card, CardHeader, CardContent, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'model',
    parts: [{ text: "Hello! I'm Nexus, your AI assistant. How can I help you manage the campus today?" }]
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { incidents, resources } = useAppContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    
    const newHistory: ChatMessage[] = [...messages, { role: 'user', parts: [{ text: userMsg }] }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Create a simplified context to avoid sending too much token data
      const context = {
        activeIncidents: incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED'),
        availableResources: resources.filter(r => r.status === 'AVAILABLE'),
        stats: {
          totalIncidents: incidents.length,
          criticalIncidents: incidents.filter(i => i.priority === 'CRITICAL').length
        }
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          history: messages,
          context
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages([...newHistory, { role: 'model', parts: [{ text: data.text }] }]);
      } else {
        throw new Error(data.error || "An unknown error occurred");
      }
    } catch (error: any) {
      console.error(error);
      setMessages([...newHistory, { role: 'model', parts: [{ text: error.message || "Sorry, I encountered an error. Please try again." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-transform hover:scale-110 z-50"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-full max-w-sm sm:max-w-md h-[500px] flex flex-col shadow-2xl z-50 border-purple-500/30 glow-purple bg-slate-950/80 backdrop-blur-xl overflow-hidden">
      {/* Background AI Video for entire chat */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-60 mix-blend-screen"
          src="https://labs.google/fx/api/og-video/shared/8bfb9dd9-a97c-43c7-8962-ddbaccb34102"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950/95" />
      </div>

      <CardHeader className="relative z-10 flex flex-row justify-between items-center py-4 border-b border-purple-500/30 bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/30 border border-purple-500/50 flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Bot size={20} className="text-purple-300" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white drop-shadow-lg">Nexus AI</CardTitle>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 drop-shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Online • Command Center
            </p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 backdrop-blur-sm transition-colors">
          <X size={18} />
        </button>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden relative z-10">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex items-start gap-3 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                msg.role === 'user' 
                  ? "bg-blue-600/20 border-blue-500/30 text-blue-400" 
                  : "bg-purple-600/20 border-purple-500/30 text-purple-400"
              )}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={cn(
                "p-3 rounded-2xl text-sm whitespace-pre-wrap shadow-md backdrop-blur-sm",
                msg.role === 'user' 
                  ? "bg-blue-600/80 text-white rounded-tr-sm border border-blue-500/50" 
                  : "bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-tl-sm markdown-body"
              )}>
                {msg.role === 'user' ? (
                  msg.parts[0].text
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.parts[0].text}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                <Bot size={14} />
              </div>
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 rounded-tl-sm text-slate-400 flex items-center">
                <Loader2 size={16} className="animate-spin" />
              </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-900/50 backdrop-blur-md border-t border-slate-800 relative z-10">
          <div className="relative flex items-center">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Nexus about campus status..." 
              className="pr-10 bg-slate-950/80 border-[#252525]"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-1.5 text-purple-400 hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-purple-500/20 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
