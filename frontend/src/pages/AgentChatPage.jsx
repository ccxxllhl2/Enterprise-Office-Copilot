import { useState } from 'react'
import { agentChat } from '../api/agent.js'

// 粗略估算 token 数：英文约 4 字符/token，中文约 1 字符/token
function estimateTokens(text) {
  if (!text) return 0
  let ascii = 0
  let nonAscii = 0
  for (const ch of text) {
    if (ch.codePointAt(0) <= 0x7f) ascii++
    else nonAscii++
  }
  return Math.ceil(ascii / 4 + nonAscii)
}

export default function AgentChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: '你好，我是 Enterprise Office Copilot 综合办公助手。我可以帮你：\n\n📧 邮件：查收/阅读/发送邮件、生成摘要、起草回复\n📝 会议：生成会议纪要、汇总周报\n📚 知识：检索企业知识库并回答问题\n📊 报告：将内容汇总为结构化报告',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setError('')
    setMessages((m) => [...m, { role: 'user', text }])
    setLoading(true)
    try {
      const r = await agentChat(text)
      setMessages((m) => [...m, { role: 'assistant', text: r.reply }])
    } catch (e) {
      setError(e.message)
      setMessages((m) => [...m, { role: 'assistant', text: '⚠️ 出错了：' + e.message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2>Agent Chat</h2>
      <div
        className="chat"
        style={{
          flex: 1,
          overflowY: 'auto',
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 6,
          padding: 16,
          marginBottom: 12,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flex: 1 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 12, textAlign: m.role === 'user' ? 'right' : 'left' }}>
              <div
                style={{
                  display: 'inline-block',
                  maxWidth: '75%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: m.role === 'user' ? '#2563eb' : '#f3f4f6',
                  color: m.role === 'user' ? '#fff' : '#111',
                  whiteSpace: 'pre-wrap',
                  textAlign: 'left',
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && <div className="muted">Agent 思考中…</div>}
          {error && <div className="error">{error}</div>}
        </div>
        <div style={{ textAlign: 'right', marginTop: 8 }}>
          <span className="muted">≈ {estimateTokens(input)} tokens</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <textarea
          rows={3}
          placeholder="例如：给 ccxxll23@163.com 发一封主题为「测试」的邮件…（Enter 发送，Shift+Enter 换行）"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          disabled={loading}
          style={{ flex: 1, minHeight: 60 }}
        />
        <button className="primary" style={{ marginTop: 0 }} onClick={send} disabled={loading || !input.trim()}>
          发送
        </button>
      </div>
    </div>
  )
}
