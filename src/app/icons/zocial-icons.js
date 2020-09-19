import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Zocial';

export const ZocialIconsPack = {
    name: 'Zocial',
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
    toReactElement: props => ZocialIcon({ name, ...props }),
});

function ZocialIcon({ name, style }) {
    const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);
    return <Icon name={name} size={height} color={tintColor} style={iconStyle} />;
}
