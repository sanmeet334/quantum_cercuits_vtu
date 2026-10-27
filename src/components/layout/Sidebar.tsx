import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Cpu,
  GitBranch,
  Play,
  Share2,
  FlaskConical,
  Bug,
  Target,
  FileCheck,
  BarChart3,
  FolderOpen,
  Trophy,
  Settings,
  Atom,
  ChevronLeft,
  ChevronRight,
  X,
  Bot,
} from 'lucide-react';
import { useLab } from '../../context/LabContext';
import { NavigationTab } from '../../types/labTypes';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { activeTab, setActiveTab, completedLessons, completedLabs, savedCircuits } = useLab();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'academy',
      label: 'Quantum Academy',
      icon: GraduationCap,
      badge: `${completedLessons.length}/26`,
    },
    { id: 'gate_explorer', label: 'Gate Explorer', icon: Cpu },
    { id: 'circuit_studio', label: 'Circuit Studio', icon: GitBranch },
    { id: 'simulator', label: 'Quantum Simulator', icon: Play },
    { id: 'entanglement', label: 'Entanglement Lab', icon: Share2 },
    {
      id: 'quantum_labs',
      label: 'Quantum Labs',
      icon: FlaskConical,
      badge: `${completedLabs.length}/12`,
    },
    { id: 'circuit_debugger', label: 'Circuit Debugger', icon: Bug },
    { id: 'practice_arena', label: 'Practice Arena', icon: Target },
    { id: 'assessments', label: 'Tests & Assessments', icon: FileCheck },
    {
      id: 'ai_tutor',
      label: 'Quantum AI Tutor',
      icon: Bot,
      badge: 'AI',
    },
    { id: 'analytics', label: 'Learning Analytics', icon: BarChart3 },
    {
      id: 'saved_circuits',
      label: 'Saved Circuits',
      icon: FolderOpen,
      badge: `${savedCircuits.length}`,
    },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    setActiveTab(tabId);
    if (isMobileOpen) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white border-r border-slate-200 shadow-xs transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 shrink-0 bg-white">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Atom className="w-6 h-6 animate-spin" style={{ animationDuration: '16s' }} />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="font-bold text-base text-slate-900 tracking-tight font-display block truncate">
                  QuantumGate
                </span>
                <span className="text-[10px] font-mono text-blue-600 font-semibold block -mt-0.5 uppercase tracking-wider">
                  Cloud Lab
                </span>
              </div>
            )}
          </div>

          {/* Close for mobile */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1 custom-scrollbar bg-white">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate flex-1 text-left font-sans">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                      isActive
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Collapse Button */}
        <div className="p-3 border-t border-slate-200 hidden lg:flex items-center justify-between bg-slate-50/50">
          {!isCollapsed && (
            <span className="text-[11px] font-mono text-slate-500">
              Lab v1.0 · Ready
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/70 transition-colors cursor-pointer ml-auto"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
