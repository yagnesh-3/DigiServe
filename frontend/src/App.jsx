import { useState } from 'react'
import Loginmain from './assets/pages/Loginmain'
import Home from './assets/pages/Home'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";
import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import Dashboard from './assets/pages/WaiterDashboard.jsx'
import Sidebar from './assets/component/Sidebar'
import Products from './assets/pages/Products'
import PlaceOrder from './assets/pages/PlaceOrder'
import DineIn from './assets/pages/DineIn'
import TakeAway from './assets/pages/TakeAway'
import Order from './assets/pages/Order'
import { TableProvider } from './assets/context/TableContext.jsx'
import { DashboardProvider } from './assets/context/DashboardContext.jsx';
import Settings from './assets/pages/Settings.jsx'
import PersonalInfo from './assets/pages/PersonalInfo.jsx'
import Orders from './assets/pages/Orders.jsx'
import AdminDashBoard from './assets/pages/AdminDashBoard.jsx';
import WaiterDashboard from './assets/pages/WaiterDashboard.jsx';
import Notifications from './assets/pages/Notifications.jsx';
import PlaceDineInOrder from './assets/pages/PlaceDineInOrder.jsx';
function App() {
  const location = useLocation();
  const [menu, setMenu] = useState([])
  async function getMenu() {
    const response = await fetch('http://localhost:5000/product/get-products')
    const data = await response.json()
    setMenu(data)
  }

  const data = JSON.parse(localStorage.getItem('user')) || ""
  const userRole = data.role


  const dashboardRoutes = {
    admin: <AdminDashBoard />,
    waiter: <WaiterDashboard />,
    chef: "/chefDashboard"
  };

  return (
    < >
      <DashboardProvider>
        <TableProvider>
          {location.pathname !== "/login" && <Sidebar />}
          <div className='contentDiv'>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Bounce}
            />

            <Routes>
              <Route path="/login" element={<Loginmain />} />
              <Route path='/placeOrder' element={<PlaceOrder />} />
              <Route path='/order' element={<Order />}>
                <Route path='DineIn' element={<DineIn />} />
                <Route path='TakeAway' element={<TakeAway />} />
              </Route>
              <Route path='/order/place-order' element={<PlaceDineInOrder />} />
              <Route path='/orders' element={<Orders />} />

              <Route path='/settings' element={<Settings />} >
                <Route path='personalInfo' element={<PersonalInfo />} />
                <Route path='employeeManagment' element={<PersonalInfo />} />
                <Route path='openingHours' element={<PersonalInfo />} />
                <Route path='loginAndPass' element={<PersonalInfo />} />
              </Route>
              <Route path='/' element={<AdminDashBoard />} />
              <Route path='/products' element={<Products menu={menu} getMenu={getMenu} />} />
              <Route path='/notifications' element={<Notifications />} />

            </Routes>
          </div>
        </TableProvider>
      </DashboardProvider>
    </>
  )
}

export default App
