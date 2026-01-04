
import React, { useState, useEffect, useRef } from 'react';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  remoteName: string;
  isSelfView?: boolean; // If true, local feed is shown on the big screen
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
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      startCamera();
    } else {
      stopCamera();
      setCallDuration(0);
    }
    return () => {
      clearInterval(interval);
      stopCamera();
    };
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
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950 p-0 md:p-6">
      <div className="relative w-full h-full max-w-7xl bg-slate-900 md:rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Main Viewing Feed */}
        <div className="flex-grow relative bg-black flex items-center justify-center">
          {isSelfView && isCamOn ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror scale-x-[-1]" />
          ) : (
            <>
              <img src="https://images.unsplash.com/photo-1559839734-2b71f153ec7a?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xl" alt="Call Background" />
              <div className="relative z-10 text-white text-center">
                <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center text-6xl mx-auto mb-6 border-2 border-white/20 animate-pulse">👤</div>
                <h2 className="text-3xl font-black tracking-tight">{remoteName}</h2>
                <p className="text-xs uppercase tracking-widest text-white/50 mt-2 font-bold">Connecting Secure Video Link...</p>
              </div>
            </>
          )}

          <div className="absolute top-8 left-8 z-20 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full text-white font-black text-[10px] uppercase tracking-widest border border-white/10 flex items-center gap-3">
             <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
             {isSelfView ? 'Clinical Self-Monitor' : `${remoteName} (Live)`}
          </div>
          
          <div className="absolute top-8 right-8 z-20 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full text-white font-black text-[10px] tracking-widest border border-white/10">
            {formatTime(callDuration)}
          </div>
        </div>

        {/* Small Feed (Corner) */}
        {!isSelfView && (
          <div className="absolute bottom-32 right-8 w-48 h-64 bg-slate-950 rounded-3xl border-4 border-slate-900 shadow-2xl overflow-hidden z-30">
            {isCamOn ? (
               <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror scale-x-[-1]" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-4xl">📷</div>
            )}
            <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded-lg text-[8px] text-white font-black uppercase tracking-widest">You</div>
          </div>
        )}

        {/* Controls Bar */}
        <div className="h-28 bg-slate-950/90 border-t border-white/5 flex items-center justify-center gap-8">
          <button onClick={() => setIsMicOn(!isMicOn)} className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all ${isMicOn ? 'bg-white/10 text-white' : 'bg-red-500 text-white'}`}>
            {isMicOn ? '🎤' : '🔇'}
          </button>
          <button onClick={() => setIsCamOn(!isCamOn)} className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all ${isCamOn ? 'bg-white/10 text-white' : 'bg-red-500 text-white'}`}>
            {isCamOn ? '📹' : '📷'}
          </button>
          <button onClick={onClose} className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl shadow-xl shadow-red-600/30 hover:scale-110 active:scale-90 transition-all">
            📞
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
