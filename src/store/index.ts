import { configureStore, getDefaultMiddleware, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

import { reducer as homeReducer } from 'modules/home/store';
import { reducer as authReducer } from 'modules/auth/store';
import { reducer as listReducer } from 'modules/list/store';
import { reducer as musicReducer } from 'modules/music/store';

const rootReducer = combineReducers({
    home: homeReducer,
    auth: authReducer,
    list: listReducer,
    music: musicReducer,
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['storage', 'auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export default store;
