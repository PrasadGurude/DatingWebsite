import { useState } from 'react'

import './App.css'
import Header from './components/Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path='/home' Component={}></Route>
          <Route></Route>
          <Route></Route>
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
