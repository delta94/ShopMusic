import React, { useState, useCallback, useEffect, memo, ReactNode, FC } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from 'styles/global.style';

const styles = StyleSheet.create({
    background: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    styleModal: { margin: 0 },
    viewActivityIndicator: {
        height: 70,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F4F4F4',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    textLoading: {
        fontSize: 13,
        color: '#757575',
        marginTop: 10,
        fontWeight: '500',
    },
});

interface IProps {
    cancelable?: boolean;
    overlayColor?: string;
    visible: boolean;
    customIndicator?: ReactNode;
}

const LoadingOverlay: FC<IProps> = ({ cancelable, overlayColor, visible, customIndicator, children }) => {
    const [visibleState, setVisibleState] = useState(visible);

    const close = useCallback(() => {
        setVisibleState(false);
    }, []);

    useEffect(() => {
        setVisibleState(visible);
    }, [visible]);

    const handleOnRequestClose = useCallback(() => {
        if (cancelable) {
            close();
        }
    }, [cancelable, close]);

    const renderDefaultContent = useCallback(() => {
        return (
            <View style={styles.background}>
                {customIndicator ? (
                    customIndicator
                ) : (
                    <View style={styles.viewActivityIndicator}>
                        <ActivityIndicator color={Colors.primary} size="small" />
                    </View>
                )}
            </View>
        );
    }, [customIndicator]);

    return (
        <Modal
            useNativeDriver
            animationIn="fadeIn"
            animationOut="fadeOut"
            backdropColor={overlayColor}
            onBackButtonPress={handleOnRequestClose}
            style={styles.styleModal}
            isVisible={visibleState}>
            {children ? children : renderDefaultContent()}
        </Modal>
    );
};

LoadingOverlay.defaultProps = {
    visible: false,
    cancelable: false,
    overlayColor: 'rgba(0, 0, 0, 0.7)',
};

export default memo(LoadingOverlay);
