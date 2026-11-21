import { useState } from 'react'
import EmailPage from './EmailPage.jsx'
import MeetingPage from './MeetingPage.jsx'
import KnowledgePage from './KnowledgePage.jsx'
import ReportPage from './ReportPage.jsx'

const MENUS = [
  { key: 'email', label: '邮件助手' },
  { key: 'meeting', label: '会议助手' },
  { key: 'knowledge', label: '知识助手' },
  { key: 'report', label: '报告助手' },
]

export default function AdminPage() {
  const [active, setActive] = useState('email')

  return (
    <div className="layout-inner">
      <aside className="sidebar">
        <h2 style={{ color: '#fff', marginBottom: 16, fontSize: 16 }}>管理</h2>
        <nav>
          {MENUS.map((m) => (
            <button
              key={m.key}
              className={active === m.key ? 'menu active' : 'menu'}
              onClick={() => setActive(m.key)}
            >
              {m.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="content">
        {active === 'email' && <EmailPage />}
        {active === 'meeting' && <MeetingPage />}
        {active === 'knowledge' && <KnowledgePage />}
        {active === 'report' && <ReportPage />}
      </main>
    </div>
  )
}
