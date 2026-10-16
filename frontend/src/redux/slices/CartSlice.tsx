import { ICartItem } from "@/app/_interfaces/order";
import { getUserCart } from "@/app/_services/cart.services";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const updateCartCountAsync = createAsyncThunk('cartCount/update', async () => {
    const res = await getUserCart()
    if (res.status === 'success') {
        return {
            count :res.numOfCartItems,
            ids : res.data.products.map((item:ICartItem) => item.product._id) as string[],
        }
    } else {
        return {
            count : 0,
            ids : [] as string[],
        }
    }
})

const initialState = {
    count: 0,
    cartIds: [] as string[],
}
const CartCountSlice = createSlice({
    name: 'CartCount',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(updateCartCountAsync.fulfilled, (state, action: PayloadAction<{ count: number, ids: string[] }>) => {
            state.count = action.payload.count
            state.cartIds = action.payload.ids
        })
    },
})

export const CartCountReducer = CartCountSlice.reducer
export { updateCartCountAsync };

