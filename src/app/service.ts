import { Alert, Platform } from 'react-native';
import TrackPlayer from 'react-native-track-player';

import { actions as actionsHome } from 'modules/home/store';
import { AppDispatch } from 'store';

const Handler = (dispatch: AppDispatch) => {
    TrackPlayer.addEventListener('remote-play', () => dispatch(actionsHome.setUserPlaying(true)));

    TrackPlayer.addEventListener('remote-pause', () => dispatch(actionsHome.setUserPlaying(false)));

    TrackPlayer.addEventListener('remote-stop', () => {
        dispatch(actionsHome.setUserPlaying(false));
        TrackPlayer.stop();
    });

    TrackPlayer.addEventListener('remote-next', () => TrackPlayer.skipToNext());

    TrackPlayer.addEventListener('remote-previous', async () => {
        const time = await TrackPlayer.getPosition();

        if (time <= 3) {
            TrackPlayer.skipToPrevious();
        } else {
            TrackPlayer.seekTo(0);
        }
    });

    TrackPlayer.addEventListener('remote-seek', ({ position }) => TrackPlayer.seekTo(position));

    if (Platform.OS !== 'ios') {
        // this event type is not supported on iOS
        TrackPlayer.addEventListener('remote-duck', ({ ducking }) => {
            TrackPlayer.setVolume(ducking ? 0.5 : 1);
        });
    }
    TrackPlayer.addEventListener('playback-state', () => {
        dispatch(actionsHome.playbackState());
    });

    TrackPlayer.addEventListener('playback-track-changed', async () => {
        await dispatch(actionsHome.playbackTrack());
        dispatch(actionsHome.getDuration());
        dispatch(actionsHome.getPosition());
    });

    TrackPlayer.addEventListener('playback-queue-ended', ({ track }) => {
        dispatch(actionsHome.setLastIdTrack(track));
    });

    TrackPlayer.addEventListener('playback-error', () => {
        Alert.alert('Something went wrong. Please try again later.');
    });
};

export default (dispatch: AppDispatch) => Handler.bind(null, dispatch);
