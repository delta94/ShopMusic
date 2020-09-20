import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-elements';

import NavigationService from 'navigation/NavigationService';
import ImageCustom from 'components/ImageCustom';
import { Colors } from 'styles/global.style';

const ViewProfile = () => {
    const goToProfile = useCallback(() => {
        NavigationService.navigate('ProfileScreen');
    }, []);

    return (
        <TouchableHighlight onPress={goToProfile} underlayColor="#d6d6d6">
            <View style={styles.container}>
                <ImageCustom
                    source={{
                        uri:
                            'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/avatars/3/a/6/d/3a6de9f068f10fcee2c50cdf9772ebaa.jpg',
                    }}
                    resizeMode="cover"
                    style={styles.viewAvatar}
                />

                <View style={styles.viewContainer}>
                    <Text style={styles.textName}>Ngô Ngọc Đạt</Text>
                    <Text style={styles.textViewProfile}>Xem thông tin</Text>
                </View>

                <Icon type="entypo" name="chevron-thin-right" color={Colors.black} size={17} />
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomColor: '#d6d6d6',
        borderBottomWidth: 0.5,
    },
    viewAvatar: { width: 60, height: 60, borderRadius: 60 / 2 },
    viewContainer: { flex: 1, paddingLeft: 10 },
    textName: { fontSize: 22, fontFamily: 'System', fontWeight: '700' },
    textViewProfile: { marginTop: 5, fontSize: 11, color: '#757575', fontWeight: '500' },
});

export default ViewProfile;
