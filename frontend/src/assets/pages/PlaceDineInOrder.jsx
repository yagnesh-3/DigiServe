import React, { useEffect, useState } from 'react'
import mystyle from './css/placeDineInOrder.module.css'
import { useTables } from "../context/TableContext.jsx";
import { useLocation, useNavigate } from "react-router-dom";
const PlaceDineInOrder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { tableSel } = location.state || {};
    const { getOrderId, orderId, cart, updateQuantity, table, getTable, placeOrder, getCart } = useTables();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        city: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            await getTable();
            await getOrderId();
            await getCart(tableSel);
            await getTable(tableSel);
        };

        fetchData();
        // updateData();
    }, []);
    const [subTotal, setSubTotal] = useState(0);
    const [gst, setGst] = useState(0);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        if (table?.cartTotal !== undefined) {
            setSubTotal(table.cartTotal);
            setGst(Number((table.cartTotal * 0.10).toFixed(2)));
            setTotal(table.cartTotal + gst);
        }
    }, [table]);
    console.log(table)


    // imageUrl
    // :
    // "https://cdn.uengage.io/uploads/5/image-342266-1715596630.png"
    // name
    // :
    // "Margherita Pizza"
    // price
    // :
    // 349
    // quantity
    // :
    // 1
    // _id
    // :
    // "67bf42a2f4bf330fd18435ff"

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
    };

    const [isConformed, setIsConformed] = useState(false);

    const handlePlaceOrder = async () => {
        const resp = await placeOrder();
        console.log(resp)
        setIsConformed(resp.status)

    }

    const handleClose = () => {
        setIsConformed(false);
        navigate("/order");

    }

    return (
        <div>
            <h1 className={mystyle.heading}>Order Id:{orderId}</h1>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className={mystyle.inputContainer}>
                        <div className={mystyle.input}>
                            <label htmlFor="name">Name:</label>
                            <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className={mystyle.input}>
                            <label htmlFor="email">Email:</label>
                            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className={mystyle.input}>
                            <label htmlFor="phoneNumber">Phone Number:</label>
                            <input id="phoneNumber" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                        </div>
                        <div className={mystyle.input}>
                            <label htmlFor="city">City:</label>
                            <input id="city" type="text" name="city" value={formData.city} onChange={handleChange} required />
                        </div>
                    </div>
                </form>
            </div>


            <div className={mystyle.secondaryDiv}>
                {cart && cart.cart ? (
                    <>
                        <div className={mystyle.cartContainer}>
                            {cart.cart.map((item) => (
                                <div key={item._id} className={mystyle.cartItem}>
                                    <img src={item.imageUrl} alt={item.name} />
                                    <p>{item.name}</p>
                                    <p className={mystyle.price}>₹ {item.price * item.quantity}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <button onClick={() => updateQuantity(item._id, -1)} className={mystyle.qbtn2}>X</button>
                                </div>
                            ))}
                        </div>
                        <div className={mystyle.PriceDiv}>
                            <h2 className={mystyle.heading}>Billing Details</h2>
                            <div className={mystyle.Price}>
                                <div className={`${mystyle.subTotal} ${mystyle.highlight}`}>
                                    <p>SubTotal: </p>
                                    <p>₹{subTotal}</p>
                                </div>
                                <div className={mystyle.subTotal}>
                                    <p>Tax: </p>
                                    <p>₹{gst}</p>
                                </div>
                                <hr />
                                <div className={`${mystyle.subTotal} ${mystyle.total}`}>
                                    <p>Total: </p>
                                    <p>₹{total}</p>
                                </div>
                            </div>

                            <div className={mystyle.payButton}>
                                <button className={mystyle.invoiceBtn}>Print Invoice</button>
                                <button className={mystyle.orderBtn} onClick={handlePlaceOrder}>Place Order</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Loading order details...</p> // Show a loading message or skeleton
                )}
            </div>



            {/* Overlay for Order Confirmation */}
            {isConformed && (
                <div className={mystyle.overlay}>
                    <div className={mystyle.modal}>
                        <h2>Order Confirmed!</h2>
                        <p>Your order ID: <strong>{orderId}</strong></p>
                        <button className={mystyle.closeBtn} onClick={() => handleClose()}>Close</button>
                    </div>
                </div>
            )}

        </div >
    )
}

export default PlaceDineInOrder
