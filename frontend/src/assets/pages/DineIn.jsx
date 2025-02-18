import React, { useEffect, useState } from "react";
import { useTables } from "../context/TableContext.jsx";
import mystyle from "./css/DineIn.module.css";

const DineIn = () => {
    const { tables, addItem, getCart, menu, cart, addItem2, removeItem, orderId, updateQuantity } = useTables();
    const [tableSel, setTableSel] = useState("");

    // Fetch cart whenever tableSel changes
    useEffect(() => {
        if (tableSel) {
            getCart(tableSel);
        }
    }, [tableSel]);

    function selectTable(table) {
        setTableSel(table.tableName);
    }

    let price = cart?.cart?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
    const gst = (price * 0.10).toFixed(2);
    const total = (price + parseFloat(gst)).toFixed(2);

    return (
        <div>
            <h1>Dine in</h1>
            <div>
                {tables.map((item) => (
                    <button
                        onClick={() => selectTable(item)}
                        key={item._id}
                        className={item.tableName === tableSel ? mystyle.tableBtnSel : mystyle.tableBtn}
                    >
                        {item.tableName}
                    </button>
                ))}
            </div>
            {tableSel && (
                <div className={mystyle.mainContainer}>
                    {/* Menu */}
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
                                    <button className={mystyle.addBtn} onClick={() => addItem(item, tableSel)}>
                                        Add to Order
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart */}
                    <div className={mystyle.currentCart}>
                        {cart?.cart?.length > 0 ? (
                            <>
                                <div className={mystyle.cartContainer}>
                                    {cart.cart.map((item) => (
                                        <div key={item._id} className={mystyle.cartItem}>
                                            <img src={item.imageUrl} alt={item.name} />
                                            <div className={mystyle.cartHead}>
                                                <p>{item.name}</p>
                                                <p className={mystyle.price}>₹ {item.price * item.quantity}</p>
                                            </div>
                                            <div className={mystyle.btnDiv}>
                                                <button onClick={() => updateQuantity(item._id, tableSel, -1)} className={mystyle.qbtn1}>-</button>
                                                <p>{item.quantity}</p>
                                                <button onClick={() => updateQuantity(item._id, tableSel, 1)} className={mystyle.qbtn2}>+</button>
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
                                    <button className={mystyle.orderBtn}>Place Order</button>
                                </div>
                            </>
                        ) : (
                            <p>No items in cart</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DineIn;
