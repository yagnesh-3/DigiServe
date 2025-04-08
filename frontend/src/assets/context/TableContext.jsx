import React, { createContext, useContext, useState, useEffect } from "react";


const TableContext = createContext();

export const TableProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [tableSel, setTableSel] = useState("");
    const [tables, setTables] = useState([]);
    const [table, setTable] = useState([]);
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [price, setPrice] = useState(0);
    const [orderId, setOrderId] = useState("");

    // const gst = (price * 0.10).toFixed(2);
    // const total = (price + parseFloat(gst)).toFixed(2);

    // 🛒 Fetch Menu
    async function getMenu() {
        try {
            const response = await fetch(`${backendUrl}/product/get-products`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();
            setMenu(data);
        } catch (error) {
            console.error("Error fetching menu:", error);
        }
    }

    // 🏷️ Fetch Tables
    const getTables = async () => {
        try {
            const response = await fetch(`${backendUrl}/table/get-tables`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const tables = await response.json();
            setTables(tables.data); // Assuming API returns an array
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    };

    const getTable = async (tableSel) => {
        try {
            const response = await fetch(`${backendUrl}/table/get-table`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    tableSel,
                }),

            });
            const table = await response.json();
            setTable(table.data); // Assuming API returns an array
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
                    "Authorization": `Bearer ${localStorage.getItem("token")}`

                },
                body: JSON.stringify({ tableName }),
            });

            if (!response.ok) {
                throw new Error("Failed to add table");
            }


        } catch (error) {
            console.error("Error adding table:", error);
        }
    };



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
    async function addItem(item) {
        try {

            await fetch(`${backendUrl}/cart/addItem`,
                {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ item, tableSel })
                })
            getCart(tableSel)
        } catch (error) {
            console.log(error)
        }

    }

    async function updateQuantity(id, quantity) {
        try {
            const data = await fetch(`${backendUrl}/cart/updateQuantity`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    id,
                    quantity,
                    tableSel,

                })
            })
            const resp = await data.json();
            console.log("dec", resp, "del")
            if (resp.quantity === 0) {
                await fetch(`${backendUrl}/cart/removeItem`, {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        id,
                        tableSel,

                    })
                })
            }
            getCart(tableSel)


        } catch (error) {
            console.log({ error })
        }
    }

    async function getCart(tableSel) {
        console.log("getcartcalled")

        try {
            const data = await fetch(`${backendUrl}/cart/getCart`,
                {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ tableSel })

                })

            const cart = await data.json()
            setCart(cart)
        } catch (error) {
            console.log(error)
        }
    }
    // async function getCart() {
    //     console.log("getcartcalled")

    //     try {
    //         const data = await fetch(`${backendUrl}/cart/getCart`,
    //             {
    //                 method: "POST",
    //                 headers: { "content-type": "application/json" },
    //                 body: JSON.stringify({ tableSel })

    //             })

    //         const cart = await data.json()
    //         setCart(cart)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

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
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },

        })
        getMenu()
    }

    async function addNewItem(item) {
        try {
            const data = await fetch(`${backendUrl}/product/add-product`, {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ item })
            })
            const resp = await data.json()
            console.log(resp);
            getMenu();
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getMenu();
        getTables();
        getOrderId();


    }, []);


    async function placeOrder() {
        try {
            const data = await fetch(`${backendUrl}/order/place-order`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ tableSel, orderId })
            })
            const responce = data.json();
            return responce
        } catch (error) {
            return error
        }
    }
    async function updateItem(id, item) {
        try {
            item.id = id
            const data = await fetch(`${backendUrl}/product/edit`, {
                method: 'PUT',
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ item })
            })
            const resp = await data.json()
            console.log(resp);
            getMenu();
        } catch (error) {
            console.log(error)
        }
    }

    async function getOrderId() {
        try {
            const response = await fetch(`${backendUrl}/order/orderId`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },

            });
            const data = await response.json();
            setOrderId(data);
        } catch (error) {
            console.error("Error fetching order ID:", error);
        }
    }

    async function getOrders() {
        try {
            const response = await fetch(`${backendUrl}/order/orders`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },

            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error)
        }
    }

    async function handlePayment(id) {
        try {
            const request = await fetch(`${backendUrl}/order/handlePayment`, {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ id })
            })
            const response = await request.json()
            return response
        } catch (error) {
            console.log("error")
            return { error }
        }
    }


    return (
        <TableContext.Provider
            value={{
                handlePayment,
                placeOrder,
                updateItem,
                addNewItem,
                backendUrl,
                setTableSel,
                tableSel,
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
                getOrderId,
                table,
                getTable,
                getOrders
            }}
        >
            {children}
        </TableContext.Provider>
    );
};

// ✅ Export `useTables` hook
export const useTables = () => useContext(TableContext);
