import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createAgentSession, SessionManager } from "@earendil-works/pi-coding-agent";
import { getModel } from "@earendil-works/pi-ai/compat";
import { emailTools } from "./email-tools.js";
import { meetingTools, knowledgeTools, reportTools } from "./other-tools.js";

const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promptsDir = path.join(__dirname, "..", "prompts");

async function makeAgent(name: string, tools: unknown[]) {
  const { session } = await createAgentSession({
    model: getModel("deepseek", "deepseek-flash"),
    agentDir: path.join(promptsDir, name),
    cwd: process.cwd(),
    noTools: "builtin",
    customTools: tools as never,
    sessionManager: SessionManager.inMemory(),
  });
  return session;
}

const sessions = {
  chat: await makeAgent("chat", [
    ...emailTools,
    ...meetingTools,
    ...knowledgeTools,
    ...reportTools,
  ]),
  email: await makeAgent("email", emailTools),
  meeting: await makeAgent("meeting", meetingTools),
  knowledge: await makeAgent("knowledge", knowledgeTools),
  report: await makeAgent("report", reportTools),
};

console.log(
  "agents ready:",
  Object.entries(sessions)
    .map(([k, s]) => `${k}=[${s.getActiveToolNames().join(",")}]`)
    .join(" "),
);

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin || "";
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

const busy: Record<string, boolean> = {};

async function handle(name: string, req: express.Request, res: express.Response) {
  const session = (
    sessions as Record<
      string,
      { prompt: (m: string) => Promise<void>; getLastAssistantText: () => string }
    >
  )[name];
  if (!session) {
    res.status(404).json({ error: `未知 agent: ${name}` });
    return;
  }
  const message = (req.body?.message || "").toString().trim();
  if (!message) {
    res.status(400).json({ error: "message 不能为空" });
    return;
  }
  if (busy[name]) {
    res.status(429).json({ error: "agent 正忙，请稍候" });
    return;
  }
  busy[name] = true;
  try {
    await session.prompt(message);
    res.json({ reply: session.getLastAssistantText() });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  } finally {
    busy[name] = false;
  }
}

app.post("/api/chat", (req, res) => handle("chat", req, res));

app.post("/api/agents/:name", (req, res) => handle(req.params.name, req, res));

app.get("/api/agents", (_req, res) => {
  res.json(Object.keys(sessions));
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`agent-service listening on http://localhost:${PORT}`);
});
