import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  Send,
  Trash2,
  Cpu,
  CornerDownLeft,
  Bot,
} from 'lucide-react';
import { useTutorChat } from '../../context/TutorChatContext';
import { useLab } from '../../context/LabContext';
import { TutorMessageItem } from './TutorMessageItem';

export const FloatingTutorChat: React.FC = () => {
  const { messages, isTyping, isOpen, setIsOpen, sendMessage, clearChat, starterQuestions } =
    useTutorChat();
  const { currentCircuit, setActiveTab, activeTab } = useLab();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    const text = input;
    setInput('');
    sendMessage(text);
  };

  const handleActionClick = (action: string) => {
    sendMessage('', action);
  };

  const handleStarterClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleGoToFullPage = () => {
    setIsOpen(false);
    setActiveTab('ai_tutor');
  };

  // If the user is already on the dedicated AI Tutor page, don't show the duplicate floating popup
  if (activeTab === 'ai_tutor') {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Open Quantum AI Tutor"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
            </div>
            <span className="text-sm font-semibold tracking-wide">Ask AI Tutor</span>

            {/* Quick Context Tooltip */}
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/20 text-white/90">
              {currentCircuit.gates.length} gates active
            </span>
          </button>
        </div>
      )}

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] md:w-[460px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white ring-2 ring-blue-400/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white tracking-wide">Quantum AI Tutor</h3>
                  <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Context-aware Quantum Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleGoToFullPage}
                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-md transition-colors"
                title="Expand to Full Page"
                aria-label="Expand to Full Page"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Circuit Context Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 font-medium">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>Canvas: {currentCircuit.qubitsCount} Qubits · {currentCircuit.gates.length} Gates placed</span>
            </div>
            <button
              onClick={() => sendMessage('How does my circuit work?')}
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
            >
              Analyze circuit
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-2">
            {messages.map((msg, idx) => (
              <TutorMessageItem
                key={msg.id}
                message={msg}
                isLatest={idx === messages.length - 1}
                onActionClick={handleActionClick}
                onCloseModal={() => setIsOpen(false)}
              />
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs py-2 px-3 bg-white rounded-xl border border-slate-200 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                <span className="font-medium">Quantum AI is thinking...</span>
                <span className="flex gap-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Chips */}
          <div className="p-2 bg-white border-t border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {starterQuestions.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleStarterClick(prompt)}
                disabled={isTyping}
                className="inline-block text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-all shrink-0 cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about gates, circuits, lessons..."
              disabled={isTyping}
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
