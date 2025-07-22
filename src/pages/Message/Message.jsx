import { useState } from "react";
import { useData } from "../../context/DataProvider";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function Message() {
    const { userHeaders } = useData();
    const [receiver, setReceiver] = useState();
    const [message, setMessage] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const requestBody = {
                receiver_id: Number(receiver),
                receiver_class: "User",
                body: message
            }

            const requestHeaders = {
                headers: userHeaders
            }

            const response = await axios.post(`${API_URL}/messages`, requestBody, requestHeaders);
            const { data } = response;
            if(data.data){
                console.log(data.data);
                return alert("Successfully sent a message!");
            }
        } catch (error) {
            if(error) {
                return alert("Cannot send message");
            }
        }
    };

    return (
        <div className="sendMessage">
            <form onSubmit={handleSubmit}>
                <label>Send to:</label>
                <input
                    type="number"
                    className="input-style"
                    onChange={(event) => setReceiver(event.target.value)}
                >
                </input>
                <label>Message:</label>
                <input
                    type="text"
                    className="input-style"
                    onChange={(event) => setMessage(event.target.value)}
                >
                </input>
                <button type='submit'>Send Message</button>
            </form>
        </div>
    );
};

export default Message;