import { useEffect, useState } from 'react'
import LoginPage from './components/LoginPage.jsx'
import Dashboard from './components/Dashboard.jsx'

export default function App() {
  const [user, setUser] = useState(() => sessionStorage.getItem('pn-user') || '')

  useEffect(() => {
    if (user) sessionStorage.setItem('pn-user', user)
    else sessionStorage.removeItem('pn-user')
  }, [user])

  if (!user) return <LoginPage onLogin={setUser} />
  return <Dashboard user={user} onLogout={() => setUser('')} />
}
