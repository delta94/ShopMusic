import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import 'dayjs/locale/vi';
import { ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';

import { RootState } from 'store';
import { User } from 'types/Auth/AuthResponse';

const ChatScreen = () => {
    const user = useSelector<RootState, User>(state => state.auth.user);
    const [messages, setMessages] = useState<IMessage[]>([]);

    const collectionUser = firestore().collection(user.uuid);

    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('light-content', true);
    }, []);

    useFocusEffect(changeStatusBar);

    useEffect(() => {
        const subscriber = collectionUser.orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
            const newMessage: any[] = [];

            querySnapshot.forEach(documentSnapshot => {
                newMessage.push({
                    ...documentSnapshot.data(),
                    createdAt: documentSnapshot.data().createdAt.toDate(),
                });
            });

            setMessages(newMessage);
        });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSend = useCallback(
        (messagesSend = []) => {
            collectionUser.add({ ...messagesSend[0] });
        },
        [collectionUser],
    );

    const renderLoading = useCallback(() => <ActivityIndicator />, []);

    return (
        <GiftedChat
            renderLoading={renderLoading}
            placeholder="Chat với Amdin"
            locale="vi"
            messages={messages}
            textInputStyle={styles.textInputStyle}
            showUserAvatar
            onSend={onSend}
            user={{
                _id: user.info.uuid,
                name: user.info.fullname,
                avatar: user.info.avatar,
            }}
        />
    );
};

const styles = StyleSheet.create({
    textInputStyle: { fontSize: 14 },
});

export default memo(ChatScreen);
