import { useState } from 'react'
import { agentChat } from '../api/agent.js'

// 可复用 Agent 对话面板，嵌入各管理页面
export default function AgentPanel({ agent, placeholder }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text }])
    setLoading(true)
    try {
      const r = await agentChat(text, agent)
      setMessages((m) => [...m, { role: 'assistant', text: r.reply }])
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', text: '⚠️ 出错了：' + e.message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h4>🤖 Agent 助手</h4>
      <div style={{ maxHeight: 260, overflowY: 'auto', margin: '8px 0' }}>
        {messages.length === 0 && <div className="muted">（用自然语言与该助手对话）</div>}
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8, textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <div
              style={{
                display: 'inline-block',
                maxWidth: '85%',
                padding: '8px 12px',
                borderRadius: 8,
                background: m.role === 'user' ? '#2563eb' : '#f3f4f6',
                color: m.role === 'user' ? '#fff' : '#111',
                whiteSpace: 'pre-wrap',
                textAlign: 'left',
                fontSize: 13,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="muted">Agent 思考中…</div>}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="text"
          placeholder={placeholder || '输入指令…'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          disabled={loading}
          style={{ flex: 1 }}
        />
        <button className="primary" style={{ marginTop: 0 }} onClick={send} disabled={loading || !input.trim()}>
          发送
        </button>
      </div>
    </div>
  )
}
