import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import LottieView from 'lottie-react-native';

const { height } = Dimensions.get('window');

const NotInternet = () => {
    return (
        <View style={styles.container}>
            <LottieView style={styles.lottie} source={require('assets/lottie/reconnect.json')} autoPlay loop />
            <Text style={styles.text}>Không tìm thấy kết nối mạng!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    lottie: { height: Platform.OS === 'ios' ? height - 200 : height - 100 },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { position: 'absolute', fontSize: 20, color: '#34b0dd', bottom: 50 },
});

export default NotInternet;
