
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [managedUsers, setManagedUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.DOCTOR);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: UserRole.DOCTOR, specialization: '' });
  
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
      role: newUser.role,
      specialization: newUser.specialization
    };
    saveUsers([...managedUsers, created]);
    setIsAddModalOpen(false);
    setNewUser({ name: '', email: '', role: UserRole.DOCTOR, specialization: '' });
  };

  const handleUpdateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('admin_settings', JSON.stringify(adminCreds));
    setIsAdminSettingsOpen(false);
    alert('System Security Protocol Updated. Please use new credentials next login.');
  };

  const deleteUser = (id: string) => {
    if (confirm('Permanently remove this user from registry?')) {
      saveUsers(managedUsers.filter(u => u.id !== id));
    }
  };

  const filteredUsers = managedUsers.filter(u => u.role === activeTab);

  return (
    <div className="min-h-screen p-6 md:p-12 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 reveal active">
          <div>
            <h1 className="text-5xl font-black font-heading text-slate-900 tracking-tightest">Admin Core</h1>
            <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Registry Node: {adminCreds.email}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAdminSettingsOpen(true)}
              className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-900 font-black rounded-2xl hover:border-sky-300 transition uppercase tracking-widest text-[10px]"
            >
              Security Settings
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition shadow-2xl hover:scale-105 uppercase tracking-widest text-[10px]"
            >
              Add Personnel
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1 reveal active">
            <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border-2 border-white shadow-xl overflow-hidden sticky top-24">
              <div className="p-6 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Filter</div>
              <div className="p-4 space-y-2">
                {[
                  { id: UserRole.DOCTOR, label: 'Doctors', icon: '🩺' },
                  { id: UserRole.COMPOUNDER, label: 'Compounders', icon: '🏥' },
                  { id: UserRole.PATIENT, label: 'Patients', icon: '👥' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as UserRole)}
                    className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] font-black transition-all text-xs ${
                      activeTab === tab.id ? 'bg-sky-600 text-white shadow-xl shadow-sky-100' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8 reveal active">
            <div className="bg-white/80 backdrop-blur-md rounded-[3rem] border-2 border-white shadow-2xl overflow-hidden min-h-[600px]">
              <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{activeTab} Registry</h3>
                <span className="text-[10px] font-black bg-white border border-slate-100 px-4 py-1.5 rounded-full text-slate-400 uppercase tracking-widest">{filteredUsers.length} Recorded</span>
              </div>
              <div className="p-10">
                {filteredUsers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredUsers.map(u => (
                      <div key={u.id} className="p-8 rounded-[2rem] border border-slate-100 bg-white hover:shadow-2xl hover:border-sky-100 transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-6 transition-transform">👤</div>
                          <div>
                            <p className="font-black text-slate-900 tracking-tight">{u.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{u.email}</p>
                            {u.specialization && <p className="text-[9px] bg-sky-50 text-sky-700 px-3 py-1 rounded-full mt-2 inline-block font-black uppercase tracking-widest">{u.specialization}</p>}
                          </div>
                        </div>
                        <button onClick={() => deleteUser(u.id)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-600 transition-all">🗑️</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-slate-200">
                    <div className="text-7xl mb-6 grayscale opacity-50">📁</div>
                    <p className="font-black text-xl tracking-tight">System Registry is Empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Settings Modal */}
      {isAdminSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Security Portal</h2>
              <button onClick={() => setIsAdminSettingsOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center font-bold">✕</button>
            </div>
            <form onSubmit={handleUpdateAdmin} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Admin Identity (Email)</label>
                <input 
                  required 
                  type="email" 
                  className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none bg-white text-slate-900 font-bold focus:border-sky-500" 
                  value={adminCreds.email} 
                  onChange={(e) => setAdminCreds({...adminCreds, email: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Master Key (Password)</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none bg-white text-slate-900 font-bold focus:border-sky-500" 
                  value={adminCreds.password} 
                  onChange={(e) => setAdminCreds({...adminCreds, password: e.target.value})} 
                />
              </div>
              <button type="submit" className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl shadow-2xl hover:bg-black transition-all uppercase tracking-widest text-[10px]">Update Root Access</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Personnel Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden scale-in">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Staff Registration</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center font-bold">✕</button>
            </div>
            <form onSubmit={addUser} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Selection Profile</label>
                <select 
                  className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none bg-white text-slate-900 font-black"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                >
                  <option value={UserRole.DOCTOR}>Medical Doctor</option>
                  <option value={UserRole.COMPOUNDER}>Compounder / Lab</option>
                  <option value={UserRole.PATIENT}>Patient Entry</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Legal Name</label>
                <input required type="text" className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none bg-white text-slate-900 font-bold" placeholder="Dr. John Smith" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Operational Email</label>
                <input required type="email" className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none bg-white text-slate-900 font-bold" placeholder="john@swasthai.com" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
              </div>
              {newUser.role === UserRole.DOCTOR && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Specialty Domain</label>
                  <input type="text" className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none bg-white text-slate-900 font-bold" placeholder="Cardiology" value={newUser.specialization} onChange={(e) => setNewUser({...newUser, specialization: e.target.value})} />
                </div>
              )}
              <button type="submit" className="w-full py-6 bg-sky-600 text-white font-black rounded-3xl shadow-2xl hover:bg-sky-700 transition-all uppercase tracking-widest text-[10px]">Verify & Add to Registry</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
