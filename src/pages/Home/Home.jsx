import React from "react";
import Message from "../Message/Message";
import SideBar from "../../components/Navigation/SideBar";

function Home() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SideBar />
      <div style={{ flexGrow: 1, padding: "1rem", backgroundColor: "#fef3e2" }}>
        <h1>Home Page</h1>
        <Message />
      </div>
    </div>
  );
}

export default Home;
