
import React, { useState, useEffect, useRef } from 'react';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  remoteName: string;
  isSelfView?: boolean; // If true, local feed is shown on the big screen (Doctor Mode)
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({ isOpen, onClose, remoteName, isSelfView = false }) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let interval: any;
    if (isOpen) {
      interval = setInterval(() => setCallDuration(prev => prev + 1), 1000);
      startCamera();
    } else {
      stopCamera();
      setCallDuration(0);
    }
    return () => { clearInterval(interval); stopCamera(); };
  }, [isOpen]);

  useEffect(() => {
    if (stream) {
      stream.getVideoTracks().forEach(track => track.enabled = isCamOn);
      stream.getAudioTracks().forEach(track => track.enabled = isMicOn);
    }
  }, [isCamOn, isMicOn, stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error("Camera access failed:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950 p-0 md:p-6 overflow-hidden">
      <div className="relative w-full h-full max-w-7xl bg-slate-900 md:rounded-[3rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/10">
        
        {/* Main Feed Container */}
        <div className="flex-grow relative bg-black flex items-center justify-center overflow-hidden">
          {isSelfView && isCamOn ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror scale-x-[-1]" />
          ) : (
            <div className="text-center relative z-10 p-12">
                <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center text-8xl mx-auto mb-10 border-2 border-white/10 shadow-[0_0_150px_rgba(255,255,255,0.05)]">
                   {isSelfView ? '👨‍⚕️' : '👤'}
                </div>
                <h2 className="text-5xl font-black text-white tracking-tightest mb-4">{remoteName}</h2>
                <div className="flex items-center justify-center gap-4">
                    <span className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.8)]"></span>
                    <p className="text-white/40 uppercase tracking-[0.5em] text-[10px] font-black">Clinical Uplink Encrypted</p>
                </div>
            </div>
          )}

          {/* Status Indicators */}
          <div className="absolute top-10 left-10 z-20 bg-black/60 backdrop-blur-2xl px-8 py-4 rounded-full text-white font-black text-[10px] uppercase tracking-widest border border-white/10 flex items-center gap-4 shadow-2xl">
             <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
             {isSelfView ? `Doctor Console: ${remoteName}` : `Consultation: ${remoteName}`}
          </div>
          
          <div className="absolute top-10 right-10 z-20 bg-black/60 backdrop-blur-2xl px-8 py-4 rounded-full text-white font-black text-[10px] tracking-widest border border-white/10 shadow-2xl">
            {formatTime(callDuration)}
          </div>

          {/* HIGH VISIBILITY CLOSE BUTTON */}
          <button 
            onClick={onClose} 
            className="absolute top-10 right-36 z-[510] w-16 h-16 bg-red-600 hover:bg-red-700 border-4 border-white/20 text-white rounded-2xl flex items-center justify-center font-black text-3xl hover:scale-110 active:scale-90 transition-all shadow-[0_20px_50px_rgba(220,38,38,0.4)]"
            title="Terminate Session"
          >
            ✕
          </button>
        </div>

        {/* Local Preview for Patient */}
        {!isSelfView && (
          <div className="absolute bottom-40 right-10 w-60 h-80 bg-slate-950 rounded-[3rem] border-4 border-slate-900 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden z-30 transform hover:scale-105 transition-transform duration-500">
            {isCamOn ? (
               <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror scale-x-[-1]" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-6xl">📷</div>
            )}
            <div className="absolute bottom-5 left-5 bg-black/80 px-5 py-2.5 rounded-2xl text-[10px] text-white font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">Local Terminal</div>
          </div>
        )}

        {/* Bottom Control Dock */}
        <div className="h-36 bg-slate-950 border-t border-white/5 flex items-center justify-center gap-12 px-10">
          <button 
            onClick={() => setIsMicOn(!isMicOn)} 
            className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl transition-all hover:scale-110 active:scale-90 ${isMicOn ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-red-500 text-white shadow-[0_0_60px_rgba(239,68,68,0.5)]'}`}
            title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
          >
            {isMicOn ? '🎤' : '🔇'}
          </button>
          
          <button 
            onClick={onClose} 
            className="w-24 h-24 bg-red-600 text-white rounded-full flex items-center justify-center text-5xl shadow-[0_30px_70px_rgba(220,38,38,0.6)] hover:scale-110 active:scale-95 transition-all mx-8"
            title="End Session"
          >
            📞
          </button>

          <button 
            onClick={() => setIsCamOn(!isCamOn)} 
            className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl transition-all hover:scale-110 active:scale-90 ${isCamOn ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-red-500 text-white shadow-[0_0_60px_rgba(239,68,68,0.5)]'}`}
            title={isCamOn ? 'Stop Camera' : 'Start Camera'}
          >
            {isCamOn ? '📹' : '📷'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
