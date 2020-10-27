import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    ListScreen: { type: 'songs' | 'song_demos' };
};

export type ListScreenRouteProp = RouteProp<RootStackParamList, 'ListScreen'>;
