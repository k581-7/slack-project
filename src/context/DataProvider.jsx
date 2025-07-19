import { useState, createContext, useContext } from "react";

// React Context is a way to manage state globally.
// createContext is a method provided by React's Context API. It facilitates a way to pass data through the component without having to pass props down manually at every level.
const DataContext = createContext();

const DataProvider = ({children}) => {
    const [userHeaders, setUserHeaders] = useState('');
    // create a function that arranges the userHeaders
    const handleHeaders = (header) => {
        const updatedHeader = {
            'access-token': header['access-token'],
            uid: header.uid,
            expiry: header.expiry,
            client: header.client
        }
        setUserHeaders(updatedHeader);
    }

    return (
        // built in component from React Context
        // returns React Element
        <DataContext.Provider value={
            {
                handleHeaders,
                userHeaders
            }
        }>
            {/* children are the elements that can use what's in our value object */}
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => {
    // useContext - a React Hook that lets you read and subscribe to context from your component.
    return useContext(DataContext);
}

export default DataProvider;
