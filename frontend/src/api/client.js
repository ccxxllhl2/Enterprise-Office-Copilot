// 后端 API 基础地址：同源相对路径（由 nginx 反向代理）
export const API_BASE = ''
export const AGENT_TOKEN = 'local-agent-only'

export async function apiGet(path) {
  const r = await fetch(`${API_BASE}${path}`, {
    headers: { 'x-agent-token': AGENT_TOKEN },
  })
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`)
  return r.json()
}

export async function apiPost(path, body) {
  const r = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-agent-token': AGENT_TOKEN,
    },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`)
  return r.json()
}

export async function apiUpload(path, file) {
  const fd = new FormData()
  fd.append('file', file)
  const r = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'x-agent-token': AGENT_TOKEN },
    body: fd,
  })
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`)
  return r.json()
}
