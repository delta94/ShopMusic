import React, { FC, memo } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-elements';

import ImageCustom from 'components/ImageCustom';

interface IProsp {
    onPress?: () => void;
}

const ItemList: FC<IProsp> = ({ onPress }) => {
    return (
        <TouchableHighlight underlayColor="#d6d6d6" onPress={onPress}>
            <View style={styles.container}>
                <ImageCustom
                    source={{
                        uri:
                            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/d/8/9/9/d8996a26339f7b7a5d596666f03edac0.jpg',
                    }}
                    resizeMode="cover"
                    style={styles.viewImage}
                />

                <View style={styles.viewContent}>
                    <Text style={styles.nameMusic} numberOfLines={1}>
                        Laung Gawacha
                    </Text>
                    <Text style={styles.textMins}>12:13 mins</Text>
                </View>

                <Icon type="entypo" name="dots-three-vertical" color="#757575" size={20} />
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    viewImage: { width: 60, height: 60, borderRadius: 5 },
    viewContent: { flex: 1, paddingLeft: 10 },
    nameMusic: { fontSize: 16, fontWeight: '600' },
    textMins: { fontSize: 12, marginTop: 3, color: '#757575', fontWeight: '500' },
});

export default memo(ItemList);
