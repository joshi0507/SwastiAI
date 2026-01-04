
import React, { useState, useEffect } from 'react';
import { User, Appointment, HealthRecord } from '../../types';
import VideoCallModal from '../VideoCallModal';

interface DoctorDashboardProps {
  user: User;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [activePatient, setActivePatient] = useState<{name: string, id: string} | null>(null);

  useEffect(() => {
    // Sync Appointments
    const storedAppts: Appointment[] = JSON.parse(localStorage.getItem('swasth_appointments') || '[]');
    setAppointments(storedAppts.filter(a => a.doctorId === user.id));

    // Sync Health Records
    const storedRecords: HealthRecord[] = JSON.parse(localStorage.getItem('swasth_health_records') || '[]');
    setHealthRecords(storedRecords);
  }, [user.id]);

  const startCall = (patientName: string, patientId: string) => {
    setActivePatient({ name: patientName, id: patientId });
    setIsVideoCallOpen(true);
  };

  const getPatientRecords = (patientId: string) => {
      return healthRecords.filter(r => r.patientId === patientId);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 reveal active">
          <h1 className="text-4xl font-extrabold font-heading text-slate-900">Medical Clinical Console</h1>
          <p className="text-slate-500 font-medium italic">Welcome, Dr. {user.name} | Unit: {user.specialization || 'General Practice'}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8 reveal active">
            <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border-2 border-white shadow-xl overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active Village Queue</h2>
                <div className="text-[10px] font-black bg-sky-600 text-white px-4 py-1.5 rounded-full uppercase tracking-widest">{appointments.length} Consultations</div>
              </div>
              <div className="divide-y divide-slate-100">
                {appointments.length > 0 ? appointments.map(apt => (
                  <div key={apt.id} className="p-8 flex flex-col gap-6 hover:bg-sky-50/30 transition-all group">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-300 border border-slate-100 shadow-sm group-hover:bg-sky-600 group-hover:text-white transition-all">
                            {apt.patientName.charAt(0)}
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-slate-900">{apt.patientName}</h4>
                            <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest">{apt.time}</span>
                            <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${apt.type === 'VIDEO' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                {apt.type}
                            </span>
                            </div>
                        </div>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                        {apt.type === 'VIDEO' && (
                            <button 
                            onClick={() => startCall(apt.patientName, apt.patientId)}
                            className="flex-grow sm:flex-none px-8 py-4 bg-sky-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-sky-700 shadow-lg transition video-call-pulse"
                            >
                            Enter Room
                            </button>
                        )}
                        </div>
                    </div>
                    
                    {/* Patient Lab Reports Preview for the Doctor */}
                    <div className="bg-white/50 p-6 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Patient Lab Reports (Synced from Mobile Van)</p>
                        <div className="flex flex-wrap gap-4">
                            {getPatientRecords(apt.patientId).length > 0 ? getPatientRecords(apt.patientId).map(rec => (
                                <div key={rec.id} className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-[10px] font-black text-emerald-700">
                                    <span>🔬</span> {rec.title}
                                </div>
                            )) : (
                                <p className="text-[10px] font-bold text-slate-300 italic">No lab results available yet.</p>
                            )}
                        </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-20 text-center text-slate-200 font-black italic">Waitlist clear. No patients currently synced from village units.</div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6 reveal active">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border-2 border-white shadow-xl">
               <h3 className="font-black text-slate-900 mb-6 text-sm uppercase tracking-widest">Village Unit Status</h3>
               <div className="space-y-4">
                   <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700">
                       <p className="text-[9px] font-black mb-1 uppercase tracking-widest">Reports Uploaded Today</p>
                       <p className="text-2xl font-black">{healthRecords.filter(r => r.date === new Date().toLocaleDateString()).length}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-sky-700">
                       <p className="text-[9px] font-black mb-1 uppercase tracking-widest">Active Mobile Vans</p>
                       <p className="text-2xl font-black">1</p>
                    </div>
               </div>
            </div>
          </aside>
        </div>
      </div>
      
      <VideoCallModal 
        isOpen={isVideoCallOpen} 
        onClose={() => setIsVideoCallOpen(false)} 
        remoteName={activePatient?.name || 'Patient'} 
        isSelfView={true} 
      />
    </div>
  );
};

export default DoctorDashboard;
