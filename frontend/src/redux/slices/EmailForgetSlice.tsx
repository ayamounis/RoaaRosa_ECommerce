import { createSlice } from "@reduxjs/toolkit";

export const EmailForgetSlice = createSlice({
    name: 'emailForget',
    initialState: {
        email: '',
    },
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload
        },
    }
})

export const { setEmail } = EmailForgetSlice.actions
export const EmailForgetReducer = EmailForgetSlice.reducer
