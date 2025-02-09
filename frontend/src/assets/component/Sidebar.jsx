import React from 'react'
import { FaGoogleWallet } from "react-icons/fa";
import { FaHamburger, FaBell } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { MdSend, MdDashboard } from "react-icons/md";
import { HiClipboardList } from "react-icons/hi";
import { IoPersonSharp } from "react-icons/io5";
import mystyle from './css/Sidebar.module.css'
import { NavLink } from 'react-router-dom';
const Sidebar = () => {
    return (
        <div className={mystyle.maindiv}>
            <div className={mystyle.logodiv}>
                <FaGoogleWallet className={mystyle.logo} />
            </div>
            <div className={mystyle.sidebar}>
                <NavLink to="/" className={mystyle.sidebarlink}>
                    <AiFillHome className={mystyle.icon} />
                </NavLink>
                <NavLink to="/dashboard" className={mystyle.sidebarlink}>
                    <MdDashboard className={mystyle.icon} />
                </NavLink>
                <NavLink to="/orders" className={mystyle.sidebarlink}>
                    <HiClipboardList className={mystyle.icon} />
                </NavLink>
                <NavLink to="/products" className={mystyle.sidebarlink}>
                    <FaHamburger className={mystyle.icon} />
                </NavLink>
                <NavLink to="/notifications" className={mystyle.sidebarlink}>
                    <FaBell className={mystyle.icon} />
                </NavLink>
                <NavLink to="/customers" className={mystyle.sidebarlink}>
                    <IoPersonSharp className={mystyle.icon} />
                </NavLink>
                <NavLink to="/messages" className={mystyle.sidebarlink}>
                    <MdSend className={mystyle.icon} />
                </NavLink>
                <NavLink to="/settings" className={mystyle.sidebarlink}>
                    <FaGear className={mystyle.icon} />
                </NavLink>
            </div>

        </div>
    )
}

export default Sidebar
