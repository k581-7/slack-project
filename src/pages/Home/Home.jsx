import Message from "../Message/Message";
import SideBar from "../../components/Navigation/SideBar";
import ChannelMessage from "../../components/Channel/ChannelMsg";
import React, { useState } from "react";

function Home() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  console.log(messages);

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
