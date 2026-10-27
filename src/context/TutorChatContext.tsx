import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { TutorMessage } from '../types/labTypes';
import { useLab } from './LabContext';
import { getTutorAnswer, TutorContext } from '../quantum/aiTutorService';

interface TutorChatContextType {
  messages: TutorMessage[];
  isTyping: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  sendMessage: (text: string, actionRequested?: string) => Promise<void>;
  clearChat: () => void;
  starterQuestions: string[];
}

const STORAGE_KEY = 'quantumgate_tutor_messages_v1';

const INITIAL_MESSAGES: TutorMessage[] = [
  {
    id: 'intro-1',
    role: 'assistant',
    content: `Hello! I am your **Quantum AI Tutor**.

I am here to guide you through quantum gates, superposition, entanglement, state vectors, circuit design, and assessment tests.

Here are a few things you can ask me:
• *"What is a qubit?"*
• *"Explain the Hadamard gate with an example."*
• *"What is the difference between X and Z gates?"*
• *"Why does entanglement matter?"*
• *"How does my circuit work?"*
• *"What should I learn next?"*

How can I help you in your quantum journey today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedActions: ['Clear explanation', 'Give an example', 'Explain more simply', 'Suggest a related lesson'],
  },
];

export const STARTER_QUESTIONS: string[] = [
  'What is a qubit?',
  'Explain the Hadamard gate with an example.',
  'What is the difference between X and Z gates?',
  'Why does entanglement matter?',
  'How does my circuit work?',
  'What should I learn next?',
  'Why did I get this assessment question wrong?',
];

const TutorChatContext = createContext<TutorChatContextType | undefined>(undefined);

export const TutorChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    studentName,
    currentCircuit,
    completedLessons,
    completedLabs,
    assessmentHistory,
  } = useLab();

  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<TutorMessage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load tutor chat messages:', e);
    }
    return INITIAL_MESSAGES;
  });

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save tutor chat messages:', e);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string, actionRequested?: string) => {
      if (!text.trim() && !actionRequested) return;

      const userText = actionRequested ? `[Action: ${actionRequested}]` : text.trim();
      const userMsg: TutorMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contextActionUsed: actionRequested,
      };

      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      const tutorCtx: TutorContext = {
        studentName,
        currentCircuit,
        completedLessons,
        completedLabs,
        assessmentHistory,
      };

      try {
        // Find the last assistant message if action was requested
        const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
        const response = await getTutorAnswer(text, tutorCtx, lastAssistant, actionRequested);

        const assistantMsg: TutorMessage = {
          id: `tutor-${Date.now()}`,
          role: 'assistant',
          content: response.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: response.suggestedActions,
          relatedLessonId: response.relatedLessonId,
          relatedGateId: response.relatedGateId,
          relatedLabId: response.relatedLabId,
        };

        setMessages(prev => [...prev, assistantMsg]);
      } catch (err) {
        console.error('Tutor error:', err);
        const errorMsg: TutorMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `I encountered an unexpected issue while processing your question. Please try asking again or select one of the suggested prompts below!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: ['Clear explanation', 'Give an example', 'Explain more simply'],
        };
        setMessages(prev => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [studentName, currentCircuit, completedLessons, completedLabs, assessmentHistory, messages]
  );

  return (
    <TutorChatContext.Provider
      value={{
        messages,
        isTyping,
        isOpen,
        setIsOpen,
        sendMessage,
        clearChat,
        starterQuestions: STARTER_QUESTIONS,
      }}
    >
      {children}
    </TutorChatContext.Provider>
  );
};

export const useTutorChat = (): TutorChatContextType => {
  const context = useContext(TutorChatContext);
  if (!context) {
    throw new Error('useTutorChat must be used within a TutorChatProvider');
  }
  return context;
};
