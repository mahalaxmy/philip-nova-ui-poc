import { useState } from 'react'
import { Brand, Ico } from './Icons.jsx'

function NetworkGraphic() {
  return (
    <div className="network-graphic" aria-hidden="true">
      <svg viewBox="0 0 520 520" fill="none">
        <circle cx="260" cy="260" r="190" stroke="#e7283a" strokeWidth="1" strokeDasharray="5 5" strokeOpacity="0.25" />
        <line x1="260" y1="260" x2="110" y2="170" stroke="#e7283a" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.38" />
        <line x1="260" y1="260" x2="410" y2="150" stroke="#e7283a" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.38" />
        <line x1="260" y1="260" x2="130" y2="370" stroke="#e7283a" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.38" />
        <line x1="260" y1="260" x2="400" y2="360" stroke="#e7283a" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.38" />
        <circle cx="260" cy="260" r="115" fill="#e7283a" fillOpacity="0.08" />
        <circle cx="110" cy="170" r="32" fill="#e7283a" fillOpacity="0.14" />
        <circle cx="410" cy="150" r="38" fill="#e7283a" fillOpacity="0.16" />
        <circle cx="130" cy="370" r="44" fill="#e7283a" fillOpacity="0.14" />
        <circle cx="400" cy="360" r="32" fill="#e7283a" fillOpacity="0.18" />
        <circle cx="260" cy="260" r="64" fill="#e7283a" fillOpacity="0.88" />
      </svg>
    </div>
  )
}

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please enter your username and password.')
      return
    }
    onLogin(email.trim())
  }

  return (
    <div className="login-shell">
      <NetworkGraphic />
      <form className="login-card" onSubmit={submit}>
        <Brand />
        <h1>Welcome to Speech & Text Intelligence</h1>
        <p className="sub">Sign in to continue</p>

        <div className="field">
          <span className="icon">{Ico.user}</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Username / Email"
            autoComplete="username"
          />
        </div>

        <div className="field">
          <span className="icon">{Ico.lock}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button className="btn btn-primary" type="submit">
          Log In
        </button>
      </form>
    </div>
  )
}
