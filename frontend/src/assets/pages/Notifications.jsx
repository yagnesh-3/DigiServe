import React, { useState } from 'react'
import { io } from "socket.io-client";



const Notifications = () => {
    const socket = io("http://localhost:5000", {
        transports: ["websocket"],
        withCredentials: true
    });

    const data = localStorage.getItem("user");
    const user = JSON.parse(data)
    console.log("userID:", user._id);
    const [messages, setMessages] = useState([]);
    socket.on(user._id, (data) => {
        console.log(`New order received! Table: ${data.tableName}, Order ID: ${data.orderId}`);
        // alert(`New order placed for Table ${data.tableName}`);
        // Function to update UI
        setMessages((prevMessages) => [...prevMessages, data]);

        console.log(messages);
    });
    return (
        <div>
            <h1>Notifications</h1>
            <hr />
            <div>
                {messages.map((item) => {
                    return (
                        <div>
                            <p>{item.orderId}</p>
                            <p>{item.tableName}</p>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}

export default Notifications
