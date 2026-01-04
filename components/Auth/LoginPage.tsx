
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole, User } from '../../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Required fields are missing.');
      return;
    }

    // Dynamic Admin Check
    const adminSettings = JSON.parse(localStorage.getItem('admin_settings') || '{"email": "admin@swasti.com", "password": "admin123"}');
    if (email === adminSettings.email && password === adminSettings.password && role === UserRole.ADMIN) {
      onLogin({
        id: 'admin-1',
        name: 'System Administrator',
        email: adminSettings.email,
        role: UserRole.ADMIN
      });
      navigate('/dashboard');
      return;
    }

    // Check managed users (Doctors, Compounders, and Patients added by staff)
    const storedUsers: User[] = JSON.parse(localStorage.getItem('managed_users') || '[]');
    const matchedUser = storedUsers.find(u => u.email === email && u.role === role);

    if (matchedUser) {
      // In a real app we'd verify password. For this mock, we match email + role.
      onLogin(matchedUser);
      navigate('/dashboard');
      return;
    }

    // Patient Registration Login (Mock)
    if (role === UserRole.PATIENT) {
      onLogin({
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email: email,
        role: UserRole.PATIENT
      });
      navigate('/dashboard');
    } else {
      setError('Account not found for selected portal.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-6 py-12">
      <div className="max-w-md w-full glass-card rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border-2 border-white p-12 reveal active">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-sky-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-8 shadow-2xl shadow-sky-200">S+</div>
          <h2 className="text-4xl font-black font-heading text-slate-900 tracking-tight">Login Portal</h2>
          <p className="text-slate-500 mt-3 font-bold uppercase tracking-widest text-[10px]">Access Secure Node</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-[10px] font-black border border-red-100 uppercase tracking-wider">{error}</div>}
          
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Select Portal</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-100 focus:border-sky-500 transition-all outline-none bg-white text-slate-900 font-bold"
            >
              <option value={UserRole.PATIENT}>Patient</option>
              <option value={UserRole.DOCTOR}>Doctor</option>
              <option value={UserRole.COMPOUNDER}>Compounder</option>
              <option value={UserRole.ADMIN}>System Admin</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Identity</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-100 focus:border-sky-500 outline-none bg-white text-slate-900 font-bold"
              placeholder="e.g. admin@swasti.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Security Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-100 focus:border-sky-500 outline-none bg-white text-slate-900 font-bold"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-sky-600 text-white rounded-[2rem] font-black hover:bg-sky-700 transition-all shadow-2xl shadow-sky-100 active:scale-[0.96] uppercase tracking-[0.2em] text-xs"
          >
            Access Dashboard
          </button>
        </form>

        {role === UserRole.PATIENT && (
          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              New to the platform? <Link to="/signup" className="text-sky-600 hover:underline ml-1">Create Registry</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
