import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Atom, ShieldCheck, Binary } from 'lucide-react';
import { useLab } from '../../context/LabContext';

export const WelcomeScreen: React.FC = () => {
  const { setStudentName } = useLab();
  const [nameInput, setNameInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated quantum particle canvas background for white theme
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = 40;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1.2,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw light particles and soft blue lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;
        p1.phase += 0.02;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw particle node
        const glow = Math.sin(p1.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${glow * 0.6})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setErrorMsg('Please enter your name to initialize your laboratory.');
      return;
    }
    if (trimmed.length < 2) {
      setErrorMsg('Name must be at least 2 characters.');
      return;
    }
    if (trimmed.length > 50) {
      setErrorMsg('Name must be 50 characters or fewer.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setStudentName(trimmed);
    }, 350);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-slate-50 text-slate-900 px-4 py-8">
      {/* Particle background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-70" />

      {/* Subtle radial ambient glows in white theme */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Card */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col md:flex-row items-stretch bg-white border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden">
        {/* Left Side: Laboratory Visual & Track Banner */}
        <div className="md:w-1/2 relative bg-slate-50 flex flex-col justify-between p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-200">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] mb-6 shadow-sm group">
            <img
              src="/src/assets/images/welcome_quantum_lab_1793102811852.jpg"
              alt="Futuristic Quantum Computing Laboratory"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-xs text-white font-mono flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-blue-200">
                <Atom className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Cryogenic QPU Engine</span>
              </span>
              <span className="text-slate-200">15 mK Base Temp</span>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-700 font-semibold mb-2 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>Track 5 · Quantum Cloud Applications</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-display mb-2">
              QuantumGate Cloud Lab
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Your browser-based interactive quantum simulator, gate laboratory, and comprehensive learning academy.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-mono">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <Binary className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Statevector Math</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Zero Account Req.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Name-Only Entry Form */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Personal Laboratory Initialization</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-display tracking-tight mb-2">
              Welcome to the Quantum Frontier
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Enter your name to initialize your personalized quantum workstation, saved circuits, and learning analytics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="studentName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Student Name
              </label>
              <div className="relative">
                <input
                  id="studentName"
                  type="text"
                  autoFocus
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="e.g. Richard Feynman, Ada Lovelace..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-xs"
                />
              </div>
              {errorMsg && (
                <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Calibrating Qubits...' : 'Enter Quantum Laboratory'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-slate-500 leading-relaxed pt-2">
              No password or cloud registration required. Your workspace is secured and preserved locally.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
