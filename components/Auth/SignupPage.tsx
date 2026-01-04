
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole, User } from '../../types';

interface SignupPageProps {
  onLogin: (user: User) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      role: UserRole.PATIENT
    };

    onLogin(mockUser);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-6 py-12">
      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white overflow-hidden reveal">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-2 bg-slate-900 p-10 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-6">Patient Portal Registration</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">Access SwasthAI features like AI assistance, history tracking, and video consultations.</p>
              
              <ul className="space-y-4">
                {['Book Doctors', 'Upload Reports', '24/7 AI Support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold">
                    <span className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-12">
              <p className="text-xs text-slate-500">Already have an account?</p>
              <Link to="/login" className="text-sky-400 font-bold hover:underline">Sign In Instead</Link>
            </div>
          </div>

          <div className="md:col-span-3 p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input name="name" required onChange={handleInputChange} type="text" className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white text-slate-900" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
                  <input name="phone" required onChange={handleInputChange} type="tel" className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white text-slate-900" placeholder="+91..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input name="email" required onChange={handleInputChange} type="email" className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white text-slate-900" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                <input name="password" required onChange={handleInputChange} type="password" className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white text-slate-900" placeholder="••••••••" />
              </div>

              <div className="flex items-start gap-3 p-4 bg-sky-50 rounded-2xl">
                <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-slate-300 text-sky-600" />
                <p className="text-[10px] text-sky-800 leading-tight">By creating an account, I agree to the healthcare data processing policies of SwasthAI.</p>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-sky-600 text-white rounded-2xl font-bold hover:bg-sky-700 transition-all shadow-xl shadow-sky-100 active:scale-[0.98]"
              >
                Create My Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
