import { useEffect, useState } from 'react'
import { apiPost, apiGet } from '../api/client.js'
import AgentPanel from './AgentPanel.jsx'

const FOLDERS = [
  { key: 'inbox', label: '收件箱' },
  { key: 'sent', label: '已发送' },
  { key: 'drafts', label: '草稿' },
]

export default function EmailPage() {
  const [folder, setFolder] = useState('inbox')
  const [emails, setEmails] = useState([])
  const [current, setCurrent] = useState(null)
  const [summary, setSummary] = useState('')
  const [reply, setReply] = useState('')
  const [tone, setTone] = useState('正式')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [sendBody, setSendBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sendMsg, setSendMsg] = useState('')

  const refresh = async (f = folder) => {
    setError('')
    try {
      const r = await apiGet(`/api/email/inbox?folder=${f}&top=50`)
      setEmails(r)
    } catch (e) {
      setError('拉取邮件失败：' + e.message)
      setEmails([])
    }
  }

  useEffect(() => {
    refresh(folder)
  }, [folder])

  const open = async (id) => {
    setError('')
    setSummary('')
    setReply('')
    try {
      const m = await apiGet(`/api/email/message/${id}`)
      setCurrent(m)
    } catch (e) {
      setError('读取邮件失败：' + e.message)
    }
  }

  const run = async (kind) => {
    if (!current) return
    setLoading(true)
    setError('')
    try {
      const body = current.body || current.body_preview || ''
      if (kind === 'summary') {
        const r = await apiPost('/api/email/summarize', { body, tone })
        setSummary(r.summary)
      } else {
        const r = await apiPost('/api/email/reply', { body, tone })
        setReply(r.reply)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const send = async () => {
    setSending(true)
    setSendMsg('')
    setError('')
    try {
      await apiPost('/api/email/send', { to, subject, body: sendBody })
      setSendMsg('✓ 已发送')
      setTo(''); setSubject(''); setSendBody('')
      refresh(folder)
    } catch (e) {
      setSendMsg('发送失败：' + e.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <h2>邮件助手</h2>
      <div className="row">
        <div className="col" style={{ flexBasis: 360 }}>
          <div className="card">
            <h4>写邮件</h4>
            <input type="text" placeholder="收件人邮箱" value={to} onChange={(e) => setTo(e.target.value)} />
            <input type="text" style={{ marginTop: 8 }} placeholder="主题" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <textarea style={{ marginTop: 8, minHeight: 100 }} placeholder="正文" value={sendBody} onChange={(e) => setSendBody(e.target.value)} />
            <button className="primary" disabled={sending || !to || !subject} onClick={send}>发送</button>
            {sendMsg && <div className={sendMsg.startsWith('✓') ? '' : 'error'} style={{ marginTop: 8 }}>{sendMsg}</div>}
          </div>
          <div style={{ marginBottom: 10, marginTop: 10 }}>
            {FOLDERS.map((f) => (
              <button
                key={f.key}
                className={folder === f.key ? 'menu active' : 'menu'}
                style={{ display: 'inline-block', width: 'auto', marginRight: 6 }}
                onClick={() => setFolder(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          {error && <div className="error">{error}</div>}
          <div className="list">
            {emails.length === 0 && <div className="muted">（该文件夹暂无邮件）</div>}
            {emails.map((it) => (
              <div
                className="card"
                key={it.id}
                style={{ cursor: 'pointer' }}
                onClick={() => open(it.id)}
              >
                <h4>{it.subject || '（无主题）'}</h4>
                <div className="muted">{it.from?.name || it.from?.address}</div>
                <div className="muted">{it.received_at}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col">
          {!current && <div className="muted">点击左侧邮件查看全文</div>}
          {current && (
            <>
              <div className="result">
                <b>{current.subject}</b>
                <div className="muted">发件人：{current.from?.name} &lt;{current.from?.address}&gt;</div>
                <div className="muted">时间：{current.received_at}</div>
                <hr />
                <div style={{ whiteSpace: 'pre-wrap' }}>{current.body || current.body_preview || ''}</div>
              </div>
              <div style={{ marginTop: 12 }}>
                回复语气：
                <select value={tone} onChange={(e) => setTone(e.target.value)}>
                  <option>正式</option><option>友好</option><option>简洁</option>
                </select>
              </div>
              <button className="primary" disabled={loading} onClick={() => run('summary')}>生成摘要</button>
              <button className="primary" style={{ marginLeft: 8 }} disabled={loading} onClick={() => run('reply')}>生成回复草稿</button>
              {summary && <div className="result"><b>摘要：</b>{'\n'}{summary}</div>}
              {reply && <div className="result"><b>回复草稿：</b>{'\n'}{reply}</div>}
            </>
          )}
        </div>
      </div>
      <AgentPanel agent="email" placeholder="例如：查看收件箱邮件 / 给 xx 发邮件…" />
    </div>
  )
}
