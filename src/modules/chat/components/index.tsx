import React, { memo, useCallback, useEffect, useState } from 'react';
import { Avatar, GiftedChat, IMessage } from 'react-native-gifted-chat';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(advancedFormat);
dayjs.extend(localizedFormat);
import 'dayjs/locale/vi';
import { ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { Avatar as AvatarRn } from 'react-native-elements';

import { RootState } from 'store';
import { User } from 'types/Auth/AuthResponse';
import FastImage from 'react-native-fast-image';
import { Colors } from 'styles/global.style';

const ChatScreen = () => {
    const user = useSelector<RootState, User>(state => state.auth.user);
    const [messages, setMessages] = useState<IMessage[]>([]);

    const collectionUser = firestore().collection('inboxs').doc(user.uuid).collection('messages');
    const collectionMessage = firestore().collection('inboxs').doc(user.uuid);

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
                });
            });

            setMessages(newMessage);
        });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        collectionMessage.update({ unread_client: 0 });
    }, [collectionMessage]);

    const onSend = useCallback(
        async (messagesSend: IMessage[] = []) => {
            collectionUser.add({ ...messagesSend[0], createdAt: Number(dayjs(messagesSend[0].createdAt).format('x')) });

            const getLastMessage: any = await collectionMessage.get().then(res => res.data());

            collectionMessage.set(
                {
                    avatar: user.info.avatar,
                    last_message: messagesSend[0].text,
                    name: user.info.fullname,
                    update_time: Number(dayjs(messagesSend[0].createdAt).format('x')),
                    unread: getLastMessage ? Number(getLastMessage.unread) + 1 : 1,
                    unread_client: 0,
                },
                { merge: true },
            );
        },
        [collectionMessage, collectionUser, user.info.avatar, user.info.fullname],
    );

    const renderLoading = useCallback(() => <ActivityIndicator />, []);

    const renderAvatar = useCallback(({ currentMessage }: Avatar<IMessage>['props']) => {
        return !!currentMessage && !!currentMessage.user && !!currentMessage.user.avatar ? (
            <FastImage source={{ uri: currentMessage?.user.avatar }} resizeMode="cover" style={styles.imageAvatar} />
        ) : (
            <AvatarRn title={currentMessage?.user.name} titleStyle={{ color: Colors.primary }} rounded size="small" />
        );
    }, []);

    return (
        <GiftedChat
            renderAvatar={renderAvatar}
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
    imageAvatar: { width: 35, height: 35, borderRadius: 35 / 2 },
});

export default memo(ChatScreen);
