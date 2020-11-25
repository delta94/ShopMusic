import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    ListScreen: { type: 'songs' | 'song_demos'; category_id: string; title: string };
};

export type ListScreenRouteProp = RouteProp<RootStackParamList, 'ListScreen'>;
