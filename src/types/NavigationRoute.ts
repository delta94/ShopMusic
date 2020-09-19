import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    PhotosFromReviewsScreen: { initialPage?: number; dataReviews: number[] };
};

export type PhotosFromReviewsScreenRouteProp = RouteProp<RootStackParamList, 'PhotosFromReviewsScreen'>;
