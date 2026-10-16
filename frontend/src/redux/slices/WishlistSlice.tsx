import { IProduct } from "@/app/_interfaces/products";
import { getAllWishlistItems } from "@/app/_services/wishlist.services";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
const initialState = {
    wishlistCount: 0,
    wishlistIds: [] as string[]
}
const updateWishlistCountAsync = createAsyncThunk(
    'wishlist/updateWishlistCount',
    async () => {
        const res = await getAllWishlistItems()
        if (res.status === 'success') {
            return {
                count: res.data.length,
                ids: res.data.map((item: IProduct) => item._id)
            }
        } else {
            return {
                count: 0,
                ids: []
            }
        }
    }
)
const WishlistSlice = createSlice({
    initialState,
    name: 'Wishlist',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(updateWishlistCountAsync.fulfilled, (state, action: PayloadAction<{ count: number, ids: string[] }>) => {
            state.wishlistCount = action.payload.count
            state.wishlistIds = action.payload.ids
        })
    }

})
export const WishlistReducer = WishlistSlice.reducer
export { updateWishlistCountAsync }
