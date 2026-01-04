
import React, { useState, useEffect } from 'react';
import { User, Appointment, HealthRecord, UserRole, AmbulanceStatus } from '../../types';
import HealthAssistant from '../HealthAssistant';
import VideoCallModal from '../VideoCallModal';

interface PatientDashboardProps {
  user: User;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user }) => {
  const [doctors, setDoctors] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [ambulance, setAmbulance] = useState<AmbulanceStatus | null>(null);
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [activeCallDoctor, setActiveCallDoctor] = useState('');
  
  const [bookingForm, setBookingForm] = useState({ doctorId: '', doctorName: '', date: '', time: '', type: 'VIDEO' as 'VIDEO' | 'IN_PERSON' });

  useEffect(() => {
    // Shared Data Fetching
    const storedUsers: User[] = JSON.parse(localStorage.getItem('managed_users') || '[]');
    setDoctors(storedUsers.filter(u => u.role === UserRole.DOCTOR));

    const storedAppts: Appointment[] = JSON.parse(localStorage.getItem('swasth_appointments') || '[]');
    setAppointments(storedAppts.filter(a => a.patientId === user.id));

    const storedAmbulance = JSON.parse(localStorage.getItem('swasth_ambulance') || 'null');
    setAmbulance(storedAmbulance);

    const storedRecords: HealthRecord[] = JSON.parse(localStorage.getItem('swasth_health_records') || '[]');
    setHealthRecords(storedRecords.filter(r => r.patientId === user.id));
  }, [user.id]);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.doctorId) return alert('Select doctor.');
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
    localStorage.setItem('swasth_appointments', JSON.stringify([newAppointment, ...allAppts]));
    setAppointments([newAppointment, ...appointments]);
    setIsBookingModalOpen(false);
  };

  return (
    <div className="bg-transparent min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 reveal active">
          <div>
            <h1 className="text-5xl font-black font-heading text-slate-900 tracking-tightest">Health Registry</h1>
            <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Active Identity: {user.name}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => alert('Emergency Call System: Dial 102 (Mobile Van SOS) or 108 (Ambulance). Website Call System coming in v2.')} className="px-8 py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition shadow-xl uppercase tracking-widest text-[10px]">🚨 SOS Village Help</button>
            <button onClick={() => setIsBookingModalOpen(true)} className="px-8 py-4 bg-sky-600 text-white font-black rounded-2xl hover:bg-sky-700 transition shadow-xl uppercase tracking-widest text-[10px]">Book Consultation</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Mobile Clinic Tracker */}
            {ambulance && (
                <section className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden reveal active">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex-grow">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-sky-500/20 text-sky-400 text-[9px] font-black uppercase tracking-widest mb-4 border border-sky-500/20">Mobile Diagnostic Unit Active</span>
                            <h2 className="text-3xl font-black tracking-tight mb-2">SwasthAI Mobile Van Tracker</h2>
                            <p className="text-slate-400 font-medium text-sm">Stationed in village: <span className="text-white font-black">{ambulance.village}</span></p>
                            <p className="text-slate-400 font-medium text-sm mt-1">Arrival Window: <span className="text-sky-400 font-black">{ambulance.arrivalTime}</span></p>
                        </div>
                        <div className="text-center md:text-right bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Live Location Status</p>
                            <p className="text-sky-400 font-black">{ambulance.location}</p>
                            <div className="mt-4 px-6 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-[9px] font-black uppercase border border-emerald-500/20">Vitals Lab Open</div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-600/10 blur-3xl -mr-32 -mt-32"></div>
                </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section className="glass-card p-10 rounded-[3rem] shadow-xl reveal active">
                  <h2 className="text-2xl font-black mb-8 text-slate-900 tracking-tight">Active Sessions</h2>
                  <div className="space-y-6">
                    {appointments.length > 0 ? appointments.map(apt => (
                      <div key={apt.id} className="p-8 rounded-[2rem] border border-slate-100 bg-white/40 flex flex-col gap-4 group hover:bg-white transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-2xl">{apt.type === 'VIDEO' ? '📹' : '🏥'}</div>
                          <div>
                            <h3 className="font-black text-slate-900">{apt.doctorName}</h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{apt.date} at {apt.time}</p>
                          </div>
                        </div>
                        {apt.type === 'VIDEO' && (
                            <button onClick={() => { setActiveCallDoctor(apt.doctorName); setIsVideoCallOpen(true); }} className="w-full py-3 bg-sky-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg video-call-pulse">Join Room</button>
                        )}
                      </div>
                    )) : (
                        <div className="p-10 text-center text-slate-300 font-black italic">No upcoming consultations.</div>
                    )}
                  </div>
                </section>

                <section className="glass-card p-10 rounded-[3rem] shadow-xl reveal active">
                  <h2 className="text-2xl font-black mb-8 text-slate-900 tracking-tight">Lab Reports</h2>
                  <div className="space-y-4">
                    {healthRecords.length > 0 ? healthRecords.map(rec => (
                      <div key={rec.id} className="p-6 rounded-[2rem] border border-slate-100 bg-emerald-50/30 flex items-center justify-between group hover:bg-emerald-50 transition-all">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">🔬</span>
                            <div>
                                <h4 className="font-black text-slate-900 text-xs">{rec.title}</h4>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{rec.date}</p>
                            </div>
                        </div>
                        <button className="text-sky-600 font-black text-[10px] uppercase tracking-widest hover:underline">View</button>
                      </div>
                    )) : (
                        <div className="p-10 text-center text-slate-300 font-black italic">No records uploaded yet.</div>
                    )}
                  </div>
                </section>
            </div>
          </div>

          <aside className="space-y-10 reveal active">
            <HealthAssistant />
          </aside>
        </div>
      </div>

      <VideoCallModal isOpen={isVideoCallOpen} onClose={() => setIsVideoCallOpen(false)} remoteName={activeCallDoctor} />

      {isBookingModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 relative">
            <button onClick={() => setIsBookingModalOpen(false)} className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-900 rounded-full font-black text-2xl hover:scale-110 transition-transform">✕</button>
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Book Medical Slot</h2>
            <form onSubmit={handleBookAppointment} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Choose Specialist</label>
                <select className="w-full p-5 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-black outline-none focus:border-sky-500" value={bookingForm.doctorId} onChange={(e) => setBookingForm({...bookingForm, doctorId: e.target.value})}>
                    <option value="">Select Doctor</option>
                    {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required type="date" className="p-5 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-bold outline-none focus:border-sky-500" value={bookingForm.date} onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})} />
                <input required type="time" className="p-5 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-bold outline-none focus:border-sky-500" value={bookingForm.time} onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-6 bg-sky-600 text-white font-black rounded-3xl shadow-xl hover:bg-sky-700 uppercase tracking-widest text-[10px]">Verify & Sync</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
