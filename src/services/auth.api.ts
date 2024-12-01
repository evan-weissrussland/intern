import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState = {
  authData: {
    isBlocked: false,
    myEmail: '' as null | string,
    myId: null as null | number,
    myUserName: '' as null | string,
  },
}

export type AppInitialStateType = typeof initialState

const slice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    setMyEmail: (
      state,
      action: PayloadAction<{
        authData: {
          email: null | string
          isBlocked: boolean
          userId: null | number
          userName: null | string
        }
      }>
    ) => {
      state.authData.myEmail = action.payload.authData.email
      state.authData.myId = action.payload.authData.userId
      state.authData.myUserName = action.payload.authData.userName
      state.authData.isBlocked = action.payload.authData.isBlocked
    },
  },
})

export const authReducer = slice.reducer
export const authActions = slice.actions
