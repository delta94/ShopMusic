import React, { memo, useCallback, useEffect, useState } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import 'dayjs/locale/vi';
import { ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const ChatScreen = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);

    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('light-content', true);
    }, []);

    useFocusEffect(changeStatusBar);

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
                createdAt: new Date(),
                quickReplies: {
                    type: 'radio', // or 'checkbox',
                    keepIt: true,
                    values: [
                        {
                            title: '😋 Yes',
                            value: 'yes',
                        },
                        {
                            title: '📷 Yes, let me show you with a picture!',
                            value: 'yes_picture',
                        },
                        {
                            title: '😞 Nope. What?',
                            value: 'no',
                        },
                    ],
                },
                user: {
                    _id: 2,
                    name: 'React Native',
                },
            },
            {
                _id: 2,
                text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
                createdAt: new Date(),
                quickReplies: {
                    type: 'checkbox', // or 'radio',
                    values: [
                        {
                            title: 'Yes',
                            value: 'yes',
                        },
                        {
                            title: 'Yes, let me show you with a picture!',
                            value: 'yes_picture',
                        },
                        {
                            title: 'Nope. What?',
                            value: 'no',
                        },
                    ],
                },
                user: {
                    _id: 2,
                    name: 'React Native',
                },
            },
        ]);
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    }, []);

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
                _id: 1,
                name: 'Ngô Ngọc Đạt',
            }}
        />
    );
};

const styles = StyleSheet.create({
    textInputStyle: { fontSize: 14 },
});

export default memo(ChatScreen);
