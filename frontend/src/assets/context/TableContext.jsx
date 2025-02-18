import React, { createContext, useContext, useState, useEffect } from "react";


const TableContext = createContext();

export const TableProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [tables, setTables] = useState([]);
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [price, setPrice] = useState(0);
    const [orderId, setOrderId] = useState("");

    // const gst = (price * 0.10).toFixed(2);
    // const total = (price + parseFloat(gst)).toFixed(2);

    // 🛒 Fetch Menu
    async function getMenu() {
        try {
            const response = await fetch(`${backendUrl}/product/get-products`);
            const data = await response.json();
            setMenu(data);
        } catch (error) {
            console.error("Error fetching menu:", error);
        }
    }

    // 🏷️ Fetch Tables
    const getTables = async () => {
        try {
            const response = await fetch(`${backendUrl}/table/get-tables`);
            const tables = await response.json();
            setTables(tables.data); // Assuming API returns an array
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    };

    // ➕ Add Table
    const addTable = async (tableName) => {
        try {
            const response = await fetch(`${backendUrl}/table/add-table`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tableName }),
            });

            if (!response.ok) {
                throw new Error("Failed to add table");
            }

            await getTables(); // Refresh tables after adding
        } catch (error) {
            console.error("Error adding table:", error);
        }
    };

    // 📦 Fetch Order ID
    async function getOrderId() {
        try {
            const response = await fetch(`${backendUrl}/orderId`);
            const data = await response.json();
            setOrderId(`ord-${data.date}-${data.count}`);
        } catch (error) {
            console.error("Error fetching order ID:", error);
        }
    }

    // 🛒 Add Item to Cart
    function addItem2(item) {
        setCart((prevCart) => {
            const existingItem = prevCart.find((ci) => ci.item._id === item._id);
            setPrice((prevPrice) => prevPrice + item.price);

            if (existingItem) {
                return prevCart.map((it) =>
                    it.item._id === item._id ? { ...it, quantity: it.quantity + 1 } : it
                );
            } else {
                return [...prevCart, { item, quantity: 1 }];
            }
        });
    }
    async function addItem(item, tableSel) {
        try {

            await fetch(`${backendUrl}/cart/addItem`,
                {
                    method: "PUT",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ item, tableSel })
                })
            getCart(tableSel)
        } catch (error) {
            console.log(error)
        }

    }

    async function updateQuantity(id, tableSel, quantity) {
        try {
            const data = await fetch(`${backendUrl}/cart/updateQuantity`, {
                method: "PUT",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    id,
                    quantity,
                    tableSel
                })
            })
            const resp = await data.json();
            console.log(resp)
            if (resp.quantity === 0) {
                await fetch(`${backendUrl}/cart/removeItem`, {
                    method: "PUT",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        id,
                        tableSel
                    })
                })
            }
            getCart(tableSel)


        } catch (error) {
            console.log({ error })
        }
    }

    async function getCart(tableSel) {
        try {
            const data = await fetch(`${backendUrl}/cart/getCart`,
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ tableSel })

                })

            const cart = await data.json()
            setCart(cart)
        } catch (error) {
            console.log(error)
        }
    }



    // ❌ Remove Item from Cart
    function removeItem(item) {
        setPrice((prevPrice) => Math.max(0, prevPrice - item.price));
        setCart((prevCart) =>
            prevCart
                .map((it) =>
                    it.item._id === item._id ? { ...it, quantity: it.quantity - 1 } : it
                )
                .filter((it) => it.quantity > 0)
        );
    }

    async function handleDelete(id) {
        const data = await fetch(`${backendUrl}/product/delete-product/${id}`, {
            method: 'DELETE',
            headers: { "content-type": "application/json" },
        })
        getMenu()
    }

    useEffect(() => {
        getMenu();
        getTables();
        getOrderId();
    }, []);

    return (
        <TableContext.Provider
            value={{
                handleDelete,
                updateQuantity,
                tables,
                addTable,
                getTables,
                getCart,
                menu,
                getMenu,
                cart,
                addItem,
                addItem2,
                removeItem,
                orderId,
            }}
        >
            {children}
        </TableContext.Provider>
    );
};

// ✅ Export `useTables` hook
export const useTables = () => useContext(TableContext);
