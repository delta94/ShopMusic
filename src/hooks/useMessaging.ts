// eslint-disable-next-line @typescript-eslint/no-unused-vars
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { useEffect } from 'react';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

export const useMessaging = () => {
    useEffect(() => {
        // !messaging().isDeviceRegisteredForRemoteMessages && messaging().registerDeviceForRemoteMessages();

        PushNotification.setApplicationIconBadgeNumber(0);
        messaging().subscribeToTopic('NewDemo');

        PushNotification.configure({
            onNotification: () => {},
            popInitialNotification: true,
            requestPermissions: true,
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
        });

        return () => {
            PushNotification.unregister();
        };
    }, []);

    useEffect(() => {
        messaging().onNotificationOpenedApp(remoteMessage => {
            if (remoteMessage) {
            }
        });

        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                }
            });

        const unsubscribe = messaging().onMessage(async remoteMessage => {
            const { notification } = remoteMessage;

            PushNotification.localNotification({
                title: notification.title || '',
                message: notification.body || '',
            });
        });

        return unsubscribe;
    }, []);
};
