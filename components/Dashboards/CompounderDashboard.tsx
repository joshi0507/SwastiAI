
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import VideoCallModal from '../VideoCallModal';

interface CompounderDashboardProps {
  user: User;
}

const CompounderDashboard: React.FC<CompounderDashboardProps> = ({ user }) => {
  const [search, setSearch] = useState('');
  const [managedUsers, setManagedUsers] = useState<User[]>([]);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', email: '' });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('managed_users') || '[]');
    setManagedUsers(stored);
  }, []);

  const patients = managedUsers.filter(u => u.role === UserRole.PATIENT && (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())));

  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const created: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPatient.name,
      email: newPatient.email,
      role: UserRole.PATIENT
    };
    const updated = [...managedUsers, created];
    setManagedUsers(updated);
    localStorage.setItem('managed_users', JSON.stringify(updated));
    setIsAddPatientOpen(false);
    setNewPatient({ name: '', email: '' });
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 reveal active">
          <div>
            <h1 className="text-5xl font-black font-heading text-slate-900 tracking-tightest">Compounder Node</h1>
            <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Session: {user.name}</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-80 group">
              <input 
                type="text" 
                placeholder="Find patient..." 
                className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] border-2 border-slate-100 focus:border-sky-500 outline-none bg-white text-slate-900 font-bold"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">🔍</span>
            </div>
            <button 
              onClick={() => setIsAddPatientOpen(true)}
              className="px-8 py-4 bg-sky-600 text-white font-black rounded-2xl hover:bg-sky-700 transition uppercase tracking-widest text-[10px]"
            >
              Add Patient
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6 reveal active" style={{ transitionDelay: '0.1s' }}>
            <div className="bg-white/80 backdrop-blur-md rounded-[3rem] border-2 border-white shadow-2xl overflow-hidden min-h-[500px]">
              <div className="px-10 py-6 bg-slate-50/50 border-b border-slate-100 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Active Patient Registry</div>
              <div className="divide-y divide-slate-50">
                {patients.length > 0 ? patients.map(p => (
                  <div 
                    key={p.id} 
                    className={`p-10 flex items-center justify-between cursor-pointer hover:bg-sky-50 transition-all ${selectedPatient?.id === p.id ? 'bg-sky-50 border-l-8 border-sky-500 shadow-inner' : ''}`}
                    onClick={() => setSelectedPatient(p)}
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-100 flex items-center justify-center font-black text-slate-300 text-3xl transition-all">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 tracking-tight">{p.name}</h4>
                        <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">{p.email}</p>
                      </div>
                    </div>
                    <span className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                      ID: {p.id.slice(0,4)}
                    </span>
                  </div>
                )) : (
                  <div className="p-20 text-center text-slate-300">
                    <p className="text-xl font-black italic">No matches found in registry</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 reveal active" style={{ transitionDelay: '0.2s' }}>
            {selectedPatient ? (
              <div className="bg-white p-12 rounded-[3rem] border-2 border-white shadow-2xl space-y-12 sticky top-24">
                <div className="text-center">
                  <div className="w-24 h-24 bg-sky-50 text-sky-600 rounded-[2rem] mx-auto flex items-center justify-center text-5xl mb-6 shadow-xl shadow-sky-50">👤</div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedPatient.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">Medical ID: {selectedPatient.id}</p>
                </div>

                <div className="space-y-6">
                  <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Lab Operations</h4>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[1.5rem] py-10 cursor-pointer hover:bg-white hover:border-sky-300 transition-all group">
                       <span className="text-4xl mb-4 group-hover:scale-125 transition-transform">📄</span>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Post Diagnostic Report</span>
                       <input type="file" className="hidden" />
                    </label>
                  </div>

                  <button 
                    onClick={() => setIsVideoCallOpen(true)}
                    className="w-full py-6 bg-sky-600 text-white font-black rounded-3xl shadow-2xl shadow-sky-100 hover:bg-sky-700 transition-all active:scale-95 flex items-center justify-center gap-4 video-call-pulse uppercase tracking-widest text-[10px]"
                  >
                    <span>📹</span> Link Doctor for Consult
                  </button>

                  <button className="w-full py-6 bg-white border-2 border-slate-100 text-slate-700 font-black rounded-3xl hover:border-sky-500 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]">
                    Edit Triage Vitals
                  </button>
                </div>
                
                <p className="text-[9px] text-slate-300 text-center font-black uppercase tracking-[0.3em]">Encrypted Workflow Terminal</p>
              </div>
            ) : (
              <div className="h-full min-h-[500px] border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-200 p-16 text-center reveal active">
                <div className="text-8xl mb-8 opacity-20">📂</div>
                <p className="font-black text-xl tracking-tight leading-relaxed">Select a terminal patient to access clinical tools.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Add Patient Modal */}
      {isAddPatientOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden scale-in animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Register Patient</h2>
              <button onClick={() => setIsAddPatientOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center font-bold">✕</button>
            </div>
            <form onSubmit={handleAddPatient} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Patient Full Name</label>
                <input required type="text" className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none bg-white text-slate-900 font-bold" placeholder="e.g. John Doe" value={newPatient.name} onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Registry Email</label>
                <input required type="email" className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none bg-white text-slate-900 font-bold" placeholder="john@example.com" value={newPatient.email} onChange={(e) => setNewPatient({...newPatient, email: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-6 bg-sky-600 text-white font-black rounded-3xl shadow-2xl shadow-sky-100 hover:bg-sky-700 transition-all active:scale-95 uppercase tracking-widest text-[10px]">Add to Local Records</button>
            </form>
          </div>
        </div>
      )}

      <VideoCallModal 
        isOpen={isVideoCallOpen} 
        onClose={() => setIsVideoCallOpen(false)} 
        remoteName={selectedPatient?.name || 'Patient'} 
      />
    </div>
  );
};

export default CompounderDashboard;
