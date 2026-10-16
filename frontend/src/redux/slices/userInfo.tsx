import { createSlice } from "@reduxjs/toolkit";

const userInfoSlice = createSlice({
    name:'userInfo',
    initialState:{
        name:'',
        phone:''
    },
    reducers:{
        setUserInfo:(state,action)=>{
            state.name = action.payload.name
            state.phone = action.payload.phone
        }
    }
})
export const {setUserInfo} = userInfoSlice.actions
export const userInfoReducer = userInfoSlice.reducer
