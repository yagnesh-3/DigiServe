import React, { useState } from 'react';
import mystyle from './css/home.module.css';
import { FaBell } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { useTables } from '../context/TableContext'; // ✅ Use the custom hook

const Home = () => {

    const navigate = useNavigate();
    const { menu, cart, addItem2, removeItem, orderId } = useTables(); // ✅ Use useTables()
    const [price, setPrice] = useState(0);
    cart.map((item) => {
        setPrice(item.item.price * item.quantity)
    })
    let gst = price * .10;
    let total = gst + price;
    console.log(cart)
    function placeOrder() {
        navigate('/placeOrder', { state: { cart, orderId, total } });
    }

    return (
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
                        {menu.map((item) => (
                            <div key={item._id} className={mystyle.menuItem}>
                                <img src={item.imageUrl} alt="" />
                                <div className={mystyle.head}>
                                    <h3>{item.name}</h3>
                                    <h3 className={mystyle.price}>₹ {item.price}</h3>
                                </div>
                                <div className={mystyle.ingredients}>
                                    {item.ingredients.join(", ")}.
                                </div>
                                <div className={mystyle.btnDiv}>
                                    <button className={mystyle.addBtn} onClick={() => addItem2(item)}>Add to Order</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={mystyle.currentCart}>
                {cart.length === 0 ? (
                    <p className={mystyle.empty}>Cart is empty</p>
                ) : (
                    <>
                        <h1>OrderID: {orderId}</h1>
                        <div className={mystyle.cartContainer}>
                            {cart.map(({ item, quantity }) => (
                                <div key={item._id} className={mystyle.cartItem}>
                                    <img src={item.imageUrl} alt={item.name} />
                                    <div className={mystyle.cartHead}>
                                        <p>{item.name}</p>
                                        <p className={mystyle.price}>₹ {item.price * quantity}</p>
                                    </div>
                                    <div className={mystyle.btnDiv}>
                                        <button onClick={() => removeItem(item)} className={mystyle.qbtn1}>-</button>
                                        <p>{quantity}</p>
                                        <button onClick={() => addItem2(item)} className={mystyle.qbtn2}>+</button>
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
                        <button className={mystyle.orderBtn} onClick={placeOrder}>Place Order</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
