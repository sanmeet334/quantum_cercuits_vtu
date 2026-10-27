import React, { useState } from 'react';
import { LabProvider, useLab } from './context/LabContext';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { SearchModal } from './components/layout/SearchModal';
import { GlossaryModal } from './components/layout/GlossaryModal';
import { Toast } from './components/common/Toast';

// 14 Module Pages
import { DashboardPage } from './pages/DashboardPage';
import { AcademyPage } from './pages/AcademyPage';
import { GateExplorerPage } from './pages/GateExplorerPage';
import { CircuitStudioPage } from './pages/CircuitStudioPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { EntanglementPage } from './pages/EntanglementPage';
import { QuantumLabsPage } from './pages/QuantumLabsPage';
import { CircuitDebuggerPage } from './pages/CircuitDebuggerPage';
import { PracticeArenaPage } from './pages/PracticeArenaPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SavedCircuitsPage } from './pages/SavedCircuitsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AiTutorPage } from './pages/AiTutorPage';
import { TutorChatProvider } from './context/TutorChatContext';
import { FloatingTutorChat } from './components/chat/FloatingTutorChat';

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Personal Quantum Laboratory Dashboard',
  academy: 'Quantum Academy · Curriculum & Foundations',
  gate_explorer: 'Quantum Gate Encyclopedia & Bloch Sphere',
  circuit_studio: 'Interactive Circuit Studio & Qiskit Workspace',
  simulator: 'Statevector Quantum Simulator Engine',
  entanglement: 'Entanglement Playground · Bell States & EPR Correlations',
  quantum_labs: 'Guided Quantum Laboratories (12 Experiments)',
  circuit_debugger: 'Circuit Debugger & Qiskit Code Validator',
  practice_arena: 'Practice Arena · Conceptual Drills & Quizzes',
  assessments: 'Tests & Assessments · 25-Question Examinations',
  ai_tutor: 'Quantum AI Tutor · Intelligent Physics & Circuit Assistant',
  analytics: 'Learning Analytics & Personalized Coach',
  saved_circuits: 'Saved Circuits Library',
  achievements: 'Scientific Milestones & Achievements',
  settings: 'Workstation Settings & Mathematical Proofs',
};

const MainLabApp: React.FC = () => {
  const { studentName, activeTab } = useLab();

  // Sidebar states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // If student has not initialized name yet, show impressive full-screen welcome page!
  if (!studentName) {
    return (
      <>
        <WelcomeScreen />
        <Toast />
      </>
    );
  }

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'academy':
        return <AcademyPage />;
      case 'gate_explorer':
        return <GateExplorerPage />;
      case 'circuit_studio':
        return <CircuitStudioPage />;
      case 'simulator':
        return <SimulatorPage />;
      case 'entanglement':
        return <EntanglementPage />;
      case 'quantum_labs':
        return <QuantumLabsPage />;
      case 'circuit_debugger':
        return <CircuitDebuggerPage />;
      case 'practice_arena':
        return <PracticeArenaPage />;
      case 'assessments':
        return <AssessmentsPage />;
      case 'ai_tutor':
        return <AiTutorPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'saved_circuits':
        return <SavedCircuitsPage />;
      case 'achievements':
        return <AchievementsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const title = TAB_TITLES[activeTab] || 'QuantumGate Cloud Lab';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-700">
      {/* Persistent Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Header
          title={title}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderActiveModule()}
        </main>
      </div>

      {/* Floating AI Tutor Chatbot */}
      <FloatingTutorChat />

      {/* Global Modals & Toast Notifications */}
      <SearchModal />
      <GlossaryModal />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <LabProvider>
      <TutorChatProvider>
        <MainLabApp />
      </TutorChatProvider>
    </LabProvider>
  );
}

export default App;
