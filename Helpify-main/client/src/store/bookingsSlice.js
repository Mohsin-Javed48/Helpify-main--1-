import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  currentBooking: {
    userId: null,
    serviceProviderId: null,
    services: [],
    address: '',
    area: '',
    city: '',
    zipCode: '',
    additionalInfo: '',
    scheduledDate: '',
    scheduledTime: '',
    paymentMethod: 'cash',
    amount: 0,
    orderDate: '',
    status: 'pending',
  },
  loading: false,
  error: null,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    // Set all booking form fields at once
    setBookingFormData: (state, action) => {
      state.currentBooking = {
        ...state.currentBooking,
        ...action.payload,
      };
    },

    // Update specific field in the booking form
    updateBookingField: (state, action) => {
      const { field, value } = action.payload;
      state.currentBooking[field] = value;
    },

    // Add services to the current booking
    setBookingServices: (state, action) => {
      state.currentBooking.services = action.payload;
      // Calculate total amount based on services
      state.currentBooking.amount = action.payload.reduce(
        (total, service) => total + service.price * service.quantity,
        0
      );
    },

    // Set the selected service provider
    selectServiceProvider: (state, action) => {
      const { providerId, bidPrice } = action.payload;
      state.currentBooking.serviceProviderId = providerId;
      if (bidPrice) {
        state.currentBooking.amount = bidPrice;
      }
    },

    // Reset the current booking form
    resetBookingForm: (state) => {
      state.currentBooking = initialState.currentBooking;
    },

    // Save a completed booking
    saveBooking: (state, action) => {
      const newBooking = {
        ...state.currentBooking,
        id: 'ORD-' + Math.floor(Math.random() * 10000),
        orderDate: new Date().toISOString(),
        ...action.payload,
      };
      console.log('newBooking', newBooking);
      state.bookings.push(newBooking);
      return state;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Get all bookings (for history/tracking)
    fetchBookingsStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchBookingsSuccess: (state, action) => {
      state.bookings = action.payload;
      state.loading = false;
    },

    fetchBookingsFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setBookingFormData,
  updateBookingField,
  setBookingServices,
  selectServiceProvider,
  resetBookingForm,
  saveBooking,
  setLoading,
  setError,
  fetchBookingsStart,
  fetchBookingsSuccess,
  fetchBookingsFailure,
} = bookingsSlice.actions;

// Selectors
export const selectCurrentBooking = (state) => state.bookings.currentBooking;
export const selectAllBookings = (state) => state.bookings.bookings;
export const selectBookingsLoading = (state) => state.bookings.loading;
export const selectBookingsError = (state) => state.bookings.error;

export default bookingsSlice.reducer;
