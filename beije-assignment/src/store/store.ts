import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import productReducer from '../slices/productSlice';
import packetReducer from '../slices/packetSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    packet: packetReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
