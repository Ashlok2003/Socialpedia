/* eslint-disable react/prop-types */
import { createContext, useMemo, useContext } from "react";
import { io } from 'socket.io-client';
const SocketContext = createContext();

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}

export const SocketProvider = ({ children }) => {
    const socket = useMemo(() => io('http://localhost:8080'), []);
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}