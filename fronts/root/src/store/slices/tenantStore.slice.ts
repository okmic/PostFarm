import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IUser } from "../../../../../services/app/src/models/User.model"

interface TenantStoreState {
    users: IUser[]
}

const initialState: TenantStoreState = {
    users: [],
}

const tenantStoreSlice = createSlice({
    name: 'tenantStore',
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<{ users: IUser[] }>) => {
            state.users = action.payload.users
        },
    }
})

export const { setUsers } = tenantStoreSlice.actions
export default tenantStoreSlice.reducer
