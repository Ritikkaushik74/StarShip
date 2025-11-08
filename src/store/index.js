import { configureStore } from '@reduxjs/toolkit';
import starshipsReducer from '../features/starships/starshipsSlice';
import cartReducer from '../features/cart/cartSlice';
import creditsReducer from '../features/credits/creditsSlice';

export const store = configureStore({
  reducer: {
    starships: starshipsReducer,
    cart: cartReducer,
    credits: creditsReducer,
  },
});
