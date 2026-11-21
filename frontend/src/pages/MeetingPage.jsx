import { useEffect, useState } from 'react'
import { apiPost, apiGet } from '../api/client.js'
import AgentPanel from './AgentPanel.jsx'

export default function MeetingPage() {
  const [transcript, setTranscript] = useState('')
  const [minutes, setMinutes] = useState('')
  const [weekly, setWeekly] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    apiGet('/api/meeting/list').then(setList).catch(() => {})
  }, [])

  const run = async (kind) => {
    setLoading(true)
    setError('')
    try {
      if (kind === 'minutes') {
        const r = await apiPost('/api/meeting/minutes', { transcript })
        setMinutes(r.minutes)
      } else {
        const r = await apiPost('/api/meeting/weekly', { transcript })
        setWeekly(r.report)
      }
      apiGet('/api/meeting/list').then(setList).catch(() => {})
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>会议助手</h2>
      <div className="row">
        <div className="col">
          <textarea placeholder="粘贴会议记录…" value={transcript} onChange={(e) => setTranscript(e.target.value)} />
          <button className="primary" disabled={loading || !transcript} onClick={() => run('minutes')}>生成纪要</button>
          <button className="primary" style={{ marginLeft: 8 }} disabled={loading || !transcript} onClick={() => run('weekly')}>生成周报</button>
          {error && <div className="error">{error}</div>}
        </div>
        <div className="col">
          {minutes && <div className="result"><b>会议纪要：</b>{'\n'}{minutes}</div>}
          {weekly && <div className="result"><b>周报：</b>{'\n'}{weekly}</div>}
        </div>
      </div>
      <div className="list">
        <h3>历史纪要</h3>
        {list.map((it) => (
          <div className="card" key={it.id}>
            <h4>#{it.id}</h4>
            <div className="muted">{it.minutes.slice(0, 120)}…</div>
          </div>
        ))}
      </div>
      <AgentPanel agent="meeting" placeholder="例如：根据以下会议记录生成纪要…" />
    </div>
  )
}
