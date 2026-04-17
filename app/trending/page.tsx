import Link from 'next/link';
import { Zap, ArrowLeft, Timer, Sparkles } from 'lucide-react';

export default function TrendingComingSoon() {
  return (
    <main className="min-h-screen bg-[#060606] flex items-center justify-center relative overflow-hidden px-6">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2dd4bf]/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-[#0ed2f7]/5 blur-[100px] rounded-full" />
      
      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Feature Tag */}
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-xl">
          <Sparkles size={14} className="text-[#2dd4bf]" />
          <span className="text-[10px] font-black uppercase tracking-[3px] text-white/60 font-outfit">Upcoming Module</span>
        </div>

        {/* Impactful Heading */}
        <h1 className="text-[46px] md:text-[72px] font-black text-white leading-[0.9] tracking-tighter uppercase italic mb-8 font-outfit italic">
          TRENDING <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2dd4bf] to-[#0ed2f7] drop-shadow-[0_0_30px_rgba(45,212,191,0.3)]">SPOTLIGHT</span>
        </h1>

        <p className="text-white/40 text-sm md:text-base font-medium max-w-lg mx-auto mb-12 leading-relaxed font-outfit">
          We&apos;re engineering a real-time analytics hub to deliver the most accurate charts in cinematic streaming. Stay tuned for the ultimate trending experience.
        </p>

        {/* Progress Mockup */}
        <div className="max-w-xs mx-auto mb-14">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[2px]">Core Engine Status</span>
            <span className="text-[10px] font-black text-[#2dd4bf] uppercase tracking-[1px]">85% Ready</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
            <div className="h-full bg-gradient-to-r from-[#2dd4bf] to-[#0ed2f7] rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)]" style={{ width: '85%' }} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <button className="px-10 py-4 rounded-2xl bg-white text-black font-black text-[12px] uppercase tracking-[2px] hover:bg-[#2dd4bf] transition-all duration-500 hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] flex items-center gap-3 active:scale-95">
              <ArrowLeft size={16} />
              Return Home
            </button>
          </Link>
          <button className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-black text-[12px] uppercase tracking-[2px] hover:text-white hover:bg-white/10 transition-all active:scale-95 flex items-center gap-3 cursor-not-allowed opacity-50">
             <Timer size={16} />
             Notify Me
          </button>
        </div>

        {/* Footer Branding */}
        <div className="mt-24 flex items-center justify-center gap-3 opacity-20 grayscale hover:grayscale-0 transition-all duration-700 pointer-events-none">
          <Zap size={20} className="text-[#2dd4bf] fill-[#2dd4bf]" />
          <span className="font-black text-[15px] tracking-tighter uppercase italic text-white flex flex-col leading-[0.8]">
             <span>MOVIE</span>
             <span className="text-[#2dd4bf]">STREAM PRO</span>
          </span>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
    </main>
  );
}
