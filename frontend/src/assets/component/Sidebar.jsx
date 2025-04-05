import React, { useEffect } from 'react'
import { FaGoogleWallet } from "react-icons/fa";
import { FaHamburger, FaBell } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { FaGear } from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { MdSend, MdDashboard, MdDining, MdLogout } from "react-icons/md";
import { HiClipboardList } from "react-icons/hi";
import { IoPersonSharp } from "react-icons/io5";
import mystyle from './css/Sidebar.module.css';
import { useTables } from "../context/TableContext.jsx";
import { NavLink, useNavigate } from 'react-router-dom';
const Sidebar = () => {
    const { backendUrl } = useTables();
    const navigate = useNavigate();

    async function auth() {
        try {
            const response = await fetch(`${backendUrl}/auth/authenticate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: localStorage.getItem("token")
                })
            });

            if (response.status === 401) { // If unauthorized, clear localStorage and redirect
                // handleLogout();

                toast.error(response.statusText);
                navigate("/login");
                return;
            }

            const resp = await response.json();
            console.log(resp);
            console.log(resp.status)
            if (!resp.status) {
                toast.error(response.statusText);
                navigate("/login");
            }
        } catch (error) {
            console.error("Auth error:", error);
            toast.error(response.statusText);
            navigate("/login");
        }
    }

    const data = JSON.parse(localStorage.getItem('user'))
    const userRole = data.role

    function handleLogout() {
        localStorage.clear();
        toast.error("logout success!");
        auth();
    }

    useEffect(() => {
        auth()
    }, [])


    const dashboardRoutes = {
        admin: "/adminDashboard",
        waiter: "/waiterDashboard",
        chef: "/chefDashboard"
    };

    return (
        <div className={mystyle.maindiv}>
            <div className={mystyle.logodiv}>
                <FaGoogleWallet className={mystyle.logo} />
            </div>
            <div className={mystyle.sidebar}>

                <NavLink to="/" className={mystyle.sidebarlink}>
                    <MdDashboard className={mystyle.icon} />
                    <p className={mystyle.iconName}>Dashboard</p>
                </NavLink>
                <NavLink to="/order" className={mystyle.sidebarlink}>
                    <MdDining className={mystyle.icon} />
                    <p className={mystyle.iconName}>Order</p>
                </NavLink>
                <NavLink to="/orders" className={mystyle.sidebarlink}>
                    <HiClipboardList className={mystyle.icon} />
                    <p className={mystyle.iconName}>Orders</p>
                </NavLink>
                <NavLink to="/products" className={mystyle.sidebarlink}>
                    <FaHamburger className={mystyle.icon} />
                    <p className={mystyle.iconName}>Products</p>
                </NavLink>
                <NavLink to="/notifications" className={mystyle.sidebarlink}>
                    <FaBell className={mystyle.icon} />
                    <p className={mystyle.iconName}>Notifications</p>
                </NavLink>

                <NavLink to="/settings" className={mystyle.sidebarlink}>
                    <FaGear className={mystyle.icon} />
                    <p className={mystyle.iconName}>Settings</p>
                </NavLink>
                <NavLink onClick={handleLogout} to="/login" className={mystyle.sidebarlink}>
                    <MdLogout className={mystyle.icon} />
                    <p className={mystyle.iconName}>Logout</p>
                </NavLink>
            </div>

        </div>
    )
}

export default Sidebar
