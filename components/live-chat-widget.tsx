'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Droplet } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { ChatMessage } from '@/lib/types';

export default function LiveChatWidget() {
  const { sessionId, user, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat history for this session
  const fetchMessages = async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/chat?sessionId=${sessionId}`);
      const data = await res.json();
      if (data.success && data.messages) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          senderRole: role === 'admin' ? 'admin' : 'customer',
          senderName: user ? user.name : 'Khách vãng lai',
          message: userText
        })
      });

      const data = await res.json();
      if (data.success) {
        fetchMessages();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold shadow-xl shadow-teal-500/25 hover:scale-105 hover:brightness-105 active:scale-95 transition-all"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
          </div>
          <span className="text-xs tracking-wide">Chat Thủy Sinh 24/7</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[390px] h-[520px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  AquaVibe Support Desk
                  <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                </h4>
                <p className="text-[11px] text-teal-100 font-medium">Tư vấn thả cá & hỗ trợ đơn hàng</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick FAQ buttons */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex gap-1.5 overflow-x-auto text-[11px]">
            {[
              '🚚 Quy chuẩn đóng gói oxy?',
              '🐟 Tư vấn cá mới thả hồ?',
              '⚡ Giao hỏa tốc bao lâu?'
            ].map((quick, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputMessage(quick.replace(/^[^\w\s]+/, '').trim());
                }}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-teal-400 hover:text-teal-700 whitespace-nowrap transition-colors shadow-xs"
              >
                {quick}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-slate-500 space-y-2">
                <Droplet className="w-8 h-8 text-teal-600 mx-auto animate-bounce" />
                <p className="text-xs">Xin chào! Bạn cần hỗ trợ gì về kỹ thuật nuôi cá hoặc đơn hàng?</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = (role === 'admin' && msg.senderRole === 'admin') || (role !== 'admin' && msg.senderRole === 'customer');
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-400 mb-1 px-1">
                      {msg.senderName}
                    </span>
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-500 disabled:opacity-50 transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
