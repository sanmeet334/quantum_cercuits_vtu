import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Copy,
  Check,
  BookOpen,
  Cpu,
  FlaskConical,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';
import { TutorMessage } from '../../types/labTypes';
import { useLab } from '../../context/LabContext';

interface TutorMessageItemProps {
  message: TutorMessage;
  isLatest: boolean;
  onActionClick: (action: string) => void;
  onCloseModal?: () => void;
}

export const TutorMessageItem: React.FC<TutorMessageItemProps> = ({
  message,
  isLatest,
  onActionClick,
  onCloseModal,
}) => {
  const { setActiveTab, setSelectedLessonId, setSelectedGateId, setSelectedLabId } = useLab();
  const [copied, setCopied] = useState(false);

  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJumpToLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveTab('academy');
    if (onCloseModal) onCloseModal();
  };

  const handleJumpToGate = (gateId: any) => {
    setSelectedGateId(gateId);
    setActiveTab('gate_explorer');
    if (onCloseModal) onCloseModal();
  };

  const handleJumpToLab = (labId: string) => {
    setSelectedLabId(labId);
    setActiveTab('quantum_labs');
    if (onCloseModal) onCloseModal();
  };

  // Simple Markdown & Math Formatter for readable quantum text
  const renderFormattedContent = (text: string) => {
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      // Code block start / end
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // Close code block
          elements.push(
            <div key={`code-${idx}`} className="my-2.5 rounded-lg bg-slate-900 text-slate-100 p-3 text-xs font-mono overflow-x-auto shadow-inner border border-slate-700/50">
              <pre>{codeBuffer.join('\n')}</pre>
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h4 key={idx} className="text-sm font-bold text-slate-900 mt-3 mb-1.5 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h4>
        );
        return;
      }

      if (line.startsWith('#### ')) {
        elements.push(
          <h5 key={idx} className="text-xs font-bold uppercase tracking-wider text-blue-700 mt-2.5 mb-1">
            {line.replace('#### ', '')}
          </h5>
        );
        return;
      }

      // Bullet points
      if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        const cleanLine = line.trim().replace(/^[•\-]\s*/, '');
        elements.push(
          <li key={idx} className="text-xs sm:text-sm text-slate-700 ml-4 list-disc mb-1 leading-relaxed">
            {renderInlineFormatting(cleanLine)}
          </li>
        );
        return;
      }

      // Numbered lists
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        elements.push(
          <div key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-1.5 mb-1 ml-1 leading-relaxed">
            <span className="font-semibold text-blue-600 shrink-0">{numMatch[1]}.</span>
            <span>{renderInlineFormatting(numMatch[2])}</span>
          </div>
        );
        return;
      }

      // Blockquotes
      if (line.trim().startsWith('>')) {
        elements.push(
          <blockquote key={idx} className="my-2 pl-3 border-l-2 border-blue-400 text-xs sm:text-sm italic text-slate-600 bg-blue-50/40 py-1 rounded-r">
            {renderInlineFormatting(line.replace(/^>\s*/, ''))}
          </blockquote>
        );
        return;
      }

      // Empty line / paragraph gap
      if (!line.trim()) {
        elements.push(<div key={idx} className="h-1.5" />);
        return;
      }

      // Standard paragraph
      elements.push(
        <p key={idx} className="text-xs sm:text-sm text-slate-800 leading-relaxed mb-1.5">
          {renderInlineFormatting(line)}
        </p>
      );
    });

    return elements;
  };

  // Inline bold, code badges, and math symbols
  const renderInlineFormatting = (text: string): React.ReactNode => {
    // Replace markdown inline bold **text** and inline code `code`
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\$\$.*?\$\$|\$.*?\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-blue-700 font-mono text-[11px]">
            {part.slice(1, -1)}
          </code>
        );
      }
      if ((part.startsWith('$$') && part.endsWith('$$')) || (part.startsWith('$') && part.endsWith('$'))) {
        const formula = part.startsWith('$$') ? part.slice(2, -2) : part.slice(1, -1);
        return (
          <span key={i} className="inline-block px-1.5 py-0.5 rounded bg-blue-50/80 text-blue-900 font-mono text-xs font-medium border border-blue-200/60 my-0.5">
            {formula}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className={`flex gap-3 mb-4 ${isAssistant ? 'items-start' : 'items-start justify-end'}`}>
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs ring-2 ring-blue-100">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      {/* Bubble Container */}
      <div className={`max-w-[85%] sm:max-w-[78%] ${isAssistant ? 'w-full' : ''}`}>
        <div
          className={`rounded-2xl p-4 shadow-xs text-left transition-all ${
            isAssistant
              ? 'bg-white border border-slate-200 text-slate-900 shadow-slate-100/50'
              : 'bg-blue-600 text-white rounded-br-xs'
          }`}
        >
          {isAssistant ? (
            <div className="relative">
              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="absolute top-0 right-0 p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors"
                title="Copy response"
                aria-label="Copy response"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <div className="pr-6">{renderFormattedContent(message.content)}</div>

              {/* Related Interactive Navigation Links */}
              {(message.relatedLessonId || message.relatedGateId || message.relatedLabId) && (
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                  {message.relatedLessonId && (
                    <button
                      onClick={() => handleJumpToLesson(message.relatedLessonId!)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Jump to Lesson
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </button>
                  )}
                  {message.relatedGateId && (
                    <button
                      onClick={() => handleJumpToGate(message.relatedGateId!)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60 transition-colors cursor-pointer"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      Inspect Gate ({message.relatedGateId})
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </button>
                  )}
                  {message.relatedLabId && (
                    <button
                      onClick={() => handleJumpToLab(message.relatedLabId!)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200/60 transition-colors cursor-pointer"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      Open Lab ({message.relatedLabId})
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-white font-medium leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          )}

          <div
            className={`text-[10px] mt-2 font-mono ${
              isAssistant ? 'text-slate-400' : 'text-blue-100 text-right'
            }`}
          >
            {message.timestamp}
          </div>
        </div>

        {/* Context Action Pills on Latest Assistant Response */}
        {isAssistant && isLatest && message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-500 mr-1 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" /> Follow-up:
            </span>
            {message.suggestedActions.map((action, aIdx) => (
              <button
                key={aIdx}
                onClick={() => onActionClick(action)}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-800 border border-blue-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer"
              >
                {action}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
