import React, { useEffect, useState } from 'react'
import mystyle from './css/orders.module.css'
import { useTables } from "../context/TableContext.jsx";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { getOrders, handlePayment } = useTables();
    async function updateOrders() {
        const ord = await getOrders();
        setOrders(ord);
    }
    useEffect(() => {
        updateOrders();
    }, [])

    console.log(orders)

    const [isPaymentClicked, setIsPaymentClicked] = useState(false);

    function handleClick(orderId) {
        setSelectedIndex(orderId)
    }

    const [paymentMode, setPaymentMode] = useState('');

    const handlePaymentChange = (event) => {
        setPaymentMode(event.target.value);
        console.log("Selected Payment Mode:", event.target.value);
    };

    function handleCancel() {
        setIsPaymentClicked(false)
        setPaymentMode("")
    }

    const handlePay = async (id) => {
        try {
            const resp = await handlePayment(id);
            if (resp.status) {
                setIsPaymentClicked(false);
                alert(resp.message)
            }
            console.log(resp)
            updateOrders();
        } catch (error) {
            console.log(error)
        }
    }
    // console.log(orders[selectedIndex].orderId)

    return (
        <>
            <div className={mystyle.mainDiv}>
                <div className={mystyle.leftSide}>
                    <h1>Pending Orders</h1>
                    <div className={mystyle.orderList}>
                        <h1 className={mystyle.heading}>All Orders</h1>
                        <div className={mystyle.list}>
                            {orders.map((order, index) => (
                                <div className={`${mystyle.listItem} ${selectedIndex === index ? mystyle.selected : ''}`}
                                    key={order.orderId} onClick={() => handleClick(index)}>

                                    <div>
                                        <h2 className={mystyle.listItemHeading}>{order.orderId}</h2>
                                        <h3>{order.table.tableName}</h3>
                                    </div>
                                    <div>
                                        <h2 className={mystyle.listItemHeading}>{order.status}</h2>
                                        <h3>₹{order.totalPrice}</h3>
                                    </div>
                                </div>
                            ))
                            }
                        </div>
                    </div>
                </div>
                {orders.length > 0 &&
                    <div className={mystyle.rightSide}>
                        <div className={mystyle.heading2}>
                            <h1>Order #{orders[selectedIndex].orderId}</h1>
                            <h2>{orders[selectedIndex].status}</h2>
                        </div>
                        <div className={mystyle.detailsDiv}>
                            <h2>Details</h2>
                            <div className={mystyle.DetailMain}>
                                <div className={mystyle.Detail}>
                                    <h3>Table Name</h3>
                                    <p>{orders[selectedIndex].table.tableName}</p>
                                </div>
                                <div className={mystyle.Detail}>
                                    <h3>Order Id</h3>
                                    <p>{orders[selectedIndex].orderId}</p>
                                </div>
                                <div className={mystyle.Detail}>
                                    <h3>Customer</h3>
                                    <p>Yagnesh</p>
                                </div>
                                <div className={mystyle.Detail}>
                                    <h3>Payment</h3>
                                    <p>{orders[selectedIndex].status}</p>
                                </div>
                            </div>
                        </div>
                        <h2>Order Items</h2>
                        <div className={mystyle.sdiv}>
                            <div className={mystyle.orderItems}>
                                {orders[selectedIndex].items.map((item) => (
                                    <div className={mystyle.item} key={item.product._id}>
                                        <img src={item.product.imageUrl} alt={item.name} />
                                        <p className={mystyle.itemName}>{item.product.name}<span> x{item.quantity}</span></p>
                                        <p className={mystyle.itemPrice}>₹{item.product.price}</p>
                                    </div>
                                ))}
                            </div>
                            <div className={mystyle.btnDiv}>
                                <button className={mystyle.print}>Print Invoice</button>
                                {orders[selectedIndex].status != "paid" && <button className={mystyle.print} onClick={() => setIsPaymentClicked(true)}>Payment</button>}
                            </div>
                        </div>
                    </div>
                }
            </div >
            {isPaymentClicked && <div className={mystyle.overlay}>
                <div className={mystyle.payment}>
                    <h1>Choose payment mode</h1>
                    <div className={mystyle.pways}>
                        <label>
                            <input type="radio" name="paymentMode" value="cash" onChange={handlePaymentChange} />
                            Cash
                        </label>
                        <br />
                        <label>
                            <input type="radio" name="paymentMode" value="upi" onChange={handlePaymentChange} />
                            UPI
                        </label>
                        <br />
                        <label>
                            <input type="radio" name="paymentMode" value="card" onChange={handlePaymentChange} />
                            card
                        </label>
                    </div>
                    {paymentMode != '' && <p>Selected Mode: {paymentMode}</p>}
                    <div className={mystyle.btns}>
                        <button className={mystyle.cancelButton} onClick={() => handleCancel()}>Cancel</button>
                        <button className={mystyle.payButton} onClick={() => handlePay(orders[selectedIndex]._id)}>Pay</button>
                    </div>
                </div>
            </div >}
        </>
    )
}

export default Orders
