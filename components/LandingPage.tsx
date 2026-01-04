
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientY / window.innerHeight - 0.5) * -15;
      const y = (e.clientX / window.innerWidth - 0.5) * 15;
      setRotation({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div className="z-10 reveal active">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-sky-50 text-sky-700 text-xs font-black mb-8 border border-sky-100 uppercase tracking-widest">
              <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
              Gemini-Powered Diagnosis Engine
            </div>
            <h1 className="text-6xl lg:text-8xl font-black font-heading leading-none text-slate-900 mb-10 tracking-tightest">
              Better <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-sky-600 via-indigo-600 to-sky-400">Healthcare</span> <br/>
              Through AI.
            </h1>
            <p className="text-xl text-slate-500 mb-12 max-w-lg leading-relaxed font-bold">
              The first truly intelligent medical platform connecting patients, doctors, and data in one secure 3D ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/signup" className="group px-12 py-6 bg-sky-600 text-white rounded-[2rem] font-black text-center hover:bg-sky-700 transition-all shadow-[0_20px_40px_-10px_rgba(14,165,233,0.3)] uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                Get Started
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/login" className="px-12 py-6 bg-white/50 backdrop-blur-md border border-slate-200 text-slate-700 rounded-[2rem] font-black text-center hover:bg-white hover:border-sky-300 transition-all text-xs uppercase tracking-widest">
                Portal Login
              </Link>
            </div>
          </div>

          {/* 3D AI Doctor Visual - Holographic Style */}
          <div className="relative ai-doctor-scene reveal active" style={{ transitionDelay: '0.3s' }}>
            <div 
              className="relative float-3d transition-transform duration-300 ease-out"
              style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-[120px] animate-pulse"></div>
              
              <div className="relative z-10 glass-card p-6 rounded-[5rem] border-2 border-white/60 shadow-[0_50px_100px_-20px_rgba(14,165,233,0.3)] overflow-hidden hologram-effect group">
                <img 
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800" 
                  alt="AI Doctor" 
                  className="w-full h-auto rounded-[4rem] group-hover:scale-105 transition-transform duration-1000"
                />
                
                {/* Floating UI Elements Over Image */}
                <div className="absolute top-10 right-10 flex flex-col gap-3">
                  <div className="glass-card px-4 py-2 rounded-2xl flex items-center gap-2 border-white/30 animate-bounce">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span className="text-[10px] font-black uppercase text-slate-700">Heart: 72 BPM</span>
                  </div>
                </div>
              </div>

              {/* Orbital Cards */}
              <div className="absolute -top-12 -left-12 glass-card p-6 rounded-3xl shadow-2xl border border-white/50 animate-pulse" style={{ animationDuration: '4s' }}>
                <p className="text-[9px] font-black text-sky-600 uppercase tracking-widest mb-1">AI Processor</p>
                <p className="text-sm font-black text-slate-800 tracking-tight">Real-time Analysis</p>
              </div>

              <div className="absolute -bottom-10 -right-6 glass-card p-6 rounded-3xl shadow-2xl border border-white/50 animate-pulse" style={{ animationDuration: '5s' }}>
                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Security Core</p>
                <p className="text-sm font-black text-slate-800 tracking-tight">Zero-Trust Auth</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24 reveal">
          <h2 className="text-5xl font-black font-heading text-slate-900 mb-8 tracking-tighter">Medical Mastery.</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-xl font-bold italic">Where human compassion meets algorithmic precision.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: "Smart Diagnostics", desc: "Automated symptom triage using LLM-based reasoning.", icon: "🧠", delay: 0 },
            { title: "Unified Registry", desc: "Securely managed by system administrators and clinical staff.", icon: "📋", delay: 100 },
            { title: "Live Consults", desc: "HD video infrastructure with built-in vitals streaming.", icon: "📡", delay: 200 }
          ].map((feat, i) => (
            <div key={i} className="reveal group p-12 glass-card rounded-[4rem] border border-slate-100 hover:scale-105 transition-all duration-500" style={{ transitionDelay: `${feat.delay}ms` }}>
              <div className="text-5xl mb-10 group-hover:scale-125 transition-transform duration-500 inline-block">{feat.icon}</div>
              <h3 className="text-2xl font-black mb-4 text-slate-900 tracking-tight">{feat.title}</h3>
              <p className="text-slate-500 leading-relaxed font-bold text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
