import { useEffect, useRef, useState } from 'react'
import { apiPost, apiGet } from '../api/client.js'
import AgentPanel from './AgentPanel.jsx'

export default function ReportPage() {
  const [title, setTitle] = useState('工作简报')
  const [content, setContent] = useState('')
  const [report, setReport] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [parsing, setParsing] = useState(false)
  const [parseMsg, setParseMsg] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    apiGet('/api/report/list').then(setList).catch(() => {})
  }, [])

  const run = async () => {
    setLoading(true)
    setError('')
    try {
      const r = await apiPost('/api/report/generate', { title, content })
      setReport(r.report)
      apiGet('/api/report/list').then(setList).catch(() => {})
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const upload = async () => {
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setParsing(true)
    setParseMsg('')
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const r = await fetch('/api/report/parse', {
        method: 'POST',
        headers: { 'x-agent-token': 'local-agent-only' },
        body: fd,
      })
      if (!r.ok) throw new Error(`${r.status} ${await r.text()}`)
      const d = await r.json()
      setContent((prev) => (prev ? prev + '\n\n' : '') + `【${d.name}】\n${d.text}`)
      setParseMsg(`✓ 已解析 ${d.name}（${d.text.length} 字符）`)
    } catch (e) {
      setParseMsg('解析失败：' + e.message)
    } finally {
      setParsing(false)
    }
  }

  return (
    <div>
      <h2>报告助手</h2>
      <div className="row">
        <div className="col">
          <input type="text" placeholder="报告标题" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input ref={fileRef} type="file" accept=".txt,.md,.pdf,.xlsx,.xlsm" onChange={upload} />
            {parsing && <span className="muted">解析中…</span>}
            {parseMsg && <span className={parseMsg.startsWith('✓') ? '' : 'error'}>{parseMsg}</span>}
          </div>
          <textarea
            style={{ marginTop: 10 }}
            placeholder="粘贴待汇总内容，或上传 PDF/Excel 自动解析填入…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button className="primary" disabled={loading || !content} onClick={run}>生成报告</button>
          {error && <div className="error">{error}</div>}
        </div>
        <div className="col">
          {report && <div className="result"><b>报告：</b>{'\n'}{report}</div>}
        </div>
      </div>
      <div className="list">
        <h3>历史报告</h3>
        {list.map((it) => (
          <div className="card" key={it.id}>
            <h4>{it.title}</h4>
            <div className="muted">{it.content.slice(0, 120)}…</div>
          </div>
        ))}
      </div>
      <AgentPanel agent="report" placeholder="例如：把以下内容汇总成一份报告…" />
    </div>
  )
}
