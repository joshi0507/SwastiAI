
import React, { useState, useEffect } from 'react';
import { User, Appointment } from '../../types';
import VideoCallModal from '../VideoCallModal';

interface DoctorDashboardProps {
  user: User;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [activePatientName, setActivePatientName] = useState('');

  useEffect(() => {
    // Sync with global appointment registry
    const storedAppts: Appointment[] = JSON.parse(localStorage.getItem('swasth_appointments') || '[]');
    setAppointments(storedAppts.filter(a => a.doctorId === user.id));
  }, [user.id]);

  const startCall = (patientName: string) => {
    setActivePatientName(patientName);
    setIsVideoCallOpen(true);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 reveal active">
          <h1 className="text-4xl font-extrabold font-heading text-slate-900">Clinical Console</h1>
          <p className="text-slate-500 font-medium italic">Dr. {user.name} | Domain: {user.specialization || 'On-Call Staff'}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8 reveal active">
            <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900">Daily Patient Queue</h2>
                <div className="text-[10px] font-black bg-sky-50 text-sky-700 px-4 py-1 rounded-full uppercase tracking-widest">{appointments.length} Sessions Active</div>
              </div>
              <div className="divide-y divide-slate-50">
                {appointments.length > 0 ? appointments.map(apt => (
                  <div key={apt.id} className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-sky-50/30 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-300 border border-slate-100 shadow-sm group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all">
                        {apt.patientName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{apt.patientName}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-wider">{apt.time}</span>
                          <span className={`text-[10px] px-2 py-1 rounded-full font-extrabold uppercase tracking-widest ${apt.type === 'VIDEO' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {apt.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      {apt.type === 'VIDEO' && (
                        <button 
                          onClick={() => startCall(apt.patientName)}
                          className="flex-grow sm:flex-none px-6 py-3 bg-sky-600 text-white text-sm font-bold rounded-2xl hover:bg-sky-700 shadow-lg transition video-call-pulse"
                        >
                          Launch Clinic Feed
                        </button>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="p-20 text-center text-slate-300 font-black italic">Waitlist Clear. No active bookings.</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 reveal active">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-xl">
               <h3 className="font-bold text-slate-900 mb-6 text-lg tracking-tight">Vitals Summary</h3>
               <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700">
                   <p className="text-xs font-bold mb-1 uppercase tracking-wider">Avg Diagnostic Time</p>
                   <p className="text-2xl font-black">18.4 <span className="text-sm">mins</span></p>
                </div>
            </div>
          </div>
        </div>
      </div>
      
      <VideoCallModal 
        isOpen={isVideoCallOpen} 
        onClose={() => setIsVideoCallOpen(false)} 
        remoteName={activePatientName} 
        isSelfView={true} // Doctor gets main screen self-view for clinical accuracy
      />
    </div>
  );
};

export default DoctorDashboard;
