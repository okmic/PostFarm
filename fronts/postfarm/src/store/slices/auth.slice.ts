import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IUser } from '../../pkg/types/user'

interface AuthState {
  authStatus: "auth" | "notAuth" | "loading"
  user: IUser | null
}

const initialState: AuthState = {
  authStatus: "loading",
  user: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.authStatus = "notAuth"
      localStorage.removeItem('token')
    },
    updateLoadingStatus: (state, action: PayloadAction<{ status: AuthState["authStatus"] }>) => {
      state.authStatus = action.payload.status
    },
    authStatus(state, action: PayloadAction<{status: AuthState["authStatus"], user: IUser | null}>) {
      state.user = action.payload.user
      state.authStatus = action.payload.status
      state.user = action.payload.user
    },
    updateStateUser(state, action: PayloadAction<{user: Partial<IUser>}>) {
      if(state.user) state.user = { ...state.user, ...action.payload.user }
    },
  }
})

export const { logout, authStatus, updateStateUser, updateLoadingStatus } = authSlice.actions
export default authSlice.reducer