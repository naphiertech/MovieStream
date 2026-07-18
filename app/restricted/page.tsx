import Link from 'next/link';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function RestrictedPage() {
  return (
    <div className="min-h-screen bg-[#060606] flex flex-col items-center justify-center p-6 selection:bg-red-500/30 pt-20">
      <div className="max-w-md w-full bg-[#111] border border-red-500/20 rounded-[2rem] p-10 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Glow effect */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-600/20 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="bg-red-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)] relative">
            <div className="absolute inset-0 border border-red-500/30 rounded-full animate-ping opacity-20" />
            <AlertTriangle size={40} className="text-red-500" />
        </div>
        
        <h1 className="text-2xl font-black text-white uppercase tracking-[2px] mb-3">Security Protocol</h1>
        <h2 className="text-red-500 font-bold text-sm tracking-[4px] uppercase mb-6">Access Denied</h2>
        
        <p className="text-white/50 text-sm leading-relaxed mb-10 font-medium">
          You are attempting to access a restricted terminal. This sector is strictly off-limits to unauthorized civilian traffic.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-8 py-4 rounded-full font-black text-[11px] uppercase tracking-[2px] transition-all duration-300 group shadow-lg"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-red-500" />
          Return to Platform
        </Link>
      </div>
    </div>
  );
}
