import { IAddress } from "@/app/_interfaces/address";
import { createSlice } from "@reduxjs/toolkit";

const initialState :IAddress = {
    _id: "",
    name: "",
    details: "",
    phone: "",
    city: ""
}
const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        setAddress: (state, action) => {
            state.phone = action.payload.phone
            state.city = action.payload.city
            state.details = action.payload.details
            state._id = action.payload._id
            state.name = action.payload.name
        }
    }
})
export const { setAddress } = addressSlice.actions
export const addressReducer = addressSlice.reducer
