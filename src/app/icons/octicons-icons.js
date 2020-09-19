import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

export const OcticonsIconsPack = {
    name: 'Octicons',
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
    toReactElement: props => OcticonsIcon({ name, ...props }),
});

function OcticonsIcon({ name, style }) {
    const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);
    return <Icon name={name} size={height} color={tintColor} style={iconStyle} />;
}
