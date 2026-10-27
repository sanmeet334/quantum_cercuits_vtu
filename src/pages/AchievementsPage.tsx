import React from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  BookOpen,
  Cpu,
  GitFork,
  Activity,
  Layers,
  Share2,
  FlaskConical,
  Target,
  Zap,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLab } from '../context/LabContext';
import { ACHIEVEMENTS_DATA, Achievement } from '../data/achievementsData';

export const AchievementsPage: React.FC = () => {
  const { unlockedAchievements, showToast } = useLab();

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Sparkles,
    BookOpen,
    Cpu,
    GitFork,
    Activity,
    Layers,
    Share2,
    FlaskConical,
    Target,
    Award,
    Zap,
  };

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS_DATA.length;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);

  const handleCelebrate = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981'],
      });
      showToast('success', 'Quantum Excellence', 'Honoring your scientific milestone progress!');
    } catch {}
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-2">
            <Trophy className="w-3.5 h-3.5 text-cyan-400" />
            <span>Honors & Scientific Badges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
            Quantum Mastery Achievements
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Achievements unlock only when verifiable experimental and academic milestones are achieved in the simulator and labs.
          </p>
        </div>

        {/* Progress Display */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 shrink-0 w-full sm:w-56 text-center">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>Unlocked</span>
            <span className="text-cyan-400 font-bold">{unlockedCount} / {totalCount}</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <button
            onClick={handleCelebrate}
            className="mt-3 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
          >
            Celebrate Progress
          </button>
        </div>
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS_DATA.map((ach) => {
          const isUnlocked = unlockedAchievements.includes(ach.id);
          const Icon = iconMap[ach.iconName] || Award;

          return (
            <div
              key={ach.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${
                      isUnlocked
                        ? 'bg-emerald-950/60 border-emerald-800/40 text-emerald-400 flex items-center gap-1'
                        : 'bg-slate-900 border-slate-800 text-slate-500 flex items-center gap-1'
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Unlocked</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>Locked</span>
                      </>
                    )}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1 font-display">
                  {ach.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {ach.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-0.5">
                  Unlock Condition:
                </span>
                <p className="text-xs font-mono text-cyan-300">
                  {ach.requirement}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
