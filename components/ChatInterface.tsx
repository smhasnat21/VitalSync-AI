import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage, KnowledgeDoc, MessageRole, UserProfile } from '../types';
import { streamChatResponse } from '../services/geminiService';
import clsx from 'clsx';

interface ChatInterfaceProps {
  docs: KnowledgeDoc[];
  profile: UserProfile;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ docs, profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: MessageRole.MODEL,
      text: `Hi ${profile.name}! I'm your personalized health assistant. I have access to your **${docs.length} health records** to provide tailored advice. How are you feeling today?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    // Add placeholder for AI response
    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMsgId,
      role: MessageRole.MODEL,
      text: '',
      timestamp: Date.now()
    }]);

    let fullResponse = '';

    await streamChatResponse(
        [...messages, userMsg],
        docs,
        profile,
        (chunk) => {
            fullResponse += chunk;
            setMessages(prev => prev.map(msg => 
                msg.id === aiMsgId ? { ...msg, text: fullResponse } : msg
            ));
        }
    );

    setIsStreaming(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen bg-white">
      {/* Header */}
      <div className="flex-none px-6 py-4 border-b border-slate-100 flex items-center justify-between">
         <div>
             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-teal-600" />
                 Vital Assistant
             </h2>
             <p className="text-xs text-slate-500">
                Context Active: {docs.length > 0 ? `${docs.length} Personal Records` : 'General Knowledge'}
             </p>
         </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "flex gap-4 max-w-3xl",
              msg.role === MessageRole.USER ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={clsx(
              "flex-none w-8 h-8 rounded-full flex items-center justify-center",
              msg.role === MessageRole.USER ? "bg-slate-200" : "bg-teal-100 text-teal-700"
            )}>
              {msg.role === MessageRole.USER ? <User className="w-5 h-5 text-slate-600" /> : <Bot className="w-5 h-5" />}
            </div>
            
            <div className={clsx(
              "flex-1 px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
              msg.role === MessageRole.USER 
                ? "bg-slate-900 text-white rounded-tr-none" 
                : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
            )}>
              {msg.text ? (
                   <ReactMarkdown 
                     className="prose prose-sm prose-slate max-w-none prose-p:my-1 prose-headings:my-2 prose-strong:text-slate-900"
                     components={{
                         ul: ({node, ...props}) => <ul className="list-disc list-inside my-1" {...props} />,
                         ol: ({node, ...props}) => <ol className="list-decimal list-inside my-1" {...props} />
                     }}
                   >
                       {msg.text}
                   </ReactMarkdown>
              ) : (
                  <div className="flex space-x-1 h-5 items-center">
                      <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></div>
                  </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex-none p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your diet, reports, or workouts..."
            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none shadow-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">
            AI can make mistakes. Please verify important medical information.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;