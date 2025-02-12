import React, { useEffect, useState } from 'react'
import mystyle from './css/home.module.css'
import { FaBell } from "react-icons/fa"
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { IoSearch } from "react-icons/io5";
const Home = ({ menu, getMenu }) => {
    useEffect(() => {
        getMenu()
    }, [])
    let [cart, setCart] = useState([]);
    let [price, setPrice] = useState(0);
    let gst = (price * .10).toPrecision(4);
    let total = (price + parseFloat(gst)).toPrecision(4);

    const [orderId, setOrderId] = useState("");
    let data;
    async function getOrderId() {
        data = await fetch("http://localhost:5000/orderId")
        data = await data.json()
        console.log(data)
        // setOrderId(data.id)
        setOrderId(("ord-" + data.date + "-" + data.count))
    }


    useEffect(() => {
        getOrderId();
    }, [])

    function addItem(item) {
        setCart((prevCart) => {
            const existingItem = prevCart.find((ci) => ci.item._id === item._id);
            setPrice(price + item.price)
            if (existingItem) {
                return prevCart.map((it) =>
                    it.item._id === item._id ? { ...it, quantity: it.quantity + 1 } : it
                );
            } else {
                return [...prevCart, { item, quantity: 1 }];
            }
        });
    }

    function removeItem(item) {
        console.log(item)
        setPrice(price - item.price)
        setCart((prevCart) => {
            return prevCart
                .map((it) =>
                    it.item._id === item._id ? { ...it, quantity: it.quantity - 1 } : it
                )
                .filter((it) => it.quantity > 0);
        });
    }
    return (
        <>
            <div className={mystyle.main}>
                <div className={mystyle.centerDiv}>
                    <div className={mystyle.navBar}>
                        <h1 className={mystyle.logo}>Digi<span>Serve</span></h1>

                        <div className={mystyle.searchBar}>
                            <input type="search" placeholder="Search..." className={mystyle.searchInput} />
                            <button className={mystyle.searchButton}><IoSearch className={mystyle.icon} /></button>
                        </div>

                        <NavLink to="/notifications" className={mystyle.sidebarlink}>
                            <FaBell className={mystyle.navIcon} />
                        </NavLink>
                    </div>
                    <div className={mystyle.mainmenu}>
                        <h1>Special Menu for you</h1>
                        <div className={mystyle.menuContainer}>
                            {menu.map((item) => {
                                return (
                                    <div className={mystyle.menuItem}>
                                        <img src={item.imageUrl} alt="" />
                                        <div className={mystyle.head}>
                                            <h3>{item.name}</h3>
                                            <h3 className={mystyle.price}>₹ {item.price}</h3>
                                        </div>
                                        <div className={mystyle.ingredients}>

                                            {item.ingredients.map((ingredient, key) => {
                                                return (
                                                    <p>{ingredient}{key === item.ingredients.length - 1 ? "." : ","}</p>
                                                )
                                            })}
                                        </div>
                                        <div className={mystyle.btnDiv}>
                                            <button className={mystyle.addBtn} onClick={() => addItem(item)}>Add to Order</button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className={mystyle.currentCart}>
                    {/* Conditionally render OrderID or empty message */}
                    {cart.length === 0 ? (
                        <p className={mystyle.empty}>Cart is empty</p>
                    ) : (
                        <>
                            <h1>OrderID: {orderId}</h1> {/* ✅ Order ID remains fixed at the top when cart is not empty */}
                            <div className={mystyle.cartContainer}>
                                {cart.map(({ item, quantity }) => (
                                    <div key={item.id} className={mystyle.cartItem}>
                                        <img src={item.imageUrl} alt={item.name} />
                                        <div className={mystyle.cartHead}>
                                            <p>{item.name}</p>
                                            <p className={mystyle.price}>₹ {item.price * quantity}</p>
                                        </div>
                                        <div className={mystyle.btnDiv}>
                                            <button onClick={() => removeItem(item)} className={mystyle.qbtn1}><strong>-</strong></button>
                                            <p>{quantity}</p>
                                            {/* {console.log(item.id)} */}
                                            <button onClick={() => addItem(item)} className={mystyle.qbtn2}><strong>+</strong></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <hr />
                            <div className={mystyle.total}>
                                <div className={mystyle.idiv}>
                                    <h2>Subtotal:</h2>
                                    <h2>{price}</h2>
                                </div>
                                <div className={mystyle.idiv}>
                                    <h3>GST: </h3>
                                    <h3>{gst}</h3>
                                </div>
                                <hr />
                                <div className={mystyle.idiv}>
                                    <h2>Total: </h2>
                                    <h2>{total}</h2>
                                </div>
                            </div>
                            <div className={mystyle.orderBtnDiv}>
                                <button className={mystyle.orderBtn}>Place Order</button>
                            </div>
                        </>
                    )}
                </div>





            </div >


        </>
    )
}

export default Home
