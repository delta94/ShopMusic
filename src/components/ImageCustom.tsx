import React, { useRef, FC, useCallback, useMemo, memo } from 'react';
import { Animated, StyleSheet, View, Platform, StyleProp, ViewStyle, ImageProps } from 'react-native';
import debounce from 'lodash/debounce';
import FastImage from 'react-native-fast-image';

interface IProps extends ImageProps {
    PlaceholderContent?: React.ReactElement<any>;
    containerStyle?: StyleProp<ViewStyle>;
    placeholderStyle?: StyleProp<ViewStyle>;
    transition?: boolean;
}

const ImageCustom: FC<IProps> = props => {
    const { placeholderStyle, PlaceholderContent, containerStyle, style, children, ...attributes } = props;

    const hasImage = useMemo(() => Boolean(attributes.source), [attributes.source]);
    const placeholderOpacity = useRef(new Animated.Value(1)).current;

    const onLoadComponent = useCallback(
        e => {
            const { transition, onLoad } = props;

            if (!transition) {
                placeholderOpacity.setValue(0);
                return;
            }

            const minimumWait = 100;
            const staggerNonce = 200 * Math.random();

            debounce(
                () => {
                    Animated.timing(placeholderOpacity, {
                        toValue: 0,
                        duration: 350,
                        useNativeDriver: Platform.OS === 'android' ? false : true,
                    }).start();
                },
                Platform.OS === 'android' ? 0 : Math.floor(minimumWait + staggerNonce),
            )();

            onLoad && onLoad(e);
        },
        [placeholderOpacity, props],
    );

    return (
        <View accessibilityIgnoresInvertColors={true} style={StyleSheet.flatten([styles.container, containerStyle])}>
            <FastImage
                {...attributes}
                onLoad={onLoadComponent}
                style={StyleSheet.flatten([StyleSheet.absoluteFill, style])}
            />

            <Animated.View
                pointerEvents={hasImage ? 'none' : 'auto'}
                accessibilityElementsHidden={hasImage}
                importantForAccessibility={hasImage ? 'no-hide-descendants' : 'yes'}
                // eslint-disable-next-line react-native/no-inline-styles
                style={[styles.placeholderContainer, { opacity: hasImage ? placeholderOpacity : 1 }]}>
                <View
                    testID="RNE__Image__placeholder"
                    style={StyleSheet.flatten([style, styles.placeholder, placeholderStyle])}>
                    {PlaceholderContent}
                </View>
            </Animated.View>

            <View style={style}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'hidden',
    },
    placeholderContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    placeholder: {
        backgroundColor: '#bdbdbd',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

ImageCustom.defaultProps = {
    transition: true,
};

export default memo(ImageCustom);
