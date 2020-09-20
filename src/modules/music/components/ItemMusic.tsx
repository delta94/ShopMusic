import React, { FC, memo } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-elements';

import { Colors } from 'styles/global.style';
import ImageCustom from 'components/ImageCustom';

interface IProps {
    title: string;
    onPress?: () => void;
    image_url: string;
}

const ItemMusic: FC<IProps> = ({ title, onPress, image_url }) => {
    return (
        <TouchableHighlight onPress={onPress} underlayColor="#d6d6d6">
            <View style={styles.container}>
                <ImageCustom source={{ uri: image_url }} resizeMode="cover" style={styles.viewAvatar} />

                <View style={styles.viewContainer}>
                    <Text numberOfLines={1} style={styles.textName}>
                        {title}
                    </Text>
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
    },
    viewAvatar: { width: 80, height: 80, borderRadius: 5 },
    viewContainer: { flex: 1, paddingLeft: 10 },
    textName: { fontSize: 17, fontFamily: 'System', fontWeight: '700' },
    textViewProfile: { marginTop: 5, fontSize: 11, color: '#757575', fontWeight: '500' },
});

export default memo(ItemMusic);
