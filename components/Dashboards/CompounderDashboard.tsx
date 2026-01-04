
import React, { useState, useEffect } from 'react';
import { User, UserRole, HealthRecord } from '../../types';
import VideoCallModal from '../VideoCallModal';

interface CompounderDashboardProps {
  user: User;
}

const CompounderDashboard: React.FC<CompounderDashboardProps> = ({ user }) => {
  const [search, setSearch] = useState('');
  const [managedUsers, setManagedUsers] = useState<User[]>([]);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', email: '', password: '123' });
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('managed_users') || '[]');
    setManagedUsers(stored);
  }, []);

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.email) return;

    const created: User = { 
      id: Math.random().toString(36).substr(2, 9), 
      name: newPatient.name, 
      email: newPatient.email, 
      password: newPatient.password,
      role: UserRole.PATIENT 
    };
    const updated = [...managedUsers, created];
    localStorage.setItem('managed_users', JSON.stringify(updated));
    setManagedUsers(updated);
    setIsAddPatientOpen(false);
    setNewPatient({ name: '', email: '', password: '123' });
    alert(`Patient ${created.name} added to Village Registry.`);
  };

  const uploadReport = (testLabel: string, testType: 'BLOOD_TEST' | 'BP_TEST' | 'URINE_TEST') => {
      if (!selectedPatient) {
          alert("Please select a patient first.");
          return;
      }
      
      const newRecord: HealthRecord = {
          id: Math.random().toString(36).substr(2, 9),
          patientId: selectedPatient.id,
          title: `${testLabel} Report`,
          date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          type: testType,
          url: '#',
          uploadedBy: `Compounder ${user.name} (Unit #04)`
      };

      const storedRecords: HealthRecord[] = JSON.parse(localStorage.getItem('swasth_health_records') || '[]');
      localStorage.setItem('swasth_health_records', JSON.stringify([newRecord, ...storedRecords]));
      
      alert(`${testLabel} successfully uploaded for ${selectedPatient.name}. Doctor portal updated.`);
  };

  const patients = managedUsers.filter(u => 
    u.role === UserRole.PATIENT && 
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen p-6 md:p-12 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 reveal active">
          <div>
            <h1 className="text-5xl font-black font-heading text-slate-900 tracking-tightest">Mobile Lab Unit</h1>
            <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">On-Duty: {user.name} | Village Station: Active</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
                <input 
                  type="text" 
                  placeholder="Patient Search..." 
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 font-black outline-none focus:border-sky-500 placeholder:text-slate-300 shadow-sm" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
            </div>
            <button onClick={() => setIsAddPatientOpen(true)} className="px-8 py-4 bg-sky-600 text-white font-black rounded-2xl hover:bg-sky-700 transition uppercase tracking-widest text-[10px] shadow-lg shadow-sky-100">Add Patient</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <main className="lg:col-span-2 reveal active">
            <div className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-2xl overflow-hidden divide-y divide-slate-50">
                <div className="px-10 py-6 font-black text-slate-400 text-[10px] uppercase tracking-widest bg-slate-50/50">Village Queue List</div>
                {patients.length > 0 ? patients.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => setSelectedPatient(p)} 
                      className={`p-10 flex items-center justify-between cursor-pointer transition-all ${selectedPatient?.id === p.id ? 'bg-sky-50 border-l-8 border-sky-600' : 'hover:bg-slate-50'}`}
                    >
                        <div className="flex items-center gap-8">
                            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-2xl text-slate-400">{p.name.charAt(0)}</div>
                            <div>
                                <h4 className="text-lg font-black text-slate-900 tracking-tight">{p.name}</h4>
                                <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">{p.email}</p>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="p-20 text-center text-slate-300 font-black italic">Search for patients to begin testing.</div>
                )}
            </div>
          </main>

          <aside className="reveal active">
              {selectedPatient ? (
                  <div className="bg-white p-12 rounded-[3.5rem] border-2 border-slate-50 shadow-2xl space-y-12 sticky top-24">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-sky-50 text-sky-600 rounded-3xl mx-auto flex items-center justify-center text-5xl mb-6 shadow-xl shadow-sky-50 border border-sky-100">👤</div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selectedPatient.name}</h3>
                        <p className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-widest">Village ID: {selectedPatient.id.slice(0,6).toUpperCase()}</p>
                      </div>

                      <div className="space-y-6">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-50 pb-4">Mobile Lab Test Suite</h4>
                          
                          {/* Test Buttons - High Visibility and Working */}
                          <div className="grid grid-cols-1 gap-4">
                              <button 
                                onClick={() => uploadReport('Blood Sample', 'BLOOD_TEST')} 
                                className="flex items-center justify-between p-6 rounded-[2rem] bg-rose-600 hover:bg-rose-700 transition-all font-black text-white group shadow-xl shadow-rose-100"
                              >
                                  <div className="flex items-center gap-4">
                                    <span className="text-2xl bg-white/20 w-12 h-12 flex items-center justify-center rounded-xl">🩸</span>
                                    <span className="text-sm uppercase tracking-widest">Blood Test</span>
                                  </div>
                                  <span className="text-[10px] font-black">⬆️</span>
                              </button>

                              <button 
                                onClick={() => uploadReport('Blood Pressure', 'BP_TEST')} 
                                className="flex items-center justify-between p-6 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 transition-all font-black text-white group shadow-xl shadow-indigo-100"
                              >
                                  <div className="flex items-center gap-4">
                                    <span className="text-2xl bg-white/20 w-12 h-12 flex items-center justify-center rounded-xl">🫀</span>
                                    <span className="text-sm uppercase tracking-widest">BP Checkup</span>
                                  </div>
                                  <span className="text-[10px] font-black">⬆️</span>
                              </button>

                              <button 
                                onClick={() => uploadReport('Urine Test', 'URINE_TEST')} 
                                className="flex items-center justify-between p-6 rounded-[2rem] bg-amber-600 hover:bg-amber-700 transition-all font-black text-white group shadow-xl shadow-amber-100"
                              >
                                  <div className="flex items-center gap-4">
                                    <span className="text-2xl bg-white/20 w-12 h-12 flex items-center justify-center rounded-xl">🧪</span>
                                    <span className="text-sm uppercase tracking-widest">Urine analysis</span>
                                  </div>
                                  <span className="text-[10px] font-black">⬆️</span>
                              </button>
                          </div>

                          <div className="pt-8 space-y-4">
                              <button onClick={() => setIsVideoCallOpen(true)} className="w-full py-7 bg-slate-900 text-white font-black rounded-[2.5rem] shadow-2xl hover:bg-black transition uppercase tracking-[0.2em] text-[10px] video-call-pulse">Contact On-Call Doctor</button>
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="h-full min-h-[500px] border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-200 p-16 text-center font-black">
                      <div className="text-8xl mb-10 opacity-10">🚐</div>
                      Select a patient from the village queue to launch diagnostic tools.
                  </div>
              )}
          </aside>
        </div>
      </div>

      <VideoCallModal isOpen={isVideoCallOpen} onClose={() => setIsVideoCallOpen(false)} remoteName={selectedPatient?.name || 'Patient'} />

      {/* Add Patient Modal */}
      {isAddPatientOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[3.5rem] shadow-2xl p-12 relative border border-white scale-in">
            <button onClick={() => setIsAddPatientOpen(false)} className="absolute top-10 right-10 w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-900 rounded-full font-black text-xl hover:bg-red-50 hover:text-red-600 transition-all">✕</button>
            <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">New Patient Entry</h2>
            <form onSubmit={handleAddPatient} className="space-y-8">
              <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest ml-1">Legal Full Name</label>
                  <input required className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-slate-50 text-slate-900 font-black outline-none focus:bg-white focus:border-sky-500 transition-all" placeholder="Enter name" value={newPatient.name} onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} />
              </div>
              <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest ml-1">Digital Identity (Email)</label>
                  <input required type="email" className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-slate-50 text-slate-900 font-black outline-none focus:bg-white focus:border-sky-500 transition-all" placeholder="patient@swasthai.com" value={newPatient.email} onChange={(e) => setNewPatient({...newPatient, email: e.target.value})} />
              </div>
              <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest ml-1">Portal Password</label>
                  <input required className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-slate-50 text-slate-900 font-black outline-none focus:bg-white focus:border-sky-500 transition-all" placeholder="Default: 123" value={newPatient.password} onChange={(e) => setNewPatient({...newPatient, password: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-6 bg-sky-600 text-white font-black rounded-3xl shadow-xl hover:bg-sky-700 uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02]">Sync to Village Registry</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompounderDashboard;
