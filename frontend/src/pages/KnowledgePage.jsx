import { useEffect, useRef, useState } from 'react'
import { apiPost, apiGet, apiUpload } from '../api/client.js'
import AgentPanel from './AgentPanel.jsx'

export default function KnowledgePage() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const refresh = () => apiGet('/api/knowledge/docs').then(setDocs).catch(() => {})

  useEffect(() => {
    refresh()
  }, [])

  const ask = async () => {
    setLoading(true)
    setError('')
    try {
      const r = await apiPost('/api/knowledge/ask', { question })
      setAnswer(r.answer)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const upload = async () => {
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setError('')
    try {
      await apiUpload('/api/knowledge/upload', file)
      refresh()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h2>知识助手</h2>
      <div className="row">
        <div className="col">
          <input type="text" placeholder="输入问题…" value={question} onChange={(e) => setQuestion(e.target.value)} />
          <button className="primary" disabled={loading || !question} onClick={ask}>提问</button>
          {error && <div className="error">{error}</div>}
        </div>
        <div className="col">
          {answer && <div className="result"><b>回答：</b>{'\n'}{answer}</div>}
        </div>
      </div>
      <div className="list">
        <h3>本地知识库</h3>
        <input ref={fileRef} type="file" accept=".txt,.md,.pdf,.xlsx,.xlsm" />
        <button className="primary" onClick={upload}>上传文档</button>
        {docs.map((d) => (
          <div className="card" key={d.path}>
            <h4>{d.name}</h4>
            <div className="muted">{d.status || d.path}</div>
          </div>
        ))}
      </div>
      <AgentPanel agent="knowledge" placeholder="例如：SNMP 是什么" />
    </div>
  )
}
