import { useEffect, useState } from "react";
import axios from "axios";
import { useData } from '../../context/DataProvider';

const API_URL = import.meta.env.VITE_API_URL;

function UserList() {

    const { userHeaders } = useData();
    const [userList, setUserLists] = useState([]);
    const getUserList = async () => {
        try {
            const requestHeaders = {
              headers: userHeaders
            }
            const response = await axios.get(`${API_URL}/users`, requestHeaders);
            const { data } = response;
            setUserLists(data.data);
        } catch (error) {
            if(error) {
            return alert("Cannot get user");
            }
        }
    } 

    useEffect(() => {
      if(userList.length === 0) {
        getUserList();
      }
    })

    return (
      <div className="user">
          {
            userList && 
            userList.map((user) => {
              const { id, email } = user;
              return (
                <div key={id}>
                  <p>{email}</p>
                </div>
              )
            })
          }
          {
            !userList && <div>No user available...</div>
          }
      </div>
    );
  }
  
  export default UserList;
  