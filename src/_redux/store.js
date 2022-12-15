import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import userReducer from '@/_redux/features/user/userSlice';
import tuitionSlice from '@/_redux/features/tuition/tuitionSlice';

const reducers = combineReducers({
    user: userReducer,
    tuition: tuitionSlice,
});

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export default store;
