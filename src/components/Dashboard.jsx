import { useMemo, useState } from 'react'
import { Brand, Ico } from './Icons.jsx'
import SttPanel from './SttPanel.jsx'
import TtsPanel from './TtsPanel.jsx'


export default function Dashboard({ user, onLogout }) {
  const [mode, setMode] = useState('stt')
  const [sessionKey, setSessionKey] = useState(0)
  const [activeId, setActiveId] = useState(null)
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pn-history')) || []
    } catch {
      return []
    }
  })

  const initials = useMemo(() => {
    const part = user.split('@')[0]
    return part.slice(0, 2).toUpperCase()
  }, [user])

  function persist(next) {
    setHistory(next)
    try {
      localStorage.setItem('pn-history', JSON.stringify(next))
    } catch {
      // ignore
    }
  }

  function addHistory(item) {
    const next = [item, ...history.filter((h) => h.id !== item.id)]
    persist(next)
    setActiveId(item.id)
  }

  function handleNew() {
    setActiveId(null)
    setSessionKey((k) => k + 1)
  }

  const active = history.find((h) => h.id === activeId)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand compact light />
        <button className="nav-btn active" onClick={handleNew} title="Start new session">
          {Ico.plus}
          <span>New</span>
        </button>

        <div className="history-label">HISTORY</div>
        <div className="history-list">
          {history.length === 0 ? (
            <p className="empty" style={{ color: 'rgba(255,255,255,.65)', fontSize: '13px', padding: '10px 8px' }}>
              Uploads will be saved here
            </p>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                className={`history-item ${item.id === activeId ? 'active' : ''}`}
                onClick={() => {
                  setActiveId(item.id)
                  setMode(item.type)
                }}
              >
                <span className="chip">{item.type.toUpperCase()}</span>
                <span className="meta">
                  <div className="title">{item.fileName || item.preview || item.id}</div>
                  <div className="date">{item.date}</div>
                </span>
              </button>
            ))
          )}
        </div>

        <div className="sidebar-foot">
          <div className="user-chip">
            <div className="avatar">{initials}</div>
            <span>{user.split('@')[0]}</span>
            <button className="logout" onClick={onLogout} title="Log out">{Ico.logout}</button>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <h1>Speech & Text Intelligence</h1>
          <div className="toggle" role="tablist" aria-label="Mode">
            <button className={mode === 'stt' ? 'active' : ''} onClick={() => setMode('stt')}>
              SPEECH TO TEXT
            </button>
            <button className={mode === 'tts' ? 'active' : ''} onClick={() => setMode('tts')}>
              TEXT TO SPEECH
            </button>
          </div>
        </div>

        {mode === 'stt' ? (
          <SttPanel
            key={`stt-${sessionKey}-${activeId || 'new'}`}
            onComplete={addHistory}
            restore={active?.type === 'stt' ? active : null}
          />
        ) : (
          <TtsPanel
            key={`tts-${sessionKey}-${activeId || 'new'}`}
            onComplete={addHistory}
            restore={active?.type === 'tts' ? active : null}
          />
        )}
      </main>
    </div>
  )
}
