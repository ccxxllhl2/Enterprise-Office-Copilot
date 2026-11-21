import { Type } from "typebox";

const BACKEND = "http://localhost:8080";
const TOKEN = "local-agent-only";

async function callBackend(path: string, method = "GET", body?: unknown): Promise<string> {
  const res = await fetch(`${BACKEND}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-agent-token": TOKEN,
    },
    body: body ? JSON.stringify(body) : undefined,
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

export const emailTools = [
  {
    name: "list_emails",
    label: "List emails",
    description:
      "列出指定邮件文件夹的邮件列表。folder 可选：inbox(收件箱)、sent(已发送)、drafts(草稿)。返回邮件 id、主题、发件人、时间等。",
    parameters: Type.Object({
      folder: Type.Optional(Type.String({ description: "文件夹名：inbox/sent/drafts，默认 inbox" })),
    }),
    async execute(
      _toolCallId: string,
      params: { folder?: string },
    ) {
      const folder = params.folder || "inbox";
      const text = await callBackend(`/api/email/inbox?folder=${encodeURIComponent(folder)}&top=20`);
      return result(text);
    },
  },
  {
    name: "read_email",
    label: "Read email",
    description: "读取单封邮件的全文。需要邮件 id（先用 list_emails 获取）。",
    parameters: Type.Object({
      id: Type.String({ description: "邮件 id" }),
    }),
    async execute(_toolCallId: string, params: { id: string }) {
      const text = await callBackend(`/api/email/message/${encodeURIComponent(params.id)}`);
      return result(text);
    },
  },
  {
    name: "send_email",
    label: "Send email",
    description:
      "发送一封邮件。to=收件人邮箱地址，subject=邮件主题，body=邮件正文。发送前应向用户确认收件人、主题和正文。",
    parameters: Type.Object({
      to: Type.String({ description: "收件人邮箱地址" }),
      subject: Type.String({ description: "邮件主题" }),
      body: Type.String({ description: "邮件正文" }),
    }),
    async execute(
      _toolCallId: string,
      params: { to: string; subject: string; body: string },
    ) {
      const text = await callBackend("/api/email/send", "POST", params);
      return result(`发送成功：${text}`);
    },
  },
  {
    name: "summarize_email",
    label: "Summarize email",
    description: "生成邮件内容的摘要。body=邮件正文全文。",
    parameters: Type.Object({
      body: Type.String({ description: "邮件正文" }),
    }),
    async execute(_toolCallId: string, params: { body: string }) {
      const text = await callBackend("/api/email/summarize", "POST", params);
      return result(text);
    },
  },
  {
    name: "draft_reply",
    label: "Draft reply",
    description: "为邮件起草回复。body=原邮件正文，tone=语气（正式/友好/简洁）。",
    parameters: Type.Object({
      body: Type.String({ description: "原邮件正文" }),
      tone: Type.Optional(Type.String({ description: "语气：正式/友好/简洁" })),
    }),
    async execute(_toolCallId: string, params: { body: string; tone?: string }) {
      const text = await callBackend("/api/email/reply", "POST", {
        body: params.body,
        tone: params.tone || "正式",
      });
      return result(text);
    },
  },
];
