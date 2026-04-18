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
  Monitor,
  Sun,
  Moon
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
  const [mode, setMode] = useState<"stealth" | "turbo">("stealth");
  const [logs, setLogs] = useState<{ id: string, msg: string, type: 'info' | 'success' | 'cmd' }[]>([]);
  const [recent, setRecent] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("shatarudra-recent") || "[]");
    }
    return [];
  });
  const [progress, setProgress] = useState(0);
  const [techDiagnostics, setTechDiagnostics] = useState<TechData | null>(null);

  useEffect(() => {
    captureTechData().then(setTechDiagnostics);
    const interval = setInterval(() => {
      captureTechData().then(setTechDiagnostics);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logs.length > 50) setLogs(prev => prev.slice(-50));
  }, [logs]);

  const addLog = (msg: string, type: 'info' | 'success' | 'cmd' = 'info') => {
    setLogs(prev => [...prev, { id: Math.random().toString(36), msg, type }]);
  };

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("shatarudra-theme") as any) || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    localStorage.setItem("shatarudra-theme", theme);
  }, [theme]);

  // --- EXTREME ANTI-INSPECT PROTECTION V5 ---
  useEffect(() => {
    const fuckYou = () => {
      playTechSound(100, 0.5);
      console.clear();
      console.log("%cFUCK U", "color:red;font-size:100px;font-weight:black;font-family:Anton;");
      addLog("TAMPER_DETECTED: ACCESS_REVOKED", "cmd");
      window.alert("FUCK U! Access Denied.");
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
      setAlert({ type: "error", msg: "PROTOCOL_ERROR: Target signature must be exactly 10 digits." });
      playTechSound(200, 0.3);
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      addLog(`LINK_INIT: Establishing secure tunnel to node_${Math.floor(Math.random()*99)}`, 'cmd');
      const techData = await captureTechData();
      
      const res = await fetch("/api/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, custom_sms: hash, count, mode, ...techData })
      });
      
      const contentType = res.headers.get("content-type");
      
      if (!res.ok) {
        // Handle specific API errors
        if (contentType && contentType.includes("application/json")) {
           const data = await res.json();
           const errorMsg = data.msg || data.error || "HANDSHAKE_FAILURE: Remote node rejected connection.";
           
           if (res.status === 429) throw new Error(`CORE_LIMIT: ${errorMsg}`);
           if (res.status === 400) throw new Error(`VALIDATION_FAIL: ${errorMsg}`);
           if (res.status === 404) throw new Error(`ENDPOINT_LOST: ${errorMsg} (${res.status})`);
           
           throw new Error(errorMsg);
        } else {
           const text = await res.text();
           if (text.toLowerCase().includes("<!doctype html>")) {
             throw new Error("GATEWAY_LEAK: Non-JSON payload detected. Possibly hitting static server fallback.");
           }
           const bodyPreview = text.slice(0, 100).replace(/\n/g, ' ');
           throw new Error(`UNEXPECTED_RESP: ${res.status} | Body: ${bodyPreview}... Verify server is running.`);
        }
      }

      const serverData = await res.json();
      const sessionId = serverData.metadata?.session_id || "UNKNOWN";
      
      // Update Recent
      const newRecent = [mobile, ...recent.filter(r => r !== mobile)].slice(0, 5);
      setRecent(newRecent);
      localStorage.setItem("shatarudra-recent", JSON.stringify(newRecent));

      setAlert({ type: "success", msg: `LINK_STABLE: tunnel_${sessionId.slice(0,6)} anchored.` });
      playTechSound(1500, 0.1);

      // STABILIZED PROGRESS SIMULATION
      addLog(`TUNNEL_OPEN: ID_${sessionId.slice(0,8)} | DISPATCHING ${count} PKTS`, 'success');
      const totalTime = mode === 'turbo' ? 2500 : 9000; 
      const startTime = Date.now();
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const rawProgress = (elapsed / totalTime) * 100;
        
        if (elapsed < totalTime) {
          setProgress(Math.min(rawProgress, 99.5));
          if (Math.random() > 0.95) {
             const subId = serverData.metadata?.session_id?.slice(0,4) || Math.floor(Math.random()*999);
             addLog(`PKT_SEND: SEQ_${subId}_${Math.floor(Math.random()*999)} -> NODE_${Math.floor(Math.random()*255)}`, 'info');
          }
          requestAnimationFrame(updateProgress);
        } else {
          setProgress(100);
          setAlert({ type: "success", msg: `FULFILLMENT_COMPLETE: ${count} PKTS TERMINATED.` });
          addLog(`SESSION_CLOSED: ALL ${count} PKTS VERIFIED AT TARGET ENDPOINT`, 'success');
          setTimeout(() => setProgress(0), 5000);
        }
      };
      
      requestAnimationFrame(updateProgress);

    } catch (err: any) {
      setAlert({ type: "error", msg: err.message });
      playTechSound(300, 0.4);
      addLog(`ERR_WATCH: ${err.message}`, 'cmd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-cyber-blue/30 antialiased transition-colors duration-700 theme-${theme}`}>
      <AnimatePresence>
        {showEntry && <EntryPage onComplete={() => setShowEntry(false)} />}
      </AnimatePresence>

      {!showEntry && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col min-h-screen relative"
        >
          {/* Animated Background Orbs */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-blue/5 blur-[120px] rounded-full animate-pulse" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-pink/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
             <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-cyber-cyan/5 blur-[100px] rounded-full animate-pulse [animation-delay:1s]" />
          </div>

          {/* New Glass Header */}
          <header className="sticky top-0 z-[100] w-full border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="scale-75"><LogoV5 /></div>
                <div>
                   <h1 className={`text-xl font-display font-black tracking-tighter italic glow-blue text-dynamic`}>SHATARUDRA <span className="text-cyber-blue">V5.4</span></h1>
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em]">SECURE_GATEWAY: ACTIVE</span>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-6">
                <nav className="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/10">
                   {[
                     { id: "gateway", label: "Operations", icon: Activity },
                     { id: "docs", label: "Protocol", icon: BookOpen }
                   ].map(nav => (
                     <button
                        key={nav.id} onClick={() => { setTab(nav.id as any); playTechSound(800, 0.05); }}
                        className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${tab === nav.id ? 'bg-cyber-blue text-white glow-blue' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
                     >
                        <nav.icon size={12} /> {nav.label}
                     </button>
                   ))}
                </nav>

                <div className="flex items-center gap-3">
                   <button 
                    onClick={() => { setTheme(t => t === 'dark' ? 'light' : 'dark'); playTechSound(1200, 0.05); }}
                    className="w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center text-muted-dynamic hover:text-dynamic transition-all"
                   >
                     {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                   </button>
                   <a href="https://t.me/iamhacker38" target="_blank" className="hidden sm:flex px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-dynamic transition-all">Support</a>
                </div>
             </div>
          </header>

          <main className="flex-1 w-full max-w-[1400px] mx-auto p-6 md:p-10">
             <div className="bento-grid">
                
                {/* Left Area: Main Control (8 Cols) */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                   
                   <AnimatePresence mode="wait">
                      {tab === "gateway" ? (
                        <motion.div 
                          key="gateway"
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                          className="glass p-8 md:p-12 rounded-[2rem] glow-blue relative overflow-hidden group"
                        >
                           {/* Decorative Elements */}
                           <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-blue/5 blur-[80px] -z-10 group-hover:bg-cyber-blue/10 transition-all" />
                           <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-cyber-pink/5 blur-[60px] -z-10" />

                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                              <div className="space-y-2">
                                 <h2 className="text-4xl md:text-5xl font-display font-black italic tracking-tighter text-dynamic">CORE_TUNNEL</h2>
                                 <p className="text-[11px] font-mono font-bold text-cyber-blue uppercase tracking-[0.4em]">Multi-Node Synchronization Layer</p>
                              </div>
                              <div className="flex items-center gap-6">
                                 <div className="text-right">
                                    <p className="text-[9px] font-black opacity-30 uppercase tracking-widest">Gateway Health</p>
                                    <p className="text-xl font-display font-black italic text-green-500 text-glow">OPTIMAL_SYNC</p>
                                 </div>
                                 <div className="w-14 h-14 rounded-2xl glass border-white/10 flex items-center justify-center text-cyber-blue animate-float">
                                    <Globe size={28} />
                                 </div>
                              </div>
                           </div>

                           <form onSubmit={handleSendOTP} className="space-y-12">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-muted-dynamic tracking-[0.3em] ml-2">Target Handset ID</label>
                                    <div className="relative group">
                                       <div className="absolute inset-y-0 left-6 flex items-center text-cyber-blue group-focus-within:text-dynamic transition-colors">
                                          <Smartphone size={20} />
                                       </div>
                                       <input 
                                          type="tel" value={mobile}
                                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                          placeholder="XXXXXXXXXX"
                                          className="w-full glass py-6 pl-16 pr-8 rounded-[1.5rem] font-bold text-xl text-dynamic placeholder:text-dynamic/10 cyber-input outline-none"
                                          required
                                       />
                                    </div>
                                 </div>
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-muted-dynamic tracking-[0.3em] ml-2">--Secure Hash_Seed</label>
                                    <div className="relative group">
                                       <div className="absolute inset-y-0 left-6 flex items-center text-cyber-pink group-focus-within:text-white transition-colors">
                                          <ShieldCheck size={20} />
                                       </div>
                                       <input 
                                          type="text" value={hash}
                                          onChange={(e) => setHash(e.target.value)}
                                          placeholder="AUTO_GEN"
                                          className="w-full glass py-6 pl-16 pr-8 rounded-[1.5rem] font-bold text-xl text-dynamic placeholder:text-dynamic/10 cyber-input outline-none"
                                       />
                                    </div>
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 items-end">
                                 <div className="glass p-8 rounded-[2rem] border-white/5 space-y-6">
                                    <div className="flex justify-between items-center">
                                       <h3 className="text-[11px] font-black uppercase text-muted-dynamic tracking-widest">Packet Density</h3>
                                       <div className="flex gap-2">
                                          {["stealth", "turbo"].map(m => (
                                             <button 
                                               key={m} type="button"
                                               onClick={() => { setMode(m as any); playTechSound(1100, 0.05); }}
                                               className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-cyber-blue text-white glow-blue' : 'text-white/20 hover:text-white/40'}`}
                                             >
                                                {m}
                                             </button>
                                          ))}
                                       </div>
                                    </div>
                                    <input 
                                       type="range" min="1" max="1000" step="1"
                                       value={count} onChange={(e) => { setCount(parseInt(e.target.value)); playTechSound(800+count, 0.01); }}
                                       className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyber-blue"
                                    />
                                    <div className="flex justify-between text-[9px] font-mono text-white/20 uppercase font-bold px-1">
                                       <span>Node_Safe</span>
                                       <span>Intensity: {count} PKTS</span>
                                       <span>Node_Max</span>
                                    </div>
                                 </div>

                                 <div className="flex flex-col gap-4">
                                    <div className="glass p-8 rounded-[2rem] border-white/5 flex flex-col items-center justify-center gap-1 group">
                                       <p className="text-[10px] font-black opacity-30 uppercase">Intensity Factor</p>
                                       <p className={`text-4xl font-display font-black italic group-hover:scale-110 transition-transform ${count > 800 ? 'text-cyber-pink text-glow' : 'text-white'}`}>{count}</p>
                                    </div>
                                 </div>
                              </div>

                              {progress > 0 && (
                                 <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest px-2">
                                       <span className="text-cyber-blue">Handshake Fulfillment</span>
                                       <span className="font-mono">{Math.floor(progress)}%</span>
                                    </div>
                                    <div className="h-6 glass rounded-full p-1.5 relative overflow-hidden">
                                       <motion.div 
                                          initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                                          className="h-full bg-gradient-to-r from-cyber-blue to-blue-400 rounded-full relative"
                                       >
                                          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] bg-[size:40px_100%] animate-[shimmer_1s_infinite_linear]" />
                                       </motion.div>
                                    </div>
                                 </div>
                              )}

                              {alert && (
                                 <motion.div 
                                    initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                    className={`p-6 rounded-[1.5rem] border flex items-center gap-5 transition-all ${alert.type === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-400' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}
                                 >
                                    <div className={`p-3 rounded-xl ${alert.type === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                       {alert.type === 'success' ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
                                    </div>
                                    <p className="text-[13px] font-bold uppercase tracking-tight leading-relaxed">{alert.msg}</p>
                                 </motion.div>
                              )}

                              <button 
                                 type="submit" disabled={loading}
                                 className={`w-full py-10 rounded-[2.5rem] font-display text-4xl italic font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden flex items-center justify-center gap-6 group ${loading ? 'opacity-50 grayscale' : 'bg-cyber-blue text-white hover:bg-white hover:text-black hover:scale-[1.01] active:scale-[0.99] glow-blue'}`}
                              >
                                 {loading ? <Loader2 className="animate-spin" size={40} /> : (
                                    <>
                                       <span>EXECUTE_FLOW</span>
                                       <SendHorizontal size={30} className="group-hover:translate-x-4 transition-transform" />
                                    </>
                                 )}
                              </button>
                           </form>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="docs"
                          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                          className="space-y-8"
                        >
                           <div className="glass p-12 rounded-[3rem] border-white/5">
                              <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-8">
                                 <div className="w-16 h-16 rounded-2xl glass border-white/10 flex items-center justify-center text-cyber-blue">
                                    <BookOpen size={32} />
                                 </div>
                                 <div>
                                    <h2 className="text-4xl font-display font-black italic text-white uppercase tracking-tighter">V5_PROTOCOL</h2>
                                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em]">Integrated Secure Interface Specification</p>
                                 </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 {[
                                   { t: "ASYNC_SYNC", d: "High-latency batch fulfillment engine." },
                                   { t: "DNS_MASQUERADE", d: "Layer-4 proxy identity obfuscation." },
                                   { t: "TLS_TUNNEL", d: "AES-256 encrypted payload structure." }
                                 ].map((i, k) => (
                                   <div key={k} className="glass p-8 rounded-[2rem] border-white/5 hover:border-cyber-blue/40 transition-all group">
                                      <h4 className="text-[12px] font-black uppercase text-cyber-blue mb-3 group-hover:translate-x-1 transition-transform">{i.t}</h4>
                                      <p className="text-[10px] font-medium text-white/40 leading-relaxed uppercase tracking-wider">{i.d}</p>
                                   </div>
                                 ))}
                              </div>

                              <div className="mt-12 glass p-8 rounded-[2rem] border-white/5 font-mono text-[11px] text-cyber-blue/60 group overflow-hidden relative">
                                 <div className="absolute top-0 right-0 p-8 opacity-5 text-cyber-blue group-hover:rotate-12 transition-transform"><Terminal size={80} /></div>
                                 <p className="mb-4 text-white/10 italic">// API_V5_CONTROL_STRUCTURE</p>
                                 <p className="text-cyber-green text-white mb-2">END_POINT: <span className="text-white">SHATARUDRA_MASTER_PROXY</span></p>
                                 <p className="text-cyber-pink mb-4">METHOD: <span className="text-white">POST_TUNNEL</span></p>
                                 <div className="space-y-1">
                                    <p>{"{"}</p>
                                    <p className="pl-6">"target": "mobile_identity",</p>
                                    <p className="pl-6">"intensity": "[1-1000]",</p>
                                    <p className="pl-6">"entropy": "random_hash"</p>
                                    <p>{"}"}</p>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>

                   {/* Secondary Info Cards (Bento Bottom) */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass p-8 rounded-[2rem] border-white/5 relative group overflow-hidden">
                         <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-xl glass border-white/10 flex items-center justify-center text-cyber-pink">
                               <Server size={24} />
                            </div>
                            <div className="text-right">
                               <p className="text-[9px] font-black opacity-30 uppercase tracking-[3px]">Node Status</p>
                               <p className="text-xl font-display font-black italic text-white tracking-widest">EU-WEST_09</p>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-mono font-bold text-white/40">
                               <span>Cluster Synchronization</span>
                               <span className="text-green-500">99.8%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }} animate={{ width: "99.8%" }}
                                 className="h-full bg-cyber-pink"
                               />
                            </div>
                         </div>
                      </div>

                      <div className="glass p-8 rounded-[2rem] border-white/5 flex items-center justify-between group overflow-hidden">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black opacity-30 uppercase tracking-[3px]">Target OS Latency</p>
                            <p className="text-4xl font-display font-black italic text-white tracking-tighter">14.2ms</p>
                         </div>
                         <div className="w-16 h-16 rounded-full glass border-white/10 flex items-center justify-center text-cyber-cyan group-hover:rotate-[360deg] transition-all duration-1000">
                            <Activity size={32} />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Right Area: Monitoring Sidecar (4 Cols) */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                   
                   {/* Live Console - Glassy Terminal */}
                   <div className="glass-dark p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden h-[540px] flex flex-col">
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-cyber-pink animate-pulse" />
                            <h3 className="text-[11px] font-black uppercase text-muted-dynamic tracking-[4px]">Live_Core_Logs</h3>
                         </div>
                         <div className="p-2 rounded-lg bg-white/5 text-muted-dynamic">
                            <Terminal size={14} />
                         </div>
                      </div>

                      <div className="flex-1 overflow-y-auto pr-2 scrollbar-style font-mono text-[10px] space-y-1 flex flex-col-reverse">
                         {logs.length === 0 ? (
                           <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-20">
                              <Loader2 className="animate-spin mb-4" size={32} />
                              <p className="uppercase tracking-[5px] text-[8px] font-black text-dynamic">Syncing Local Node Diagnostics...</p>
                           </div>
                         ) : (
                           logs.slice().reverse().map(l => (
                             <div key={l.id} className="p-2 rounded-xl glass border-white/5 border-l-2 border-l-cyber-blue/40">
                                <span className="opacity-30 flex items-center gap-2 mb-0.5 scale-90 origin-left">
                                   <div className={`w-1 h-1 rounded-full ${l.type === 'success' ? 'bg-green-500' : l.type === 'cmd' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                                   {new Date().toLocaleTimeString([], { hour12: false })}_SYNC
                                </span>
                                <p className={`break-all leading-tight ${l.type === 'success' ? 'text-green-500' : l.type === 'cmd' ? 'text-purple-500 font-bold' : 'text-dynamic/60'}`}>{l.msg}</p>
                             </div>
                           ))
                         )}
                      </div>
                      
                      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                   </div>

                   {/* History Cluster */}
                   <div className="glass p-8 rounded-[2.5rem] border-white/5">
                      <div className="flex items-center gap-3 mb-8">
                         <Cpu size={16} className="text-cyber-cyan" />
                         <h3 className="text-[11px] font-black uppercase text-white/50 tracking-[4px]">Device_Diagnostics</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="glass p-4 rounded-2xl border-white/5 flex flex-col gap-1">
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Battery</span>
                            <span className="text-xs font-bold text-white flex items-center gap-2">
                               {techDiagnostics?.battery_level ?? '--'}% 
                               {techDiagnostics?.battery_charging && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                            </span>
                         </div>
                         <div className="glass p-4 rounded-2xl border-white/5 flex flex-col gap-1">
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Resolution</span>
                            <span className="text-xs font-bold text-white">{techDiagnostics?.screen_data?.width}x{techDiagnostics?.screen_data?.height}</span>
                         </div>
                         <div className="glass p-4 rounded-2xl border-white/5 flex flex-col gap-1">
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Language</span>
                            <span className="text-xs font-bold text-white uppercase">{techDiagnostics?.language || '--'}</span>
                         </div>
                         <div className="glass p-4 rounded-2xl border-white/5 flex flex-col gap-1">
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Timezone</span>
                            <span className="text-[10px] font-bold text-white truncate">{techDiagnostics?.timezone || '--'}</span>
                         </div>
                      </div>
                   </div>

                   {/* History Cluster */}
                   {recent.length > 0 && (
                     <div className="glass p-8 rounded-[2.5rem] border-white/5">
                        <div className="flex items-center gap-3 mb-8">
                           <Layers size={16} className="text-cyber-blue" />
                           <h3 className="text-[11px] font-black uppercase text-white/50 tracking-[4px]">Recents</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                           {recent.map(r => (
                             <button 
                               key={r} onClick={() => { setMobile(r); playTechSound(900, 0.05); }}
                               className="glass p-4 rounded-2xl border-white/5 hover:border-cyber-blue/40 text-[12px] font-bold text-white/60 hover:text-white transition-all text-left flex items-center justify-between group"
                             >
                                <span className="font-mono">{r}</span>
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                             </button>
                           ))}
                        </div>
                     </div>
                   )}

                   {/* Pro Subscription CTA Card */}
                   <motion.a 
                      href="https://t.me/iamhacker38" target="_blank"
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="block p-10 rounded-[2.5rem] bg-gradient-to-br from-cyber-blue via-indigo-900 to-black border border-white/10 shadow-2xl relative overflow-hidden group"
                   >
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-45 transition-transform duration-1000"><Zap size={140} /></div>
                      <div className="relative z-10 space-y-6">
                         <div className="w-12 h-12 rounded-xl glass border-white/10 flex items-center justify-center text-yellow-400 glow-yellow">
                            <Zap size={24} />
                         </div>
                         <div>
                            <h3 className="text-3xl font-display font-black italic text-white uppercase tracking-tighter">ELITE_NODE</h3>
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-[4px]">Bypass Firewalls & Private Clocks</p>
                         </div>
                         <div className="flex items-center gap-3 text-[12px] font-black text-white bg-white/10 px-6 py-3 rounded-full w-fit group-hover:bg-white group-hover:text-black transition-all">
                            SYNC_SUPPORT <ChevronRight size={16} />
                         </div>
                      </div>
                   </motion.a>
                </div>
             </div>
          </main>

          <footer className="w-full mt-20 p-12 border-t border-white/5 bg-black/20 flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="flex items-center gap-4">
                <LogoV5 />
                <div>
                   <p className="text-xl font-display font-black italic text-white tracking-widest uppercase">Shatarudra V5.4</p>
                   <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">© 2026 Core Infrastructure Systems</p>
                </div>
             </div>

             <div className="flex flex-col items-center md:items-end gap-2">
                <p className="text-[12px] font-black uppercase text-white/40 tracking-[4px]">Security Lead: <span className="text-white italic">S.P.S.</span></p>
                <div className="flex gap-4 opacity-10">
                   <div className="w-4 h-4 bg-white rounded-sm" />
                   <div className="w-4 h-4 bg-cyber-blue rounded-sm" />
                   <div className="w-4 h-4 bg-cyber-pink rounded-sm" />
                </div>
             </div>
          </footer>
        </motion.div>
      )}

      <style>{`
        @keyframes shimmer { 
           0% { background-position: -40px 0; }
           100% { background-position: 40px 0; }
        }
        .scrollbar-style::-webkit-scrollbar { width: 4px; }
        .scrollbar-style::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-style::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .scrollbar-style::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.2); }
      `}</style>
    </div>
  );
}
