import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import S1TouchScreen from './screens/S1TouchScreen'
import S2TVDisplay from './screens/S2TVDisplay'
import S3LEDWall from './screens/S3LEDWall'
import Home from './screens/Home'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/s1" element={<S1TouchScreen />} />
        <Route path="/s2" element={<S2TVDisplay />} />
        <Route path="/s3" element={<S3LEDWall />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
