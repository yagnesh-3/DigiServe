import React, { createContext, useContext, useState, useEffect } from "react";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
    const [totOrders, setTotOrders] = useState(823); // You can update this dynamically later if needed
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    async function getData() {
        try {
            const request = await fetch(`${backendUrl}/adminDash/getData`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const response = await request.json();
            const data = [[
                {
                    title: "Total Orders",
                    value: response.totalOrders,
                    icon: "fas fa-utensils",
                    colorClass: "blue"
                },
                {
                    title: "Revenue Today",
                    value: response.revenueToday,
                    icon: "fas fa-rupee-sign",
                    colorClass: "green"
                },
                {
                    title: "Active Orders",
                    value: response.activeTables,
                    icon: "fas fa-chair",
                    colorClass: "orange"
                },
                {
                    title: "Pending Payments",
                    value: response.pendingOrders,
                    icon: "fas fa-exclamation-circle",
                    colorClass: "red"
                },
            ], response.simplifiedOrders];
            return data;
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    }

    async function updateStatus(orderId, nextStatus) {
        try {
            const request = await fetch(`${backendUrl}/adminDash/updateStatus`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    "orderId": orderId,
                    "nextStatus": nextStatus
                })
            });
            const response = await request.json();
            return response;

        } catch (error) {
            console.log("error:", error.message)
        }

    }
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    async function waiterTest() {
        try {
            const request = await fetch(`${backendUrl}/waiterDash/?userId=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`

                }
            });
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <DashboardContext.Provider value={{
            totOrders,
            getData,
            updateStatus
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => useContext(DashboardContext);
