
import React, { useState, useEffect } from 'react';
import { User, UserRole, AmbulanceStatus } from '../../types';

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [managedUsers, setManagedUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<UserRole | 'AMBULANCE'>(UserRole.DOCTOR);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);
  
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: UserRole.DOCTOR, specialization: '' });
  
  const [ambulance, setAmbulance] = useState<AmbulanceStatus>(() => {
    return JSON.parse(localStorage.getItem('swasth_ambulance') || '{"village": "Rampur", "arrivalTime": "10:30 AM", "status": "ON_ROUTE", "location": "NH-24 Near Village Entry"}');
  });

  const [adminCreds, setAdminCreds] = useState(() => {
    return JSON.parse(localStorage.getItem('admin_settings') || '{"email": "admin@swasti.com", "password": "admin123"}');
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('managed_users') || '[]');
    setManagedUsers(stored);
  }, []);

  const saveUsers = (users: User[]) => {
    setManagedUsers(users);
    localStorage.setItem('managed_users', JSON.stringify(users));
  };

  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    const created: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name,
      email: newUser.email,
      password: newUser.password, // Storing password for login
      role: newUser.role,
      specialization: newUser.specialization
    };
    saveUsers([...managedUsers, created]);
    setIsAddModalOpen(false);
    setNewUser({ name: '', email: '', password: '', role: UserRole.DOCTOR, specialization: '' });
  };

  const updateAmbulance = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('swasth_ambulance', JSON.stringify(ambulance));
    alert('Mobile Clinic status broadcasted to all patient dashboards.');
  };

  const deleteUser = (id: string) => {
    if (confirm('Permanently remove this user?')) {
      saveUsers(managedUsers.filter(u => u.id !== id));
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 reveal active">
          <div>
            <h1 className="text-5xl font-black font-heading text-slate-900 tracking-tightest">Admin Core</h1>
            <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Session: {adminCreds.email}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setIsAdminSettingsOpen(true)} className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-900 font-black rounded-2xl hover:border-sky-300 transition uppercase tracking-widest text-[10px]">Security Settings</button>
            <button onClick={() => setIsAddModalOpen(true)} className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition shadow-2xl hover:scale-105 uppercase tracking-widest text-[10px]">Add Personnel</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <aside className="lg:col-span-1 reveal active">
            <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border-2 border-white shadow-xl p-4 space-y-2 sticky top-24">
              <button onClick={() => setActiveTab(UserRole.DOCTOR)} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest ${activeTab === UserRole.DOCTOR ? 'bg-sky-600 text-white' : 'text-slate-500'}`}>Doctors</button>
              <button onClick={() => setActiveTab(UserRole.COMPOUNDER)} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest ${activeTab === UserRole.COMPOUNDER ? 'bg-sky-600 text-white' : 'text-slate-500'}`}>Compounders</button>
              <button onClick={() => setActiveTab(UserRole.PATIENT)} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest ${activeTab === UserRole.PATIENT ? 'bg-sky-600 text-white' : 'text-slate-500'}`}>Patients</button>
              <button onClick={() => setActiveTab('AMBULANCE')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest ${activeTab === 'AMBULANCE' ? 'bg-sky-600 text-white' : 'text-slate-500'}`}>🚐 Mobile Van</button>
            </div>
          </aside>

          <main className="lg:col-span-3 reveal active">
            <div className="bg-white/80 rounded-[3rem] border-2 border-white shadow-2xl overflow-hidden min-h-[600px] p-10">
              {activeTab === 'AMBULANCE' ? (
                <div className="max-w-lg">
                  <h2 className="text-3xl font-black mb-8 text-slate-900">Mobile Clinic Deployment</h2>
                  <form onSubmit={updateAmbulance} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Target Village</label>
                        <input className="w-full p-5 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-bold" value={ambulance.village} onChange={(e) => setAmbulance({...ambulance, village: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">ETA (Arrival Time)</label>
                        <input className="w-full p-5 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-bold" value={ambulance.arrivalTime} onChange={(e) => setAmbulance({...ambulance, arrivalTime: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Live Location Hint</label>
                        <input className="w-full p-5 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-bold" value={ambulance.location} onChange={(e) => setAmbulance({...ambulance, location: e.target.value})} />
                    </div>
                    <button type="submit" className="w-full py-6 bg-sky-600 text-white font-black rounded-3xl shadow-xl hover:bg-sky-700 uppercase tracking-widest text-[10px]">Update & Broadcast</button>
                  </form>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-black mb-8 text-slate-900">{activeTab} Registry</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {managedUsers.filter(u => u.role === activeTab).map(u => (
                      <div key={u.id} className="p-8 rounded-[2rem] border border-slate-100 bg-white flex items-center justify-between group">
                        <div>
                          <p className="font-black text-slate-900">{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{u.email}</p>
                        </div>
                        <button onClick={() => deleteUser(u.id)} className="text-slate-300 hover:text-red-500">🗑️</button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 relative">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-8 right-8 text-slate-900 font-black text-2xl hover:scale-110 transition-transform">✕</button>
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Add Registry Staff</h2>
            <form onSubmit={addUser} className="space-y-6">
              <select className="w-full p-5 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-black" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}>
                <option value={UserRole.DOCTOR}>Doctor</option>
                <option value={UserRole.COMPOUNDER}>Compounder</option>
                <option value={UserRole.PATIENT}>Patient</option>
              </select>
              <input required className="w-full p-5 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-bold" placeholder="Full Name" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
              <input required type="email" className="w-full p-5 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-bold" placeholder="Email Address" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
              <input required className="w-full p-5 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-bold" placeholder="Login Password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
              <button type="submit" className="w-full py-6 bg-sky-600 text-white font-black rounded-3xl shadow-xl hover:bg-sky-700 uppercase tracking-widest text-[10px]">Verify & Commit</button>
            </form>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {isAdminSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 relative">
            <button onClick={() => setIsAdminSettingsOpen(false)} className="absolute top-8 right-8 text-slate-900 font-black text-2xl hover:scale-110 transition-transform">✕</button>
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Security Portal</h2>
            <form onSubmit={(e) => { e.preventDefault(); localStorage.setItem('admin_settings', JSON.stringify(adminCreds)); setIsAdminSettingsOpen(false); alert('System Updated.'); }} className="space-y-6">
              <input required type="email" className="w-full p-5 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-bold" value={adminCreds.email} onChange={(e) => setAdminCreds({...adminCreds, email: e.target.value})} />
              <input required className="w-full p-5 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-bold" value={adminCreds.password} onChange={(e) => setAdminCreds({...adminCreds, password: e.target.value})} />
              <button type="submit" className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl shadow-xl uppercase tracking-widest text-[10px]">Update Root Access</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
