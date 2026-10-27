import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Trash2,
  Download,
  BookOpen,
  Cpu,
  FlaskConical,
  Award,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useTutorChat } from '../context/TutorChatContext';
import { useLab } from '../context/LabContext';
import { TutorMessageItem } from '../components/chat/TutorMessageItem';

export const AiTutorPage: React.FC = () => {
  const { messages, isTyping, sendMessage, clearChat, starterQuestions } = useTutorChat();
  const {
    studentName,
    currentCircuit,
    completedLessons,
    completedLabs,
    assessmentHistory,
    setActiveTab,
  } = useLab();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleExportChat = () => {
    const textContent = messages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.role === 'assistant' ? 'Quantum AI Tutor' : studentName || 'Student'}:\n${m.content}\n`
      )
      .join('\n----------------------------------------\n\n');

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-tutor-session-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const topicCategories = [
    {
      title: 'Quantum Foundations',
      icon: Sparkles,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      questions: [
        'What is a qubit?',
        'How does superposition work?',
        'Why does entanglement matter?',
        'What is the Bloch sphere?',
      ],
    },
    {
      title: 'Gate Encyclopedia',
      icon: Cpu,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      questions: [
        'Explain the Hadamard gate with an example.',
        'What is the difference between X and Z gates?',
        'How does the CNOT gate create entanglement?',
        'Explain phase rotation gates (S, T, RZ).',
      ],
    },
    {
      title: 'Circuit Diagnostics & Labs',
      icon: FlaskConical,
      color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
      questions: [
        'How does my circuit work?',
        'Why did I get this assessment question wrong?',
        'What should I learn next?',
        'Explain how to measure state vectors.',
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md ring-4 ring-blue-50">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Quantum AI Tutor</h1>
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Context-Aware Engine Active
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Your personalized AI quantum physicist — answering questions on gates, circuits, state vectors, lessons, and exam results.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={handleExportChat}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
            title="Download conversation log"
          >
            <Download className="w-3.5 h-3.5" />
            Export Log
          </button>
          <button
            onClick={clearChat}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-medium border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
            title="Clear all messages"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Chat
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Chat Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Quick Topics & Learning Context */}
        <div className="lg:col-span-4 space-y-5">
          {/* Active Circuit Context Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-600" /> Live Circuit Context
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                {currentCircuit.qubitsCount} Qubits
              </span>
            </div>

            <p className="text-sm text-slate-700 font-medium mb-1">
              {currentCircuit.name || 'Active Circuit Workspace'}
            </p>
            <p className="text-xs text-slate-500 mb-3">
              Contains {currentCircuit.gates.length} gate operations. The AI Tutor has real-time access to this circuit.
            </p>

            <button
              onClick={() => sendMessage('How does my circuit work?')}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200/80 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask AI to Diagnose Active Circuit
            </button>
          </div>

          {/* Student Mastery Snapshot */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
              <Award className="w-4 h-4 text-indigo-600" /> Student Progress
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Academy Lessons</span>
                <span className="font-semibold text-slate-900">{completedLessons.length} / 26</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(completedLessons.length / 26) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-slate-600 pt-1">
                <span>Completed Labs</span>
                <span className="font-semibold text-slate-900">{completedLabs.length} / 12</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${(completedLabs.length / 12) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-slate-600 pt-1">
                <span>Assessments Taken</span>
                <span className="font-semibold text-slate-900">{assessmentHistory.length}</span>
              </div>
            </div>

            <button
              onClick={() => sendMessage('What should I learn next?')}
              className="mt-3.5 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              What should I learn next?
            </button>
          </div>

          {/* Topic Quick-Launch Explorer */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Curated Quantum Topics
            </span>

            {topicCategories.map((cat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <cat.icon className="w-3.5 h-3.5 text-blue-600" />
                  {cat.title}
                </div>
                <div className="flex flex-col gap-1.5">
                  {cat.questions.map((qText, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => handlePromptClick(qText)}
                      className="text-left text-xs p-2 rounded-lg bg-slate-50 hover:bg-blue-50/80 hover:text-blue-700 border border-slate-100 hover:border-blue-200 transition-all text-slate-600 cursor-pointer"
                    >
                      {qText}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Main Arena: Full Chat Conversation */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs h-[720px] overflow-hidden">
          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/40 space-y-4">
            {messages.map((msg, idx) => (
              <TutorMessageItem
                key={msg.id}
                message={msg}
                isLatest={idx === messages.length - 1}
                onActionClick={handleActionClick}
              />
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs py-2 px-3 bg-white rounded-xl border border-slate-200 w-fit">
                <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="font-medium">Quantum AI is formulating response...</span>
                <span className="flex gap-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Prompts Row */}
          <div className="p-2.5 bg-white border-t border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
            {starterQuestions.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handlePromptClick(prompt)}
                disabled={isTyping}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-all shrink-0 cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200 flex gap-2.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything: 'Explain the Hadamard gate', 'How does my circuit work?', 'Why does entanglement matter?'..."
              disabled={isTyping}
              className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold text-sm transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Ask Tutor</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
