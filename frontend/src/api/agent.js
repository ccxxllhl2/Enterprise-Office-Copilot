// Pi Agent 服务 API 封装：同源相对路径（由 nginx 反向代理）
const AGENT_BASE = ''

export async function agentChat(message, agent = 'chat') {
  const path = agent === 'chat' ? '/api/chat' : `/api/agents/${agent}`
  const r = await fetch(`${AGENT_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`)
  return r.json()
}
