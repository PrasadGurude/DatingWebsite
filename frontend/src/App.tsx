import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import Profile from './components/Profile'
import All from './components/All'
import MatchStatus from './components/MatchStatus'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  return (
    <div className="App ">
      <BrowserRouter>
        <Header  isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path='/' element={<Navigate to='/home' />}></Route>
          <Route path='/home' element={<Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}></Route>
          <Route path='/about' element={<About />}></Route>
          <Route path='/status' element={isAuthenticated ? <MatchStatus/> : <Navigate to='/home' />}></Route>
          <Route path='/profile' element={isAuthenticated ? <Profile isAuthenticated={isAuthenticated} /> : <Navigate to='/home' />}></Route>
          <Route path='/all-students' element={isAuthenticated ? <All isAuthenticated={isAuthenticated}/> : <Navigate to='/home' />}></Route>
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
