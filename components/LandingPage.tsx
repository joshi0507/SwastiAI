
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
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-sky-50 text-sky-700 text-[10px] font-black mb-8 border border-sky-100 uppercase tracking-widest">
              <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
              Pioneering Rural Mobile Healthcare
            </div>
            <h1 className="text-6xl lg:text-8xl font-black font-heading leading-none text-slate-900 mb-10 tracking-tightest">
              Clinic on <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-sky-600 via-indigo-600 to-sky-400">Wheels</span> <br/>
              To Your Village.
            </h1>
            <p className="text-xl text-slate-500 mb-12 max-w-lg leading-relaxed font-bold">
              Solving the 30km gap. SwasthAI brings high-tech diagnostic vans and specialist doctors directly to rural communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/signup" className="group px-12 py-6 bg-sky-600 text-white rounded-[2rem] font-black text-center hover:bg-sky-700 transition-all shadow-[0_20px_40px_-10px_rgba(14,165,233,0.3)] uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                Join the Registry
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/login" className="px-12 py-6 bg-white/50 backdrop-blur-md border border-slate-200 text-slate-700 rounded-[2rem] font-black text-center hover:bg-white hover:border-sky-300 transition-all text-xs uppercase tracking-widest">
                Portal Login
              </Link>
            </div>
          </div>

          <div className="relative ai-doctor-scene reveal active" style={{ transitionDelay: '0.3s' }}>
            <div className="relative float-3d transition-transform duration-300 ease-out" style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}>
              <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-[120px] animate-pulse"></div>
              <div className="relative z-10 glass-card p-6 rounded-[5rem] border-2 border-white/60 shadow-2xl overflow-hidden hologram-effect group">
                <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800" alt="SwasthAI Mobile Medical Unit" className="w-full h-auto rounded-[4rem] group-hover:scale-105 transition-transform duration-1000 object-cover aspect-[4/3]" />
                <div className="absolute bottom-10 left-10 right-10 p-8 glass-card rounded-[2.5rem] border-white/30 backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">🚐</div>
                        <div>
                            <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Live Node</p>
                            <p className="text-lg font-black text-slate-800">Mobile Van Diagnostics Active</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Village Unit #04 - Rampur Station</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div className="reveal">
                      <h2 className="text-4xl lg:text-6xl font-black font-heading mb-10 tracking-tight">Eradicating Rural <br/><span className="text-sky-500">Distance Barriers.</span></h2>
                      <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
                          Why travel 30km when the clinic can come to you? Our Mobile Vans are equipped with laboratory tools for Blood, BP, and Urine analysis, 
                          syncing results instantly with city-based specialists.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl border border-white/10">🚐</div>
                              <div>
                                  <h4 className="font-black text-white uppercase tracking-widest text-[10px] mb-2">10 AM - 6 PM</h4>
                                  <p className="text-slate-500 text-xs font-bold leading-relaxed">Daily operation cycles across designated village clusters.</p>
                              </div>
                          </div>
                          <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl border border-white/10">🧪</div>
                              <div>
                                  <h4 className="font-black text-white uppercase tracking-widest text-[10px] mb-2">Instant Lab</h4>
                                  <p className="text-slate-500 text-xs font-bold leading-relaxed">Diagnostic reports ready for doctor review within 30 minutes.</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="reveal">
                      <div className="bg-white/5 p-10 rounded-[4rem] border border-white/10 backdrop-blur-md">
                          <h3 className="text-2xl font-black mb-10 tracking-tight">Our Mission Stats</h3>
                          <div className="space-y-12">
                              <div>
                                  <div className="flex justify-between mb-3 font-black text-[10px] uppercase tracking-widest">
                                      <span>Villages Covered</span>
                                      <span className="text-sky-400">42+ Clusters</span>
                                  </div>
                                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                      <div className="h-full bg-sky-500 w-[85%] rounded-full shadow-[0_0_20px_rgba(14,165,233,0.5)]"></div>
                                  </div>
                              </div>
                              <div>
                                  <div className="flex justify-between mb-3 font-black text-[10px] uppercase tracking-widest">
                                      <span>Travel Distance Saved</span>
                                      <span className="text-emerald-400">12,400+ KM</span>
                                  </div>
                                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-500 w-[95%] rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-sky-900/10 to-transparent pointer-events-none"></div>
      </section>

      {/* How it works Section */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24 reveal">
          <h2 className="text-5xl font-black font-heading text-slate-900 mb-8 tracking-tighter">How SwasthAI Works.</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-xl font-bold italic">A seamless loop from village to specialist.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Van Arrival", desc: "Check the live tracker on your dashboard for the van's arrival time in your village.", icon: "📍" },
            { step: "02", title: "Diagnostic", desc: "Our Compounder conducts Blood, BP, or Urine tests right inside the mobile unit.", icon: "🔬" },
            { step: "03", title: "AI Sync", desc: "Reports are instantly uploaded to our secure cloud for specialist review.", icon: "☁️" },
            { step: "04", title: "Consultation", desc: "Video call a doctor from the van or your home to discuss results.", icon: "📡" }
          ].map((item, i) => (
            <div key={i} className="reveal p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-8">
                <div className="text-4xl">{item.icon}</div>
                <span className="text-xs font-black text-slate-200 group-hover:text-sky-500 transition-colors uppercase tracking-[0.3em]">{item.step}</span>
              </div>
              <h3 className="text-xl font-black mb-4 text-slate-900">{item.title}</h3>
              <p className="text-slate-500 text-xs font-bold leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto mb-20 reveal">
          <div className="bg-sky-600 rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-sky-200">
              <div className="relative z-10">
                  <h2 className="text-4xl md:text-6xl font-black font-heading text-white mb-10 tracking-tight">Ready to access care?</h2>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <Link to="/signup" className="px-12 py-6 bg-white text-sky-600 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition shadow-xl">Register Now</Link>
                      <Link to="/login" className="px-12 py-6 bg-sky-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-sky-400 transition border border-white/20">Portal Login</Link>
                  </div>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
          </div>
      </section>
    </div>
  );
};

export default LandingPage;
