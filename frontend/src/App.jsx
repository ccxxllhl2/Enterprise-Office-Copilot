import { useState } from 'react'
import AgentChatPage from './pages/AgentChatPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

export default function App() {
  const [view, setView] = useState('chat')

  return (
    <div className="layout-col">
      <header className="topbar">
        <h1 className="logo">Enterprise Office Copilot</h1>
        <div className="tabs">
          <button
            className={view === 'chat' ? 'tab active' : 'tab'}
            onClick={() => setView('chat')}
          >
            💬 Agent Chat
          </button>
          <button
            className={view === 'admin' ? 'tab active' : 'tab'}
            onClick={() => setView('admin')}
          >
            ⚙️ Admin
          </button>
        </div>
      </header>
      <main className="main-area">
        {view === 'chat' ? <AgentChatPage /> : <AdminPage />}
      </main>
    </div>
  )
}
