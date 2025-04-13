import React, { useEffect, useState } from 'react'
import mystyle from './css/dashboard.module.css'
import { useDashboard } from "../context/DashboardContext"
const WaiterDashboard = () => {
    const { totOrders, getData, updateStatus } = useDashboard();
    const [data, setData] = useState([]) || [];
    const [orders, setOrders] = useState([]) || [];
    async function fetchData() {
        const data = await getData();
        setData(data[0]);
        setOrders(data[1]);
        
    }
    useEffect(() => {
        fetchData();
    }, [])

    async function handleStatusUpdate(orderId, nextStatus) {
        await updateStatus(orderId, nextStatus);
        fetchData();
    }

    return (
        <div>
            <div className={mystyle.heading}>
                <h1>Admin Dashboard page</h1>
            </div>
            <div className={`${mystyle.dashboard_cards}`}>
                {
                    data.map((card, index) => (
                        <div className={mystyle.card} key={index}>
                            <i className={`fas ${card.icon} ${mystyle.icon} ${mystyle[card.colorClass]}`}></i>

                            <div className="card-text">
                                <p>{card.title}</p>
                                <h2>{card.value}</h2>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className={mystyle.orders_container}>
                <h2>Active Orders</h2>
                <table className={mystyle.orders_table}>
                    <thead>
                        <tr>
                            <th>Table #</th>
                            <th>Order ID</th>
                            <th>Items</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index}>
                                <td>{order.tableNumber}</td>
                                <td>{order.orderId}</td>
                                <td>{order.items.join(", ")}</td>
                                <td>
                                    <span className={`${mystyle.status_badge} ${mystyle[order.status.toLowerCase()]}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    {(() => {
                                        const statusFlow = ["pending", "preparing", "ready", "served", "paid"];
                                        const currentIndex = statusFlow.indexOf(order.status);
                                        console.log(order.status);
                                        const nextStatus = statusFlow[currentIndex + 1];

                                        return (
                                            <>
                                                {nextStatus && (
                                                    <button
                                                        className={mystyle.serve_btn}
                                                        onClick={() => handleStatusUpdate(order.orderId, nextStatus)}
                                                    >
                                                        Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                                                    </button>
                                                )}
                                                <button className={mystyle.view_btn}>View Details</button>
                                            </>
                                        );
                                    })()}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    )
}

export default WaiterDashboard
