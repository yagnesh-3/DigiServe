import React from 'react'
import mystyle from "./css/PersonalInfo.module.css"
const PersonalInfo = () => {
    return (
        <div className={mystyle.mainDiv}>
            <h1>Personal Info</h1>
            <form >
                <div className={mystyle.formDiv}>
                    <div className={mystyle.feild}>
                        <h3>First name</h3>
                        <input type="text" name="" id="" />
                    </div>
                    <div className={mystyle.feild}>
                        <h3>last name</h3>
                        <input type="text" name="" id="" />
                    </div>
                    <div className={mystyle.feild}>
                        <h3>Email</h3>
                        <input type="email" name="" id="" />
                    </div>
                    <div className={mystyle.feild}>
                        <h3>Phone Number</h3>
                        <input type="tel" name="" id="" />
                    </div>
                    <div className={mystyle.feild}>
                        <h3>Date Of Birth</h3>
                        <input type="date" name="" id="" />
                    </div>
                    <div className={mystyle.feild}>
                        <h3>Position</h3>
                        <input type="text" name="" id="" disabled value="cashier" />
                    </div>
                    <input type="submit" value="save Changes" className={mystyle.saveChanges} />
                </div>
            </form>
        </div>
    )
}

export default PersonalInfo
