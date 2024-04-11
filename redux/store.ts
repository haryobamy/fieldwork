'use client';

import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import contactSlice from './contact/contactSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    contact: contactSlice,
  },
  devTools: true, // for redux devtools to be change to false before deployment
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  },
});

// const initializeApp = async () => {
//   await store.dispatch(
//     apiSlice.endpoints.getContacts.initiate({}, { forceRefetch: true })
//   );

// };

// initializeApp();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
