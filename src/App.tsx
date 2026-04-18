import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Loader2,
  AlertCircle,
  Zap,
  SendHorizontal,
  ChevronRight,
  BookOpen,
  Terminal,
  Globe,
  Activity,
  Server,
  Database,
  Cpu,
  Layers,
  Smartphone,
  Monitor
} from "lucide-react";

// --- Types ---
interface TechData {
  battery_level?: number;
  battery_charging?: boolean;
  screen_data?: any;
  timezone?: string;
  language?: string;
  connection_type?: string;
}

// --- Specialized Components ---

const LogoV5 = () => (
  <div className="relative group cursor-pointer overflow-visible">
    <div className="absolute inset-0 bg-blue-500/40 blur-3xl group-hover:bg-blue-400/60 transition-all rounded-full" />
    <svg width="56" height="56" viewBox="0 0 100 100" className="relative drop-shadow-2xl">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3b82f6' }} />
          <stop offset="100%" style={{ stopColor: '#a855f7' }} />
        </linearGradient>
      </defs>
      <motion.path 
        d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" 
        fill="none" 
        stroke="url(#logoGrad)" 
        strokeWidth="4" 
        animate={{ strokeDashoffset: [0, 200], strokeDasharray: ["0 100", "100 0"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <path d="M50 25 L75 40 L75 60 L50 75 L25 60 L25 40 Z" fill="url(#logoGrad)" />
      <motion.circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="5 5" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
    </svg>
  </div>
);

const playTechSound = (frequency = 800, duration = 0.1) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
};

const EntryPage = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2, filter: "blur(40px)" }}
      className="fixed inset-0 z-[200] bg-[#050508] flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        <LogoV5 />
        <h2 className="mt-8 text-white font-black text-3xl tracking-[0.3em] uppercase drop-shadow-2xl italic">RUDRA V5.0</h2>
        <div className="h-1 w-12 bg-blue-600 rounded-full mt-2 animate-pulse" />
      </motion.div>
      <div className="mt-20 w-64 h-1 bg-white/5 relative overflow-hidden rounded-full">
        <motion.div 
          initial={{ left: "-100%" }}
          animate={{ left: "100%" }}
          transition={{ duration: 3.5, ease: "linear", repeat: Infinity }}
          className="absolute top-0 h-full w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        />
      </div>
      <p className="mt-6 text-blue-500/60 font-mono text-[10px] uppercase tracking-[0.6em] font-black">
        Initializing High-Load Gateway
      </p>
    </motion.div>
  );
};

