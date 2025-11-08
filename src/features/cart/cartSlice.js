import { createSlice } from '@reduxjs/toolkit';
import { creditsToAED } from '../../utils/currency';

const MAX_QUANTITY = 5;

const initialState = {
  items: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const starship = action.payload;
      const id = starship.id;

      if (state.items[id]) {
        if (state.items[id].quantity < MAX_QUANTITY) {
          state.items[id].quantity += 1;
        }
      } else {
        state.items[id] = {
          starship,
          quantity: 1,
        };
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;

      if (state.items[id]) {
        if (state.items[id].quantity > 1) {
          state.items[id].quantity -= 1;
        } else {
          delete state.items[id];
        }
      }
    },
    setQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        delete state.items[id];
      } else if (quantity <= MAX_QUANTITY) {
        if (state.items[id]) {
          state.items[id].quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const selectCartItems = (state) => state.cart.items;

export const selectCartItemsArray = (state) => {
  return Object.values(state.cart.items);
};

export const selectTotalQuantity = (state) => {
  return Object.values(state.cart.items).reduce(
    (total, item) => total + item.quantity,
    0
  );
};

export const selectTotalPrice = (state) => {
  return Object.values(state.cart.items).reduce((total, item) => {
    const price = creditsToAED(item.starship.cost_in_credits);
    if (typeof price === 'number') {
      return total + price * item.quantity;
    }
    return total;
  }, 0);
};

export const selectCartItemQuantity = (state, starshipId) => {
  return state.cart.items[starshipId]?.quantity || 0;
};

export const { addToCart, removeFromCart, setQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
