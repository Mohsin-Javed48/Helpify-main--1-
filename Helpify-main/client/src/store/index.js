import { configureStore } from '@reduxjs/toolkit';
import bookingsReducer from './bookingsSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    bookings: bookingsReducer,
    // Add other reducers here as needed
  },
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
