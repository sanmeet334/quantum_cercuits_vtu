import React, { useState } from 'react';
import {
  Search,
  BookMarked,
  Sun,
  Moon,
  Flame,
  User,
  Menu,
  Sparkles,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { useLab } from '../../context/LabContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, title }) => {
  const {
    studentName,
    setStudentName,
    settings,
    updateSettings,
    streak,
    setSearchModalOpen,
    setGlossaryModalOpen,
  } = useLab();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(studentName || '');

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setStudentName(tempName.trim());
      setIsEditingName(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
      {/* Left: Mobile hamburger & Active Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors lg:hidden cursor-pointer"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate font-display">
            {title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block font-mono">
            Track 5 · Quantum Cloud-Based Applications
          </p>
        </div>
      </div>

      {/* Center: Quick Search Trigger */}
      <button
        onClick={() => setSearchModalOpen(true)}
        className="hidden md:flex items-center gap-3 px-3.5 py-1.5 bg-slate-100/80 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl text-xs text-slate-500 hover:text-slate-800 transition-all cursor-pointer w-64 max-w-xs justify-between shadow-xs"
      >
        <span className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-blue-600" />
          <span>Search gates, labs, lessons...</span>
        </span>
        <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-500 shadow-xs">
          ⌘K
        </kbd>
      </button>

      {/* Right: Actions, Streak, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile search icon */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 md:hidden cursor-pointer"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Glossary button */}
        <button
          onClick={() => setGlossaryModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 hover:text-blue-700 hover:bg-blue-50/80 rounded-xl transition-colors cursor-pointer border border-slate-200/80"
          title="Quantum Glossary"
        >
          <BookMarked className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline font-medium">Glossary</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} theme`}
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-blue-600" />
          )}
        </button>

        {/* Learning Streak */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono text-amber-900 shadow-xs"
          title={`${streak} day learning streak`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-amber-800 font-bold">${streak}d</span>
        </div>

        {/* Student Profile / Name Switcher */}
        <div className="relative">
          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-1 bg-white border-2 border-blue-500 rounded-xl p-1 shadow-md">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                className="w-28 px-2 py-0.5 text-xs bg-transparent text-slate-900 outline-none font-sans font-medium"
              />
              <button type="submit" className="p-1 text-emerald-600 hover:text-emerald-700 cursor-pointer" title="Save name">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setTempName(studentName || '');
                  setIsEditingName(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setTempName(studentName || '');
                setIsEditingName(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-xs text-slate-800 transition-all cursor-pointer group shadow-xs"
              title="Click to change student name"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                {studentName ? studentName.charAt(0).toUpperCase() : 'Q'}
              </div>
              <span className="font-semibold max-w-[100px] truncate hidden sm:inline text-slate-900">
                {studentName || 'Student'}
              </span>
              <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
