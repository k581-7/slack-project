import Message from "../Message/Message";
import SideBar from "../../components/Navigation/SideBar";
import UserList from "../../components/UserList/UserList";
import { useParams } from 'react-router-dom';
import ChannelList from "../../components/Channel/ChannelList";
import ChannelMessage from "../../components/Channel/ChannelMsg";
import React, { useState } from "react";

function Home() {
  const [selectedChannel, setSelectedChannel] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SideBar
      onChannelSelect={(channel) => setSelectedChannel(channel)}
      selectedChannelId={selectedChannel?.id}
      />

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column"}}>
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
          <Message />
        </div>
      </div>
        )}
    </div>
    </div>
  );
}

export default Home;
