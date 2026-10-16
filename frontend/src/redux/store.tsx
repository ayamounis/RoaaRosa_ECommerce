
import { configureStore } from '@reduxjs/toolkit';
import { CartCountReducer } from './slices/CartSlice';
import { WishlistReducer } from './slices/WishlistSlice';
import { EmailForgetReducer } from './slices/EmailForgetSlice';
import {userInfoReducer} from './slices/userInfo';
import { addressReducer } from './slices/Address';



export const store = configureStore({
    reducer: {
        cartCount: CartCountReducer,
        wishlist: WishlistReducer,
        emailForget: EmailForgetReducer,
        userInfo:userInfoReducer,
        address: addressReducer,
    }
})
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;