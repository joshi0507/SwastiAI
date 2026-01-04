
import React, { useState, useEffect } from 'react';
import { User, Appointment, HealthRecord, UserRole } from '../../types';
import HealthAssistant from '../HealthAssistant';
import VideoCallModal from '../VideoCallModal';

interface PatientDashboardProps {
  user: User;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user }) => {
  const [doctors, setDoctors] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [activeCallDoctor, setActiveCallDoctor] = useState('');
  
  const [bookingForm, setBookingForm] = useState({
    doctorId: '',
    doctorName: '',
    date: '',
    time: '',
    type: 'VIDEO' as 'VIDEO' | 'IN_PERSON'
  });

  useEffect(() => {
    // Load Doctors from central registry
    const storedUsers: User[] = JSON.parse(localStorage.getItem('managed_users') || '[]');
    const doctorList = storedUsers.filter(u => u.role === UserRole.DOCTOR);
    setDoctors(doctorList);

    // Load Appointments
    const storedAppts: Appointment[] = JSON.parse(localStorage.getItem('swasth_appointments') || '[]');
    setAppointments(storedAppts.filter(a => a.patientId === user.id));
  }, [user.id]);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.doctorId) return alert('Please select a doctor.');

    const selectedDoc = doctors.find(d => d.id === bookingForm.doctorId);
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: user.id,
      patientName: user.name,
      doctorId: bookingForm.doctorId,
      doctorName: selectedDoc?.name || 'Assigned Staff',
      date: bookingForm.date,
      time: bookingForm.time,
      status: 'CONFIRMED',
      type: bookingForm.type
    };

    const allAppts = JSON.parse(localStorage.getItem('swasth_appointments') || '[]');
    const updatedAll = [newAppointment, ...allAppts];
    localStorage.setItem('swasth_appointments', JSON.stringify(updatedAll));
    
    setAppointments([newAppointment, ...appointments]);
    setIsBookingModalOpen(false);
    alert('Medical Session Confirmed.');
  };

  return (
    <div className="bg-transparent min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 reveal active">
          <div>
            <h1 className="text-5xl font-black font-heading text-slate-900 tracking-tightest">Your Care Portal</h1>
            <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Patient Profile: {user.name}</p>
          </div>
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="px-8 py-4 bg-sky-600 text-white font-black rounded-2xl hover:bg-sky-700 transition shadow-2xl shadow-sky-100 hover:scale-105 uppercase tracking-widest text-[10px]"
          >
            Consult New Doctor
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
             {/* Vitals Feed */}
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 reveal active">
              {[
                { label: 'Pulse', val: '74 bpm', color: 'text-rose-500', bg: 'bg-rose-50/50' },
                { label: 'Pressure', val: '118/79', color: 'text-sky-500', bg: 'bg-sky-50/50' },
                { label: 'O2 Sat', val: '99%', color: 'text-indigo-500', bg: 'bg-indigo-50/50' },
                { label: 'Glucose', val: '90 mg/dl', color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
              ].map((vital, i) => (
                <div key={i} className={`p-6 rounded-[2.5rem] glass-card ${vital.bg} border-white shadow-sm hover:scale-105 transition-all`}>
                  <p className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-[0.2em]">{vital.label}</p>
                  <p className={`text-2xl font-black ${vital.color} tracking-tight`}>{vital.val}</p>
                </div>
              ))}
            </div>

            <section className="glass-card p-10 rounded-[3rem] shadow-xl reveal active">
              <h2 className="text-2xl font-black mb-8 text-slate-900">Medical Schedule</h2>
              <div className="space-y-6">
                {appointments.length > 0 ? appointments.map(apt => (
                  <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-8 rounded-[2rem] border border-slate-100 bg-white/40 hover:bg-white transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        {apt.type === 'VIDEO' ? '📹' : '🏥'}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">{apt.doctorName}</h3>
                        <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">{apt.date} • {apt.time}</p>
                      </div>
                    </div>
                    {apt.type === 'VIDEO' && (
                      <button 
                        onClick={() => { setActiveCallDoctor(apt.doctorName); setIsVideoCallOpen(true); }}
                        className="px-6 py-3 bg-sky-600 text-white font-black rounded-xl text-[9px] hover:bg-sky-700 shadow-xl transition-all uppercase tracking-widest video-call-pulse mt-4 sm:mt-0"
                      >
                        Join Virtual Room
                      </button>
                    )}
                  </div>
                )) : (
                  <div className="p-10 text-center text-slate-300 font-black italic">No consultations on file</div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-10 reveal active">
            <HealthAssistant />
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
               <h3 className="text-xl font-black mb-3 tracking-tight">AI Diagnostic Node</h3>
               <p className="text-slate-400 text-[10px] font-black leading-relaxed mb-8 uppercase tracking-widest">Global medical context active.</p>
               <button className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-sky-400 hover:text-white transition-all">Start Triage</button>
            </div>
          </aside>
        </div>
      </div>

      <VideoCallModal isOpen={isVideoCallOpen} onClose={() => setIsVideoCallOpen(false)} remoteName={activeCallDoctor} />

      {isBookingModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Request Session</h2>
              <button onClick={() => setIsBookingModalOpen(false)} className="font-black">✕</button>
            </div>
            <form onSubmit={handleBookAppointment} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Assigned Doctor</label>
                <select 
                  className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none bg-white text-slate-900 font-black text-sm"
                  value={bookingForm.doctorId}
                  onChange={(e) => setBookingForm({...bookingForm, doctorId: e.target.value})}
                >
                  <option value="">Choose Specialist</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization || 'Clinical Staff'})</option>
                  ))}
                  {doctors.length === 0 && <option value="mock" disabled>No Registered Doctors Available</option>}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <input required type="date" className="p-5 rounded-2xl border-2 border-slate-100 outline-none bg-white text-slate-900 font-bold" value={bookingForm.date} onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})} />
                <input required type="time" className="p-5 rounded-2xl border-2 border-slate-100 outline-none bg-white text-slate-900 font-bold" value={bookingForm.time} onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-6 bg-sky-600 text-white font-black rounded-[2rem] shadow-2xl hover:bg-sky-700 transition-all uppercase tracking-widest text-[10px]">Commit Booking</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
