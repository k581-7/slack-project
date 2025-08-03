import Message from "../Message/Message";
import SideBar from "../../components/Navigation/SideBar";
import ChannelMessage from "../../components/Channel/ChannelMsg";
import React, { useState, useEffect } from "react";
import { useData } from '../../context/DataProvider';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function Home({onLogOut}) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const { userHeaders, setAllUsers } = useData();

 const getUsers = async () => {
    try {
      const requestHeaders = { headers: userHeaders };
      const response = await axios.get(`${API_URL}/users`, requestHeaders);
      const userList = response.data.data || [];
      setAllUsers(userList);
    } catch (error) {
      console.error("Cannot get users:", error);
    }
  };

    useEffect(() => {
      getUsers();
      console.log('SelectedUser :', selectedUser);
    }, []);
      console.log('SelectedUser :', selectedUser);
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SideBar
        onUserSelect={(user) => {
          setSelectedUser(user);
          setSelectedChannel(null);
        }}
        selectedUserId={selectedUser?.id}
        onChannelSelect={(channel) => {
          setSelectedChannel(channel);
          setSelectedUser(null);
        }}
        selectedChannelId={selectedChannel?.id}
        setMessages={setMessages}
        className='log-out' onLogOut={onLogOut}
      />

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {selectedChannel ? (
          <ChannelMessage channel={selectedChannel} />
        ) : (
          <div
            style={{
              flexGrow: 1,
              padding: "1rem",
              backgroundColor: "#fef3e2",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <h1></h1>

            <div style={{ marginTop: "auto" }}>
              {selectedUser && (
                <Message receiverId={selectedUser.id} receiverType="User" messages={messages} setMessages={setMessages} />
              )}
              {selectedChannel && (
                <Message channelId={selectedChannel.id} receiverType="Channel" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
