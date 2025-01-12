import { useEffect, useState } from 'react'

import './App.css'
import Header from './components/Header'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import Profile from './components/Profile'
import All from './components/All'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return (
    <div className="App ">
      <BrowserRouter>
        <Header status = {isAuthenticated}/>
        <Routes>
          <Route path='/' element={<Navigate to='/home' />}></Route>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/about' element={<About />}></Route>
          <Route path='/profile' element={isAuthenticated ? <Profile /> : <Navigate to='/home' />}></Route>
          <Route path='/all-students' element={isAuthenticated ? <All /> : <Navigate to='/home' />}></Route>
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
