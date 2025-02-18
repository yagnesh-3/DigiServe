import React from 'react'
import { useLocation } from 'react-router-dom';
const PlaceOrder = () => {
    const location = useLocation();
    const { cart, orderId, total } = location.state || { cart: [], orderId: "", total: 0 };

    console.log()
    return (
        <div>
            <h1>Place Order Page</h1>
            <h2>Order ID: {orderId}</h2>
        </div>
    )
}

export default PlaceOrder
