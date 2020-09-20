import ImageCustom from 'components/ImageCustom';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import React, { FC, Fragment, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';

import { Colors } from 'styles/global.style';
import { PlayIcon } from 'assets/svg';
import ItemList from './ItemList';
import { Icon } from 'react-native-elements';

const { width } = Dimensions.get('window');

interface IProps {
    navigation: NavigationProp<any>;
}

const ListScreen: FC<IProps> = ({ navigation }) => {
    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('light-content', true);
    }, []);

    useFocusEffect(changeStatusBar);

    const renderItem = useCallback(() => <ItemList onPress={() => {}} />, []);
    const listHeaderComponent = useCallback(
        () => <Text style={styles.textHeaderList}>Danh sách nhạc nghe thử</Text>,
        [],
    );
    const itemSeparatorComponent = useCallback(() => <View style={styles.itemSeparatorComponent} />, []);
    const listFooterComponent = useCallback(
        () => (
            <View style={styles.listFooterComponent}>
                <ActivityIndicator size="small" />
            </View>
        ),
        [],
    );

    return (
        <Fragment>
            <View>
                <ImageCustom
                    source={{
                        uri:
                            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/d/8/9/9/d8996a26339f7b7a5d596666f03edac0.jpg',
                    }}
                    resizeMode="cover"
                    style={styles.imageView}
                />

                <TouchableOpacity style={styles.viewIconPlay}>
                    <PlayIcon fill={Colors.primary} height={59} width={59} />
                </TouchableOpacity>

                <TouchableOpacity onPress={navigation.goBack} style={styles.iconBack}>
                    <Icon type="ant-design" name="leftcircle" color={Colors.white} size={35} />
                </TouchableOpacity>
            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                data={[1, 2, 3, 4, 5, 6]}
                style={styles.flatList}
                ItemSeparatorComponent={itemSeparatorComponent}
                ListHeaderComponent={listHeaderComponent}
                renderItem={renderItem}
                ListFooterComponent={listFooterComponent}
            />
        </Fragment>
    );
};

const styles = StyleSheet.create({
    imageView: { width, height: 360 },
    viewIconPlay: { position: 'absolute', bottom: -45, right: 10, zIndex: 199 },
    textHeaderList: { fontSize: 20, fontWeight: '600', paddingLeft: 10, marginBottom: 20 },
    flatList: { paddingTop: 20 },
    itemSeparatorComponent: { height: 10 },
    listFooterComponent: { height: 100, alignItems: 'center', justifyContent: 'center' },
    iconBack: { position: 'absolute', left: 15, top: 50 },
});

export default ListScreen;
