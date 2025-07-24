import React from "react";
import Message from "../Message/Message";
import SideBar from "../../components/Navigation/SideBar";

function Home() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SideBar />
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

        {/* Message component placed at the bottom */}
        <div style={{ marginTop: "auto" }}>
          <Message />
        </div>
      </div>
    </div>
  );
}

export default Home;
