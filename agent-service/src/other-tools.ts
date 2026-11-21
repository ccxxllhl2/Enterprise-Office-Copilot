import { Type } from "typebox";

const BACKEND = "http://localhost:8080";
const TOKEN = "local-agent-only";

async function callBackend(path: string, body: unknown): Promise<string> {
  const res = await fetch(`${BACKEND}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-agent-token": TOKEN,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`后端调用失败 ${res.status}: ${text.slice(0, 500)}`);
  }
  return text;
}

function result(text: string) {
  return { content: [{ type: "text" as const, text }], details: {} };
}

// 会议工具
export const meetingTools = [
  {
    name: "meeting_minutes",
    label: "Meeting minutes",
    description: "根据会议记录（文字稿）生成结构化会议纪要，包含议题、决议、行动项。",
    parameters: Type.Object({
      transcript: Type.String({ description: "会议记录全文" }),
    }),
    async execute(_toolCallId: string, params: { transcript: string }) {
      const text = await callBackend("/api/meeting/minutes", params);
      return result(text);
    },
  },
  {
    name: "meeting_weekly",
    label: "Weekly report",
    description: "根据会议纪要汇总生成周报（本周进展、下周计划、风险与求助）。",
    parameters: Type.Object({
      transcript: Type.String({ description: "会议记录或纪要全文" }),
    }),
    async execute(_toolCallId: string, params: { transcript: string }) {
      const text = await callBackend("/api/meeting/weekly", params);
      return result(text);
    },
  },
];

// 知识工具
export const knowledgeTools = [
  {
    name: "search_knowledge",
    label: "Search knowledge",
    description: "检索企业知识库并返回答案。参数 question 为用户的自然语言问题。",
    parameters: Type.Object({
      question: Type.String({ description: "要查询的问题" }),
    }),
    async execute(_toolCallId: string, params: { question: string }) {
      const text = await callBackend("/api/knowledge/ask", params);
      return result(text);
    },
  },
];

// 报告工具
export const reportTools = [
  {
    name: "generate_report",
    label: "Generate report",
    description: "将多段内容汇总为一份结构化报告。参数 title 为报告标题，content 为待汇总内容。",
    parameters: Type.Object({
      title: Type.Optional(Type.String({ description: "报告标题" })),
      content: Type.String({ description: "待汇总内容" }),
    }),
    async execute(_toolCallId: string, params: { title?: string; content: string }) {
      const text = await callBackend("/api/report/generate", {
        title: params.title || "工作简报",
        content: params.content,
      });
      return result(text);
    },
  },
];
