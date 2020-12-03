import TrackPlayer, { useTrackPlayerEvents } from 'react-native-track-player';
import { useDispatch } from 'react-redux';

import { actions as actionsHome } from 'modules/home/store';

export const useEventTrack = () => {
    const dispatch = useDispatch();

    useTrackPlayerEvents(
        [
            'playback-track-changed',
            'remote-next',
            'remote-previous',
            'remote-stop',
            'remote-pause',
            'remote-play',
            'remote-seek',
        ],
        async event => {
            if (event.type === 'playback-track-changed') {
                dispatch(actionsHome.playbackTrack());
            }

            if (event.type === 'remote-stop') {
                TrackPlayer.stop();
            }

            if (event.type === 'remote-pause') {
                TrackPlayer.pause();
            }

            if (event.type === 'remote-play') {
                TrackPlayer.play();
            }

            if (event.type === 'remote-next') {
                await TrackPlayer.skipToNext();
            }

            if (event.type === 'remote-previous') {
                await TrackPlayer.skipToPrevious();
            }

            if (event.type === 'remote-seek') {
                TrackPlayer.seekTo(event.position);
            }
        },
    );
};
