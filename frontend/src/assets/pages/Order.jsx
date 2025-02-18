import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { useTables } from '../context/TableContext'
import mystyle from './css/order.module.css'
const Order = () => {
    const [tableName, setTableName] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const { addTable } = useTables();  // Get addTable function from context

    const handleAddTable = async () => {
        if (tableName.trim() === '') {
            setError("Please enter Table Number");
            return;
        }
        
        await addTable(tableName);  // Add new table via context
        setShowForm(false);  // Close the form
        setTableName("");  // Reset input
        setError("");  // Clear error message
    };


    const navigate = useNavigate();
    useEffect(() => {
        navigate('DineIn')
    }, [])
    return (
        <>
            <div>
                <div className={mystyle.mainBar}>
                    <div>
                        <h1 className={mystyle.heading}>Place Order</h1>
                    </div>
                    <button className={mystyle.newTableBtn} onClick={() => setShowForm(true)}>+ Add New Table</button>
                </div>
                <hr />
            </div>
            <div className={mystyle.modeSelector}>
                <NavLink to={'DineIn'} className={mystyle.modeBtn}>
                    <p className={mystyle.btnTxt}>Dine In</p>
                </NavLink>
                <NavLink to={'TakeAway'} className={mystyle.modeBtn}>
                    <p className={mystyle.btnTxt}>Take Away</p>
                </NavLink>
            </div>
            <Outlet />

            {showForm && (
                <div className={mystyle.overlay}>
                    <div className={mystyle.formContainer}>
                        <h2>Add New Table</h2>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <input
                            type="text"
                            placeholder="Enter Table Name"
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            className={mystyle.inputField}
                        />
                        <div className={mystyle.buttonGroup}>
                            <button onClick={handleAddTable} className={mystyle.addBtn}>Add</button>
                            <button onClick={() => setShowForm(false)} className={mystyle.cancelBtn}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )

}
export default Order
