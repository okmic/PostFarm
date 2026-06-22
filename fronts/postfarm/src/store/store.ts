import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth.slice'
import tenantStoreReducer from './slices/tenantStore.slice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    tenantStore: tenantStoreReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
