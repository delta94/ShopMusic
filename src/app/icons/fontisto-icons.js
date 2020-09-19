import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';

export const FontistoIconsPack = {
    name: 'Fontisto',
    icons: createIconsMap(),
};

function createIconsMap() {
    return new Proxy(
        {},
        {
            get(target, name) {
                return IconProvider(name);
            },
        },
    );
}

const IconProvider = name => ({
    toReactElement: props => FontistoIcon({ name, ...props }),
});

function FontistoIcon({ name, style }) {
    const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);
    return <Icon name={name} size={height} color={tintColor} style={iconStyle} />;
}
