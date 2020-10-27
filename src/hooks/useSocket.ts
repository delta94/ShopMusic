import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import socketIO from 'socket.io-client';

import { RootState } from 'store';

export const useSocket = () => {
    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);
    const token = useSelector<RootState, string>(state => state.auth.token);

    useEffect(() => {
        let socket: SocketIOClient.Socket;

        if (isLogin) {
            socket = socketIO(`http://103.124.94.189:9333/ws/${token}`, {
                transports: ['websocket'],
                jsonp: false,
                forceNew: true,
            });

            socket.connect();

            socket.on('connect', () => {
                console.log('aaaaa');

                socket.on('disconnect', () => {});
            });
        }

        return () => {
            if (socket) {
                socket.disconnect();
                socket.removeAllListeners();
            }
        };
    }, [isLogin, token]);
};