export default function App() {
  const [showEntry, setShowEntry] = useState(true);
  const [mobile, setMobile] = useState("");
  const [hash, setHash] = useState("");
  const [count, setCount] = useState(500);
  const [tab, setTab] = useState<"gateway" | "docs">("gateway");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning", msg: string } | null>(null);

  // --- EXTREME ANTI-INSPECT PROTECTION V5 ---
  useEffect(() => {
    const fuckYou = () => {
      playTechSound(100, 0.5);
      window.alert("F*** YOU! DONT TRY TO STEAL MY CODE. ACCESS DENIED!");
      console.clear();
      console.log("%cF*** YOU! %cCode protected by Shatarudra", "color:red;font-size:40px;font-weight:bold", "color:blue;font-size:20px");
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      fuckYou();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C" || e.key === "K")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "S" || e.key === "P" || e.key === "H")) ||
        (e.metaKey && e.altKey && e.key === "I")
      ) {
        e.preventDefault();
        fuckYou();
      }
    };

    // Detect DevTools opening by debugger trick
    const detectDevTools = () => {
      const start = new Date().getTime();
      // eslint-disable-next-line no-debugger
      debugger; 
      const end = new Date().getTime();
      if (end - start > 100) {
        fuckYou();
      }
    };

    const devToolsInterval = setInterval(detectDevTools, 2000);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(devToolsInterval);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const captureTechData = useCallback(async (): Promise<TechData> => {
    const data: TechData = {
      screen_data: { width: screen.width, height: screen.height, pixelRatio: window.devicePixelRatio },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
    };
    if ((navigator as any).getBattery) {
      try {
        const b: any = await (navigator as any).getBattery();
        data.battery_level = Math.floor(b.level * 100);
        data.battery_charging = b.charging;
      } catch {}
    }
    return data;
  }, []);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    playTechSound(1000, 0.05);

    if (mobile.length !== 10) {
      setAlert({ type: "error", msg: "Invalid Target: Reach 10 digits accurately." });
      playTechSound(200, 0.3);
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const techData = await captureTechData();
      const res = await fetch("/api/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, custom_sms: hash, count, ...techData })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Handshake Failed");
      setAlert({ type: "success", msg: `SUCCESS: ${count} requests successfully tunneled to target.` });
      playTechSound(1500, 0.1);
    } catch (err: any) {
      setAlert({ type: "error", msg: err.message });
      playTechSound(300, 0.4);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] font-sans selection:bg-blue-500/20 antialiased overflow-x-hidden text-white">
      <AnimatePresence>
        {showEntry && <EntryPage onComplete={() => setShowEntry(false)} />}
      </AnimatePresence>

      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050508] via-[#0d122b] to-[#050508]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050508_100%)] opacity-80" />
      </div>

      {!showEntry && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center py-6 px-4 md:py-12 md:px-10 max-w-[1200px] mx-auto w-full"
        >
          {/* Responsive Header Nav */}
          <nav className="w-full flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-[30px] shadow-2xl">
             <div className="flex items-center gap-4">
               <LogoV5 />
               <div>
                  <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase leading-none italic">Shatarudra</h1>
                  <span className="text-[9px] text-blue-500 font-black uppercase tracking-[0.5em]">Global Infrastructure</span>
               </div>
             </div>
             
             <div className="flex bg-black/50 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto overflow-x-auto scrollbar-hide">
                {[
                  { id: "gateway", icon: Activity, label: "Gateway" },
                  { id: "docs", icon: BookOpen, label: "Documents" }
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => { setTab(item.id as any); playTechSound(800, 0.05); }}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 md:px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${tab === item.id ? 'bg-blue-600 text-white shadow-lg scale-[1.05]' : 'text-white/30 hover:text-white/60'}`}
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </button>
                ))}
             </div>
          </nav>

          <main className="w-full grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            
            {/* Functional Column */}
            <div className="space-y-8">
               <AnimatePresence mode="wait">
                  {tab === "gateway" ? (
                    <motion.div 
                      key="gateway"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-[45px] shadow-[0_50px_100px_rgba(0,0,0,0.6)] border border-white/20 p-8 md:p-12 relative overflow-hidden text-slate-900"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Cpu size={120} />
                      </div>

                      <div className="flex justify-between items-start mb-12">
                         <div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic">V5 Hyper-Sync</h2>
                            <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                               Encrypted Channel Active
                            </div>
                         </div>
                         <div className="hidden sm:flex bg-slate-50 p-4 rounded-3xl border border-slate-100 flex-col items-center">
                            <Smartphone size={20} className="text-blue-500 mb-1" />
                            <span className="text-[8px] font-black text-slate-400">MOBILE OK</span>
                         </div>
                      </div>

                      <form onSubmit={handleSendOTP} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-3">
                              <label className="text-[11px] font-black uppercase tracking-widest opacity-50 ml-2">Endpoint Target</label>
                              <div className="bg-slate-50 border-2 border-slate-100 rounded-[24px] focus-within:border-blue-600 focus-within:ring-8 focus-within:ring-blue-600/5 px-6 py-6 transition-all flex items-center">
                                 <span className="mr-4 text-xl">📱</span>
                                 <input 
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                    placeholder="Target Handset ID"
                                    className="w-full bg-transparent border-none outline-none font-black text-lg text-slate-900 placeholder:text-slate-200"
                                    required
                                 />
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[11px] font-black uppercase tracking-widest opacity-50 ml-2">Shatarudra Hash</label>
                              <div className="bg-slate-50 border-2 border-slate-100 rounded-[24px] focus-within:border-purple-600 focus-within:ring-8 focus-within:ring-purple-600/5 px-6 py-6 transition-all flex items-center">
                                 <span className="mr-4 text-xl">🔑</span>
                                 <input 
                                    type="text"
                                    value={hash}
                                    onChange={(e) => setHash(e.target.value)}
                                    placeholder="Optional SMS Index"
                                    className="w-full bg-transparent border-none outline-none font-black text-lg text-slate-900 placeholder:text-slate-200"
                                 />
                              </div>
                           </div>
                        </div>

                        {/* Intensity Section */}
                        <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-6">
                           <div className="flex justify-between items-center">
                              <label className="text-[11px] font-black uppercase tracking-widest opacity-60">Packet Density</label>
                              <div className={`px-5 py-2 rounded-2xl text-[14px] font-black ${count > 700 ? 'bg-red-600 text-white' : 'bg-blue-600 text-white shadow-lg'}`}>
                                 {count} PKTS
                              </div>
                           </div>
                           <input 
                             type="range" min="100" max="1000" step="10"
                             value={count} onChange={(e) => { setCount(parseInt(e.target.value)); playTechSound(800+count, 0.02); }}
                             className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                           />
                           <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
                              <span>Standard</span>
                              <span className={count > 800 ? 'text-red-500 animate-pulse' : ''}>Extreme Flood</span>
                           </div>
                        </div>

                        {alert && (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            className={`p-6 rounded-3xl border-2 flex items-center gap-5 ${alert.type === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-700' : 'bg-red-500/5 border-red-500/20 text-red-700'}`}
                          >
                             <Zap size={24} />
                             <p className="text-[13px] font-black tracking-tight">{alert.msg}</p>
                          </motion.div>
                        )}

                        <button
                          type="submit" disabled={loading}
                          className="w-full py-8 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white font-black text-lg uppercase tracking-[8px] rounded-[32px] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-6 group disabled:opacity-50"
                        >
                          {loading ? <Loader2 className="animate-spin" size={32} /> : (
                            <>
                              <span>Initialize Flow</span>
                              <SendHorizontal size={24} className="group-hover:translate-x-4 transition-transform" />
                            </>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="docs"
                      className="bg-white rounded-[45px] shadow-2xl p-10 md:p-12 text-slate-900 space-y-10"
                    >
                       <div className="flex items-center gap-6 border-b pb-8">
                          <BookOpen size={40} className="text-blue-600" />
                          <h2 className="text-3xl font-black tracking-tighter uppercase italic">V5.0 Protocol</h2>
                       </div>
                       
                       <div className="space-y-8">
                          <section>
                             <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4">Core Integration</h3>
                             <div className="bg-slate-900 text-blue-400 p-8 rounded-[35px] font-mono text-xs overflow-x-auto">
                                <p>POST /api/otp/request</p>
                                <p>{"{"}</p>
                                <p className="pl-4">"mobile": "10_DIGIT_ID",</p>
                                <p className="pl-4">"count": "INT[100-1000]"</p>
                                <p>{"}"}</p>
                             </div>
                          </section>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {[
                               { t: "TLS Handshake", d: "Standard 256-bit encrypted payload delivery." },
                               { t: "IP Obfuscation", d: "Automatic redirection through cloud-proxy nodes." }
                             ].map((i, k) => (
                               <div key={k} className="p-6 bg-slate-50 rounded-3xl border">
                                  <h4 className="text-[11px] font-black uppercase mb-1">{i.t}</h4>
                                  <p className="text-[10px] text-slate-500 font-bold">{i.d}</p>
                               </div>
                             ))}
                          </div>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* Side Column */}
            <div className="space-y-8">
               <div className="bg-white/[0.04] backdrop-blur-3xl p-8 rounded-[40px] border border-white/10">
                  <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-8">Node Diagnostics</h3>
                  <div className="space-y-8">
                     <div className="flex justify-between items-center bg-white/5 p-5 rounded-3xl">
                        <Monitor size={16} className="text-blue-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest">System Load: 98%</span>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black text-white/40 uppercase">
                          <span>Global Sync</span>
                          <span>ACTIVE</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }} animate={{ width: "85%" }}
                             className="h-full bg-blue-600" 
                           />
                        </div>
                     </div>
                  </div>
               </div>

               <motion.a 
                 href="https://t.me/iamhacker38" target="_blank"
                 className="block p-10 bg-gradient-to-br from-blue-700 to-black rounded-[40px] shadow-2xl group border border-white/20 relative overflow-hidden"
               >
                  <div className="relative z-10">
                     <Zap size={32} className="text-blue-400 mb-6 group-hover:rotate-12 transition-transform" />
                     <h3 className="text-2xl font-black mb-3 italic">Shatarudra Elite</h3>
                     <p className="text-[11px] opacity-60 font-bold mb-8 uppercase tracking-widest">Private Tools & Bypasses.</p>
                     <div className="flex items-center gap-4 text-[12px] font-black tracking-[4px]">
                        JOIN <ChevronRight size={18} />
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px]" />
               </motion.a>

               <div className="py-10 flex flex-col items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full animate-ping mb-4 shadow-[0_0_20px_#2563eb]" />
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.8em]">Core V5.0 Pulse</p>
               </div>
            </div>
          </main>

          <footer className="w-full mt-24 py-16 border-t border-white/5 flex flex-col items-center gap-10">
             <LogoV5 />
             <div className="text-center space-y-3">
                <p className="text-[13px] text-white/60 font-black uppercase tracking-[0.4em]">
                  Created by <span className="text-white italic">Shatarudra Prakash Singh</span>
                </p>
                <div className="flex gap-4 text-[9px] text-white/10 font-black uppercase tracking-widest">
                   <span>SECURE</span>
                   <span>•</span>
                   <span>GLOBAL</span>
                   <span>•</span>
                   <span>ENCRYPTED</span>
                </div>
             </div>
          </footer>
        </motion.div>
      )}

      <style>{`
        ::-webkit-scrollbar { display: none; }
        input[type=range]::-webkit-slider-thumb {
          border: 8px solid #fff;
          height: 36px;
          width: 36px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -14px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.4);
        }
      `}</style>
    </div>
  );
}
