import { useState } from 'react'
import Loginmain from './assets/pages/Loginmain'
import Home from './assets/pages/Home'
import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import Dashboard from './assets/pages/Dashboard'
import Sidebar from './assets/component/Sidebar'
import Products from './assets/pages/Products'
function App() {
  const location = useLocation();
  const [menu, setMenu] = useState([])
  async function getMenu() {
    const response = await fetch('http://localhost:5000/get-products')
    const data = await response.json()
    setMenu(data)
  }
  return (
    < >
      {location.pathname !== "/login" && <Sidebar />}
      <div className='contentDiv'>
        <Routes>
          <Route path="/login" element={<Loginmain />} />
          <Route path="/" element={<Home menu={menu} getMenu={getMenu} />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/products' element={<Products menu={menu} getMenu={getMenu} />} />
        </Routes>
      </div>
    </>
  )
}

export default App
