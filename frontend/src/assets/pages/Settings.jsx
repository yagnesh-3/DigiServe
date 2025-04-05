import React from 'react'
import mystyle from "./css/settings.module.css"
import { NavLink, Outlet } from "react-router-dom"

const Settings = () => {
    const user = JSON.parse(localStorage.getItem("user"))

    console.log(user.name)
    return (
        <>
            <h1>Settings</h1>
            <div className={mystyle.mainDiv}>
                <div className={mystyle.SelectionDiv}>
                    <img src="https://www.webxcreation.com/event-recruitment/images/profile-1.jpg" alt="" className={mystyle.dp} />
                    <h3>{user.name}</h3>
                    <p>{user.role}</p>
                    <div className={mystyle.line}></div>
                    <div className={mystyle.nav}>
                        <NavLink to="personalInfo" className={({ isActive }) => isActive ? mystyle.activeNavLink : mystyle.NavLink}>
                            Personal Information <span className={mystyle.arrow}>▶</span>
                        </NavLink>
                        <NavLink to="employeeManagment" className={({ isActive }) => isActive ? mystyle.activeNavLink : mystyle.NavLink}>
                            Employee Managment <span className={mystyle.arrow}>▶</span>
                        </NavLink>
                        <NavLink to="openingHours" className={({ isActive }) => isActive ? mystyle.activeNavLink : mystyle.NavLink}>
                            Opening Hours <span className={mystyle.arrow}>▶</span>
                        </NavLink>
                        <NavLink to="loginAndPass" className={({ isActive }) => isActive ? mystyle.activeNavLink : mystyle.NavLink}>
                            Login and password <span className={mystyle.arrow}>▶</span>
                        </NavLink>
                    </div>
                </div>
                <div className={mystyle.resultsDiv}>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Settings
